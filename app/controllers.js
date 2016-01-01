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
  .controller('BracketDetailController', function($scope, $state, $stateParams, Parse, Bracket) {
    $scope.bracket = new Bracket();
    $scope.bracket.id = $stateParams.id;
    $scope.bracket.fetch().catch(function(err) {
      $state.go('viewTournaments');
    });;
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