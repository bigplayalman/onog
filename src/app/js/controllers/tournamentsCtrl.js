angular.module('onog.controllers.tournament', [])

  .controller('onog.controllers.tournament.list.ctrl', function($scope, $state, Tournament) {
    $scope.tournaments = [];
    Tournament.getTournaments().then(function (tournaments) {
      $scope.tournaments = tournaments;
    });

    $scope.tournamentDetails = function (tourney) {
      $state.go('tournament.details', {id: tourney.id, name: tourney.name});
    }
  })
  .controller('onog.controllers.tournament.detail.ctrl',
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
      });

      $scope.showMatchDetail = function (match) {
        showMatchResults(match);
      };
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

    });
