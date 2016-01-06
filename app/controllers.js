var Controllers = angular.module('onog.controllers', [])
  .controller('MenuController', function($scope, $state) {
      $scope.logout = function () {
        Parse.User.logOut();
        $state.go('login');
      }
  })
  .controller('ViewTournamentsController', function($scope, Parse, BracketList) {

    BracketList.getAvailableList().then(function (brackets) {
      $scope.availableList = brackets;
    });

    BracketList.getRegisteredList().then(function(brackets) {
      $scope.registeredList = brackets;
    });

    $scope.cancel = function (bracket) {
      var index = $scope.registeredList.indexOf(bracket);
      var relation = bracket.relation('players');
      var registered = bracket.get('registeredSlots')  - 1;
      relation.remove(Parse.User.current());
      $scope.availableList.push(bracket);
      $scope.registeredList.splice(index, 1);
      bracket.set('registeredSlots', registered);
      bracket.save();
    }

    $scope.signUp = function (bracket) {
      var index = $scope.availableList.indexOf(bracket);
      var relation = bracket.relation('players');
      var registered = bracket.get('registeredSlots') + 1;
      relation.add(Parse.User.current());
      $scope.registeredList.push(bracket);
      $scope.availableList.splice(index, 1);
      bracket.set('registeredSlots', registered);
      bracket.save();
    }
  })
  .controller('MatchResultsController', function($scope, $uibModalInstance, match) {
    $scope.match = match;

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.submit = function () {
      if($scope.match.playerOneScore > $scope.match.playerTwoScore) {
        $scope.match.set('winner', $scope.match.playerOne);
        $scope.match.set('loser', $scope.match.playerTwo);
      } else {
        $scope.match.set('winner', $scope.match.playerTwo);
        $scope.match.set('loser', $scope.match.playerOne);
      }
      $uibModalInstance.close($scope.match);
    };
  })
  .controller('BracketDetailController', function($scope, $state, $stateParams, $uibModal, $filter, Parse, Bracket, Round, Match) {
    $scope.bracket = new Bracket();
    $scope.players = [];
    $scope.bracket.id = $stateParams.id;
    $scope.bracket.fetch().then(function (bracket) {
      $scope.bracket = bracket;
      bracket.relation('players').query().find({
        success: function(players) {
          $scope.players = players;
        }
      });
    }).catch(function(err) {
      $state.go('viewTournaments');
    });

    $scope.generateBracket = function () {
      Match.deleteMatches($scope.bracket).then(function () {
        Match.createMatches($scope.players.length -1, $scope.bracket).then(function (matches) {
          Match.setNextMatch(matches).then(function(matches) {
            var games = $filter('orderBy')(matches, 'gameNum');
            Match.setPlayers($scope.players, games).then(function (matches) {
              console.log(matches);
              //var query = new Parse.Query(Match.Match);
              //query.set('bracket', $scope.bracket);
              //query.ascending("gameNum");
              //query.find().then(function(games) {
              //  console.log(games);
              //})
            })
            //Round.deleteRounds($scope.bracket).then(function () {
            //  Round.createRounds($scope.bracket, games, $scope.players).then(function (rounds) {
            //    console.log(rounds);
            //  });
            //});
          });
        });
      });
    }
  })
  .controller('SingleMatchController', function($scope, $uibModal) {
    $scope.updateMatch = function (match) {
      $scope.match = match;
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'templates/modals/matchResultsModal.html',
        controller: 'MatchResultsController',
        resolve: {
          match: function () {
            return match;
          }
        }
      });
      modalInstance.result.then(function (match) {
        console.log(match);
      });
    }
  })
  .controller('CreateBracketController', function($scope, Parse, Bracket) {
    $scope.bracket = new Bracket();
    $scope.createBracket = function () {
      $scope.bracket.set('registeredSlots', 0);
      $scope.bracket.save().then(function () {
        $scope.bracket = new Bracket();
      });
    }

  })
  .controller('UserController', function($scope, $state, Parse) {

    $scope.login = function (user) {
      Parse.User.logIn(user.username, user.password, {
        success: function(user) {
          $state.go('home');
        },
        error: function(user, error) {
          // The login failed. Check error to see why.
        }
      });
    }
    $scope.signUp = function (newUser) {
      var user = new Parse.User();
      user.set("username", newUser.username);
      user.set("password", newUser.password);
      user.set("email", newUser.email);

      user.signUp(null, {
        success: function(user) {
          $state.go('login');
        },
        error: function(user, error) {
          // Show the error message somewhere and let the user try again.
          alert("Error: " + error.code + " " + error.message);
        }
      });
    }
  });
