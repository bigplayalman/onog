angular.module('account.controllers', [])
  .controller('account.controllers.dashboard.ctrl', function($scope, Parse) {

  })
  .controller('account.controllers.matches.ctrl', function($scope, Parse, Match, $uibModal) {
    $scope.user = Parse.User.current();
    $scope.matches = {};

    Match.getUserMatches($scope.user, 'active').then(function(matches) {
      $scope.currentMatches = matches;
    });

    Match.getUserMatches($scope.user, 'completed').then(function(matches) {
      $scope.finishedMatches = matches;
    });

    $scope.getRoundName = function (match) {
      return match.round.get('name');
    }

    $scope.showMatchDetails = function (match) {
      showMatchResults(match);
    }

    function showMatchResults(match) {
      var currentMatch = match;
      var pastVariables = match.toJSON();

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
          Match.saveMatch(match).then(function (result) {
            currentMatch = result;
          })
        }
      });
    }
  })

  .controller('account.controllers.match.modal.results.ctrl', function ($scope, $uibModalInstance, Parse, match) {
    $scope.currentMatch = match;
    $scope.user = Parse.User.current();
    $scope.max = $scope.currentMatch.round.get('numOfGames');
    $scope.score = 0;

    if($scope.currentMatch.user1.id === $scope.user.id) {
      $scope.opponent = $scope.currentMatch.player2;
      $scope.opponent.user = $scope.currentMatch.user2;
      $scope.score = $scope.currentMatch.score.player1;
    } else {
      $scope.opponent = $scope.currentMatch.player1;
      $scope.opponent.user = $scope.currentMatch.user1;
      $scope.score = $scope.currentMatch.score.player2;
    }

    $scope.ok = function () {
      if($scope.currentMatch.user1.id === $scope.user.id) {
        $scope.currentMatch.score.player1 = $scope.score;
      } else {
        $scope.currentMatch.score.player2 = $scope.score;
      }
      $uibModalInstance.close($scope.currentMatch);
    };

    $scope.cancel = function (e) {
      $uibModalInstance.dismiss(e);
    };

    $scope.invalid = function () {
      if($scope.score > $scope.max) {
        console.log($scope.score);
        return true;
      }
      if($scope.score < 0) {
        console.log($scope.score);
        return true;
      }
      return false;
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
