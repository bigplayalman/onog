var Controllers = angular.module('onog.controllers', [])
  .controller('menuCtrl', function($scope, $state) {
      $scope.logout = function () {
        Parse.User.logOut();
        $state.go('login');
      }
  })
  .controller('viewTournamentsCtrl', function($scope, Parse, Bracket) {
    new Parse.Query(Bracket)
      .find()
      .then(function(brackets) {
        $scope.brackets = brackets;
      })
      .catch(function(err) {
        $scope.error = err;
      });
  })
  .controller('createBracketCtrl', function($scope, Parse, Bracket) {
    $scope.bracket = new Bracket();
    $scope.createBracket = function () {
      $scope.bracket.set('openSlots', 0)
      $scope.bracket.save().then(function () {
        $scope.bracket = new Bracket();
      });
    }

  })
  .controller('userCtrl', function($scope, $state, Parse) {

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