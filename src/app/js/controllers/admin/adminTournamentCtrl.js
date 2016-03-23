angular.module('admin.controllers.tournament', [])

  .controller('admin.controllers.tournament.ctrl', function ($scope, $state, Tournament, tournament, title) {

    $scope.title = title;

    if(tournament[0]) {
      $scope.tournament = tournament[0];
    } else {
      $scope.tournament = {
        status: 'pending',
        type: 'single',
        game: 'Hearthstone',
        current: 0,
        max: 0,
        name: null
      }
    }

    $scope.modes = Tournament.getModes();

    $scope.tourneySizes = Tournament.getSizes();

    $scope.submitTourney = function () {
      if($scope.tournament.id) {
        $scope.tournament.save().then(function (tournament) {
          $state.go('admin.tournament.details', {id: tournament.id, name: tournament.name});
        });
      } else {
        Tournament.saveTournament($scope.tournament).then(function (tournament) {
          $state.go('admin.tournament.list');
        });
      }
    }

  })

  .controller('admin.controllers.tournament.list.ctrl', function($scope, $state, Tournament) {
    $scope.tournaments = [];

    Tournament.getTournaments().then(function (tournaments) {
      $scope.tournaments = tournaments;
    });

    $scope.tournamentDetails = function (tourney) {
      $state.go('admin.tournament.details', {id: tourney.id, name: tourney.name});
    }
  })
  .controller('admin.controllers.tournament.seed.ctrl', function ($scope, $state, $stateParams, playerServices, players) {
    $scope.players = players;

    $scope.saveOrder = function () {
      playerServices.saveSeeding($scope.players).then(function (data) {
        $state.go('admin.tournament.details', {name: $stateParams.name});
      });
    }

    $scope.cancel = function () {
      $state.go('admin.tournament.details', {name: $stateParams.name});
    }
  })

  .controller('admin.controllers.tournament.details.ctrl',
    function ($scope, $state, $filter, Parse, Tournament, Match, modalServices, tournament, players, $uibModal) {

      $scope.tourney = {};

      $scope.tourney = tournament[0];
      $scope.user = Parse.User.current();
      $scope.players = players;
      
      $scope.winner = $scope.tourney.winner.toJSON();
      console.log($scope.winner);

      $scope.rounds = [];

      Tournament.getMatches($scope.tourney).then(function (matches) {
        displayBracket(matches);
      })

      $scope.edit = function () {
        $state.go('admin.tournament.edit', {name: $scope.tourney.name});
      };
      $scope.delete = function () {
        $scope.tourney.destroy().then(function () {
          $state.go('admin.tournament.list');
        });
      }

      $scope.resetTourney = function (type) {
        resetSingleBracket();
      }

      $scope.showMatchDetail = function (match) {
        showMatchResults(match);
      };

      $scope.generateBracket = function () {
        resetSingleBracket();
      }
      $scope.checkinPlayer = function (player) {
        player.checkin = !player.checkin;
        player.save().then(function (data) {
          player = data;
        });
      }
      $scope.playerSeeding = function (seeding) {
        if(seeding < 99) {
          return seeding + '.'
        } else {
          return '-.'
        }
      }

      function showMatchResults(match) {
        var currentMatch = angular.copy(match);
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'templates/modals/match-result.html',
          controller: 'admin.modal.controllers.tournament.match.results.ctrl',
          resolve: {
            match: function () {
              return currentMatch;
            }
          }
        });

        modalInstance.result.then(function (match) {
          if(match) {
            Match.saveMatch(match).then(function (results) {
              if(results.tournament.winner) {
                $scope.winner = results.tournament.winner;
              }
            });
          }
        });
      }

      function displayBracket (matches) {
        var rounds = [];
        var roundCount = 0;

        var numRounds = $filter('unique')(matches, 'roundNum').length;

        while(numRounds) {
          var round = {};
          var games = $filter('filter')(matches, {round:{roundNum:numRounds}});
          round.name = games[0].round.name;
          round.matches = games;
          rounds.push(round);
          numRounds--;
        }
        $scope.rounds = rounds;
      }


      function resetSingleBracket () {
        Tournament.deleteData($scope.tourney).then(function () {
          Tournament.createRounds($scope.tourney).then(function (rounds) {
            Tournament.createMatches(rounds).then(function (matches) {
              Tournament.connectMatches(matches).then(function (connectedMatches) {
                Tournament.seedMatches(connectedMatches, $scope.players).then(function (seededMatches) {
                  Tournament.evaluateMatches(seededMatches).then(function (evalMatches) {
                    displayBracket(evalMatches);
                  });
                });
              });
            });
          });
        });
      }
    })

  .controller('admin.modal.controllers.tournament.match.results.ctrl', function ($scope, $uibModalInstance, match) {
    $scope.currentMatch = match;
    if(!$scope.currentMatch.score) {
      $scope.currentMatch.score = {player1 : 0, player2: 0}
    }

    $scope.ok = function () {
      if($scope.currentMatch.score.player1 === $scope.currentMatch.round.numOfGames) {
        $scope.currentMatch.winner = $scope.currentMatch.player1;
        
        switch ($scope.currentMatch.slot) {
          case 1 : $scope.currentMatch.nextMatch.player1 = $scope.currentMatch.player1; break;
          case 0 : $scope.currentMatch.nextMatch.player2 = $scope.currentMatch.player1; break;
          default: $scope.currentMatch.tournament.winner = $scope.currentMatch.player1; break;
        }
      }

      if($scope.currentMatch.score.player2 === $scope.currentMatch.round.numOfGames) {
        $scope.currentMatch.winner = $scope.currentMatch.player2;

        switch ($scope.currentMatch.slot) {
          case 1 : $scope.currentMatch.nextMatch.player1 = $scope.currentMatch.player2; break;
          case 0 : $scope.currentMatch.nextMatch.player2 = $scope.currentMatch.player2; break;
          default: $scope.currentMatch.tournament.winner = $scope.currentMatch.player2; break;
        }
      }
      
      $uibModalInstance.close($scope.currentMatch);
    };

    $scope.invalid = function () {
      if($scope.currentMatch.score.player1 === $scope.currentMatch.score.player2) {
        return true;
      }
      return false;
    }

    $scope.cancel = function () {
      $uibModalInstance.close(false);
    };
  })

  .controller('admin.modal.controllers.tournament.match.seed.ctrl', function ($scope, $uibModalInstance, match, players) {
    $scope.currentMatch = match;
    $scope.players = players;

    $scope.ok = function () {
      $uibModalInstance.close($scope.currentMatch);
    };

    $scope.cancel = function () {
      $uibModalInstance.close(false);
    };
  });
