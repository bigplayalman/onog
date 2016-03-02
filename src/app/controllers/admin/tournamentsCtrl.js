angular.module('admin.controllers.tournament', [])

  .controller('admin.controllers.tournament.list.ctrl', function($scope, Tournament) {
    $scope.tournaments = [];
    Tournament.getTournaments().then(function (tournaments) {
      $scope.tournaments = tournaments;
    });
  })

  .controller('admin.controllers.tournament.details.ctrl', function ($scope, $stateParams, $filter, $state, Match, Tournament, Round, Parse, $uibModal) {
    $scope.players = [];
    $scope.user = Parse.User.current();
    $scope.balance = [];
    $scope.rounds = [];
    $scope.tourney = {};

    Tournament.fetchTournament($stateParams.id).then(function (tournament) {
      $scope.tourney = tournament;
      var query = tournament.relation('players').query();
      query.descending('username');
      query.find().then(function (players) {
        $scope.players = players;
        Match.getMatches($scope.tourney).then(function (matches) {
          $scope.displayBracket(matches);
        });
      });
    }, function (err) {
      console.log(err);
    });


    $scope.matchMargin = function (length) {
      var margin = 0;
      return margin;
    }

    $scope.setTourneyWidth = function (length) {
      var width = 220*length + 'px';
      return width;
    }

    $scope.displayBracket = function (matches) {
      var rounds = [];
      var roundCount = 1;
      while($filter('filter')(matches, {round:{roundNum:roundCount}}).length > 0) {
        var round = {};
        var games = $filter('filter')(matches, {round:{roundNum:roundCount}});
        round.name = games[0].round.name;
        round.matches = games;
        roundCount++;
        rounds.push(round);
      }
      $scope.rounds = rounds.reverse();
    };

    $scope.edit = function () {
      $state.go('admin.tournament.id.edit', {id: $scope.tourney.id});
    };
    $scope.delete = function () {
      $scope.tourney.destroy().then(function () {
        $state.go('admin.tournament.list');
      });
    }

    $scope.resetTourney = function (type) {
      switch (type) {
        case 'Single Elimination Bracket': resetSingleBracket(); break;
        default: break;
      }
    }

    $scope.showMatchDetail = function (status, match) {

      switch (status) {
        case 'check-in':  showSeeding(match); break;
        case 'active': showMatchResults(match); break;
        default: break;
      }
    };

    function showMatchResults(match) {
      var pastVariables = match.toJSON();
      var currentMatch = match;
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'templates/admin/modals/matchResults.html',
        controller: 'admin.controllers.tournament.match.modal.results.ctrl',
        resolve: {
          match: function () {
            return currentMatch;
          }
        }
      });

      modalInstance.result.then(function (match) {
        Match.saveMatch(match).then(function (results) {
        });
      });
    }

    function showSeeding (match) {
      var pastVariables = match.toJSON();
      var currentMatch = match;
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'templates/admin/modals/seedPlayers.html',
        controller: 'admin.controllers.tournament.match.modal.seed.ctrl',
        resolve: {
          match: function () {
            return currentMatch;
          },
          players: function () {
            return $scope.players;
          }
        }
      });

      modalInstance.result.then(function (match) {
        if(match) {
          Match.saveMatch(match).then(function (results) {
          });
        } else {
          Match.getMatch(pastVariables.objectId);
        }

      });
    }

    var resetSingleBracket = function () {
      Match.deleteMatches($scope.tourney).then(function () {
        Match.createMatches($scope.players.length -1, $scope.tourney).then(function (matches) {
          Match.setNextMatch(matches).then(function(matches) {
            var games = $filter('orderBy')(matches, 'gameNum');
            Round.deleteRounds($scope.tourney).then(function () {
              Round.createRounds($scope.tourney, games.length, $scope.players).then(function (rounds) {
                Match.setRounds(rounds, games). then(function(matches){
                  $scope.displayBracket(matches);
                });
              });
            });
          });
        });
      });
    }
  })

  .controller('admin.controllers.tournament.match.modal.results.ctrl', function ($scope, $uibModalInstance, match) {
    $scope.currentMatch = match;

    $scope.ok = function () {
      $uibModalInstance.close($scope.currentMatch);
    };

    $scope.cancel = function () {
      $uibModalInstance.close(false);
    };
  })

  .controller('admin.controllers.tournament.match.modal.seed.ctrl', function ($scope, $uibModalInstance, match, players) {
    $scope.currentMatch = match;
    $scope.players = players;

    $scope.ok = function () {
      $uibModalInstance.close($scope.currentMatch);
    };

    $scope.cancel = function () {
      $uibModalInstance.close(false);
    };
  })

  .controller('admin.controllers.tournament.ctrl', function ($scope, $state, $stateParams, Tournament) {

    var path = 'admin.tournaments.active';

    $scope.options = [
      {
        name: 'Active',
        value: 'active'
      },
      {
        name: 'Check in',
        value: 'check-in'
      },
      {
        name: 'Completed',
        value: 'completed'
      }
    ];

    if($stateParams.id) {
      path = 'admin.tournament.id.details'
      Tournament.fetchTournament($stateParams.id).then(function (tournament) {
        $scope.tourney = tournament;
        $scope.status = tournament.status;
      });
    } else {
      $scope.status = $scope.options[0].value;
    }

    $scope.reset = function () {
      $scope.tourney = {};
    }

    $scope.submitTourney = function () {
      if(typeof $scope.tourney.id === 'undefined') {
        $scope.tourney.status = 'active';
        $scope.tourney.current = 0;
      };
      Tournament.setTournament($scope.tourney).then(function (tournament) {
        $state.go(path);
      });
    }
  })
  .controller('TourneyPlayerController', function ($scope, $state, $stateParams, $filter, Tournament, Match, Parse,Player, Round) {
    $scope.player = null;
    $scope.players = [];
    $scope.tourney = new Tournament.Model();
    $scope.tourney.id = $stateParams.id;

    $scope.user = Parse.User.current();
    $scope.balance = [];
    $scope.rounds = [];

    $scope.tourney.fetch().then(function (tournament) {
      $scope.tourney = tournament;
      var query = tournament.relation('players').query();
      query.descending('username');
      query.find().then(function (players) {
        $scope.players = players;
        if($scope.user) {
          var player = $filter('filter')(players, {id: $scope.user.id});
          if(player.length > 0) {
            $scope.signedUp = true;
          }
        }
        Match.getMatches($scope.tourney).then(function (matches) {
          $scope.displayBracket(matches);
        })
      });
    })


    var playerQuery = new Parse.Query(Player.Model);
    playerQuery.include('user');
    playerQuery.equalTo('user', Parse.User.current());
    playerQuery.equalTo('game', fetched.game);
    playerQuery.find().then(function (players) {
      $scope.player = players[0];
      fetched.relation('players').add(player);
    });
  });
