angular.module('account.controllers', [])
  .controller('account.controllers.dashboard.ctrl', function($scope, Parse) {

  })
  .controller('account.controllers.matches.ctrl', function($scope, Parse, Match, $uibModal) {
    $scope.user = Parse.User.current();
    $scope.matches = {};

    Match.getUserMatches($scope.user, 'active').then(function(matches) {
      $scope.currentMatches = matches;
    });

    Match.getUserMatches($scope.user, 'finished').then(function(matches) {
      $scope.finishedMatches = matches;
    });

    $scope.getRoundName = function (match) {
      return match.round.get('name');
    }

    $scope.showMatchDetails = function (match) {
      showMatchResults(match);
    }

    function showMatchResults(match) {
      var pastVariables = match.toJSON();
      var currentMatch = match;
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'templates/account/modals/matchResults.html',
        controller: 'account.controllers.match.modal.results.ctrl',
        resolve: {
          match: function () {
            return currentMatch;
          }
        }
      });

      modalInstance.result.then(function (match) {
        if(match) {
          Match.saveMatch(match);
        }
      });
    }
  })

  .controller('account.controllers.match.modal.results.ctrl', function ($scope, $uibModalInstance, Parse, match) {
    $scope.currentMatch = match;
    $scope.user = Parse.User.current();

    $scope.ok = function () {
      $uibModalInstance.close($scope.currentMatch);
    };

    $scope.cancel = function () {
      $uibModalInstance.close(false);
    };

  })
  .controller('account.controllers.tournament.list.ctrl', function($scope, $state, playerServices) {

    $scope.tournaments = [];
    playerServices.getMyTournaments().then(function (mytourneys) {
      var tournaments = [];
      angular.forEach(mytourneys, function (tourney) {
        tournaments.push(tourney.tournament);
      })
      $scope.tournaments = tournaments;
    });

    $scope.tournamentDetails = function (tourney) {
      $state.go('account.tournament.details', {id: tourney.id, name: tourney.name});
    }
  })

  .controller('account.controllers.menu.ctrl', function($scope, $state, Parse) {
    var current = $state.$current.name.split('.');

    $scope.user = Parse.User.current();

    $scope.active = {
      path: current[current.length - 1]
    }
    $scope.menuItems = [
      {
        title: 'Dashboard',
        icon: 'fa-home',
        name: 'account.dashboard',
        parent: 'account.dashboard',
        children: []
      },
      {
        title: 'My Tournaments',
        icon: 'fa-trophy',
        name: 'account.tournament.list',
        parent: 'account.tournament.list',
        children: []
      },
      {
        title: 'My Matches',
        icon: 'fa-gamepad',
        name: 'account.matches',
        parent: 'account.matches',
        children: []
      }
    ];

    $scope.goTo = function (path) {
      $state.go(path);
    }

    $scope.logout = function () {
      Admin.setRole(null);
      Parse.User.logOut();
      $state.go('home');
    }
  });
