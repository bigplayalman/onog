angular.module('admin.controllers.tournament', [])

  .controller('admin.controllers.tournament.list.ctrl', function($scope, Tournament) {
    $scope.tournaments = [];
    Tournament.getTournaments().then(function (tournaments) {
      $scope.tournaments = tournaments;
    });
  })

  .controller('admin.controllers.tournament.details.ctrl', function ($scope, $stateParams, $filter, $state, Match, Tournament, Round, Parse) {
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

    $scope.setWidth = function (length) {
      var width = (100/length) + '%';
      return width;
    }
    $scope.matchMargin = function (length) {
      if(length === 1) {
        return '10px'
      }
      var margin = (256/Math.pow(length, 2)) + 'px';
      return margin;
    }
    $scope.setTourneyWidth = function (length) {
      var width = 220*length + 'px';
      return width;
    }

    $scope.displayBracket = function (matches) {
      var rounds = [];
      var balance =[];
      var roundCount = 1;
      while($filter('filter')(matches, {round:{roundNum:roundCount}}).length > 0) {
        var round = {};
        var games = $filter('filter')(matches, {round:{roundNum:roundCount}});
        round.name = games[0].round.name;
        round.matches = games;
        roundCount++;
        if(round.name === 'Balance Round') {
          balance.push(round);
        } else {
          rounds.push(round);
        }
      }
      $scope.balance = balance;
      $scope.rounds = rounds.reverse();
    };

    $scope.edit = function () {
      $state.go('admin.tournament.edit');
    };
    $scope.delete = function () {
      $scope.tourney.destroy().then(function () {
        $state.go('admin.tournament.list');
      });
    }

    $scope.generateTournament = function (type) {
      switch (type) {
        case 'Single Elimination Bracket': generateSingleBracket(); break;
        default: break;
      }
    }

    var generateSingleBracket = function () {
      Match.deleteMatches($scope.tourney).then(function () {
        Match.createMatches($scope.players.length -1, $scope.tourney).then(function (matches) {
          Match.setNextMatch(matches).then(function(matches) {
            var games = $filter('orderBy')(matches, 'gameNum');
            Match.setPlayers($scope.players, games).then(function (matches) {
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
      });
    }
  })
