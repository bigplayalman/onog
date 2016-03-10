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
    function($scope, $filter, Parse, Match, Round, modalServices, playerServices, tournament, players) {

      $scope.tourney = tournament[0];
      $scope.user = Parse.User.current();
      $scope.players = players;
      $scope.registered = playerServices.findPlayer($scope.players, $scope.user);
      $scope.nextId = null;
      $scope.currentId = null;

      $scope.balance = [];
      $scope.rounds = [];

      Match.getMatches($scope.tourney).then(function (matches) {
        $scope.displayBracket(matches);
      });

      $scope.checkIn = function () {
        playerServices.checkIn($scope.registered).then(function (data) {
          console.log(data);
          $scope.registered = data;
        });
      }
      $scope.edit = function () {
        modalServices.showEditRegistration($scope.registered);
      }

      $scope.register = function () {
        modalServices.showTourneyRegistration($scope.tourney);
      }

      $scope.cancelRegistration = function () {
        modalServices.showCancelRegistration($scope.registered, $scope.tourney);
      }

      $scope.login = function () {
        modalServices.showLogin();
      }

      $scope.setWidth = function (length) {
        var width = (100/length) + '%';
        return width;
      }

      $scope.matchMargin = function (index) {
        var margin = '10px;'
        return margin;
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

      $scope.showActive = function ($event,match) {
        $scope.currentId = match.id;
        if(match.nextMatch){
          $scope.nextId = match.nextMatch.id;
        } else {
          $scope.nextId = match.id;
        }
        console.log($scope.nextId);
      }

    });
