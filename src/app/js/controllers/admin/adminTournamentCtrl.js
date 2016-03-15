angular.module('admin.controllers.tournament', [])

  .controller('admin.controllers.tournament.list.ctrl', function($scope, $state, Tournament) {
    $scope.tournaments = [];
    Tournament.getTournaments().then(function (tournaments) {
      $scope.tournaments = tournaments;
    });

    $scope.tournamentDetails = function (tourney) {
      $state.go('admin.tournament.details', {id: tourney.id, name: tourney.name});
    }
  })
  .controller('admin.controllers.tournament.seed.ctrl', function ($scope, $state, $filter, playerServices, players) {
    $scope.players = players;
    console.log($scope.players);
  })


  .controller('admin.controllers.tournament.details.ctrl', function ($scope, $state,$timeout, $filter, Parse, Match, Round, modalServices, playerServices, tournament, players) {

    $scope.tourney = {};

    $scope.tourney = tournament[0];
    console.log($scope.tourney.status);
    $scope.user = Parse.User.current();
    $scope.players = players;

    $scope.nextId = null;
    $scope.currentId = null;

    $scope.balance = [];
    $scope.rounds = [];

    Match.getMatches($scope.tourney).then(function (matches) {
      $scope.displayBracket(matches);
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

    //$scope.playerConfig = {
    //  group: 'sorted',
    //  animation: 150,
    //  onSort: function (/** ngSortEvent */evt){
    //    // @see https://github.com/RubaXa/Sortable/blob/master/ng-sortable.js#L18-L24
    //    console.log(evt);
    //  }
    //};


    $scope.edit = function () {
      var tourney = {};
      angular.copy($scope.tourney.attributes, tourney);

      modalServices.showTournament(tourney, $scope.tourney.id).result.then(function (data) {
        console.log(data);
      });
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
        templateUrl: 'templates/modals/match-results.html',
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
        templateUrl: 'templates/modals/tournament-seed.html',
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

  .controller('admin.modal.controllers.tournament.match.results.ctrl', function ($scope, $uibModalInstance, match) {
    $scope.currentMatch = match;

    $scope.ok = function () {
      $uibModalInstance.close($scope.currentMatch);
    };

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
  })

  .controller('TourneyPlayerController', function ($scope, $state, $stateParams, $filter, Tournament, Match, Parse, Player, Round) {
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
