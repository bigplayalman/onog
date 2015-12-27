var Controllers = angular.module('synergyApp.controllers', [])
  .controller('mainController', ['$scope', '$location','Parse', 'ParseEmployee', function($scope, $location, Parse, ParseEmployee) {
    // create a message to display in our view
    $scope.title = 'Synergy App'
    $scope.collection = [];
    if (!Parse.User.current()) {$location.url('/login');}
    new Parse.Query(ParseEmployee).find().then(function (employees) {$scope.collection = employees});
  }])
  .controller('signUpController', ['$scope', '$location', 'userService', 'Parse', function($scope, $location, userService, Parse) {
    $scope.title = 'Sign Up to Synergy';
    userService.setNewUser(false);

    $scope.signUp = function (newUser) {
      "use strict";
      var user = new Parse.User();
      user.set("username", newUser.username);
      user.set("password", newUser.password);
      user.set("email", newUser.email);

      user.signUp(null, {
        success: function(user) {
          $location.url('/login');
          userService.setNewUser(true);
        },
        error: function(user, error) {
          // Show the error message somewhere and let the user try again.
          alert("Error: " + error.code + " " + error.message);
        }
      });
    }
  }])
  .controller('loginController', ['$scope', '$location', 'userService', 'Parse', function($scope, $location, userService, Parse) {
    $scope.title = 'Login to Synergy';
    $scope.newUser = userService.getNewUser();
    Parse.User.logOut();
    $scope.login = function (user) {
      "use strict";
      Parse.User.logIn(user.username, user.password, {
        success: function(user) {
          $location.url('/');
        },
        error: function(user, error) {
          // The login failed. Check error to see why.
        }
      });
    }
  }])
  .controller('addEmployeeController', ['$scope', 'Parse',
    function($scope, Parse) {
      $scope.title = 'Add Employee Form';
      $scope.message = false;
      $scope.addEmployee = function (user) {
        if(navigator.camera) {
          navigator.camera.getPicture(function(imageURI) {}, function(message) {
              alert('get picture failed');
            },{
              quality: 50,
              destinationType: navigator.camera.DestinationType.FILE_URI,
              sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
            }
          );
        } else {
          var fileUploadControl = document.getElementById('profilePic');
          if (fileUploadControl.files.length > 0) {
            var file = fileUploadControl.files[0];
            var name = 'profile.jpg'
            var parseFile = new Parse.File(name, file, 'image/jpg');
          }
        }
        var employee = new Parse.Object("Employees");
        employee.set("name", user.name);
        employee.set("picture", parseFile);
        employee.save().then(function (emp) {
          $scope.message = emp.get('name') + ' has been added';
          $scope.employee = null;
          document.getElementById('profilePic').value = null;
        });
      }
    }]);