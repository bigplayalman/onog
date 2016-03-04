angular.module('account.controllers', [])
  .controller('account.controllers.dashboard.ctrl', function($scope, Parse) {

  })
  .controller('account.controllers.matches.ctrl', function($scope, Parse, Match, $uibModal) {
    $scope.user = Parse.User.current();
    $scope.matches = {};
    Match.getUserMatches($scope.user).then(function(matches) {
      $scope.matches = matches;

    });

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
        Match.saveMatch(match).then(function (results) {
        });
      });
    }
  })

  .controller('account.controllers.match.modal.results.ctrl', function ($scope, $uibModalInstance, Parse, match) {
    $scope.currentMatch = match;
    $scope.user = Parse.User.current();
    console.log($scope.user);

    $scope.ok = function () {
      $uibModalInstance.close($scope.currentMatch);
    };

    $scope.cancel = function () {
      $uibModalInstance.close(false);
    };
  })

  .controller('account.controllers.menu.ctrl', function($scope, $state) {
    var current = $state.$current.name.split('.');
    $scope.active = {
      path: current[current.length - 1]
    }
    $scope.menuItems = [
      {
        title: 'Dashboard',
        icon: 'fa-home',
        name: 'account.dashboard',
        parent: 'dashboard',
        children: []
      },
      {
        title: 'Tournaments',
        icon: 'fa-trophy',
        name: 'tournament.list',
        parent: 'tournament',
        children: []
      },
      {
        title: 'My Matches',
        icon: 'fa-gamepad',
        name: 'account.matches',
        parent: 'matches',
        children: []
      },
      {
        title: 'Home',
        icon: 'fa-home',
        name: 'home.index',
        parent: 'home',
        children: []
      }
    ];

    $scope.logout = function () {
      Admin.setRole(null);
      Parse.User.logOut();
      $state.go('home');
    }
  })