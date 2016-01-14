angular.module('AdminControllersModule', [])
  .controller('AdminController', function($scope, $state, Parse, Admin) {
    $scope.logout = function () {
      Admin.setRole(null);
      Parse.User.logOut();
    }
  })