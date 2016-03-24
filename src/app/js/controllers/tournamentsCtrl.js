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
    function ($scope, $state, $filter, Parse, Tournament, Match, modalServices, tournament, players, registered, $uibModal, playerServices) {

      $scope.tourney = {};

      $scope.tourney = tournament[0];
      $scope.user = Parse.User.current();
      $scope.players = players;
      $scope.registered = registered;

      if($scope.tourney.status === 'finished') {
        $scope.winner = $scope.tourney.winner.toJSON();
      }

      $scope.rounds = [];

      Tournament.getMatches($scope.tourney).then(function (matches) {
        displayBracket(matches);
      });

      $scope.checkIn = function () {
        playerServices.checkIn($scope.registered).then(function (data) {
          $scope.registered = data;
        });
      }
      $scope.edit = function () {
        modalServices.showTourneyRegistration($scope.tourney, $scope.registered);
      }

      $scope.register = function () {
        modalServices.showTourneyRegistration($scope.tourney, $scope.registered);
      }

      $scope.cancelRegistration = function () {
        modalServices.showCancelRegistration($scope.registered, $scope.tourney);
      }

      $scope.login = function () {
        modalServices.showLogin();
      }

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
