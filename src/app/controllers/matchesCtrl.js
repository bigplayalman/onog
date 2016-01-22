angular.module('onog.controllers.matches', [])
  .controller('MatchController', function($scope, $state, $stateParams, Parse, Match) {
    $scope.message = null;
    var query = new Parse.Query(Match.Match);
    query.include('nextMatch');
    query.include('player1');
    query.include('player2');
    query.include('winner1');
    query.include('winner2');
    query.include('round');

    query.get($stateParams.matchId, {
      success: function(match) {
        $scope.match = match;
      },
      error: function(object, error) {
        // The object was not retrieved successfully.
        // error is a Parse.Error with an error code and message.
      }
    });

    $scope.updateMatch = function (player) {
      $scope.match.set('winner', player);
      $scope.message = null;
    }
    $scope.submitMatch = function () {

      var winner = $scope.match.get('winner');

      if($scope.match.round.name === 'Balance Round') {
        if($scope.match.gameNum % 2 === 0) {
          $scope.match.nextMatch.set('player1', winner)
        } else {
          $scope.match.nextMatch.set('player2', winner);
        }
      } else {
        if($scope.match.gameNum % 2 === 0) {
          $scope.match.nextMatch.set('player2', winner)
        } else {
          $scope.match.nextMatch.set('player1', winner);
        }
      }

      $scope.match.save().then(function (match) {
        $scope.message = 'Match Updated';
      })

    }
  });