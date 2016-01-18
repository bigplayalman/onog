angular.module('onog.controllers.menu', [])
  .controller('MenuController', function($scope, $state, Parse, Admin) {
    $scope.admin = false;
    $scope.user = Parse.User.current();
    $scope.active = {
      path: $state.$current.name
    }
    $scope.menuItems = [
      {
        title: 'Home',
        icon: 'fa-home',
        name: 'home.index'
      }
    ];

    if($scope.user) {
      Admin.getRole($scope.user).then(function (role) {
        if(role){
          Admin.setRole(role);
          $scope.admin = true;
        } else {
          $scope.admin = false;
        }
      });
    }

    $scope.logout = function () {
      Admin.setRole(null);
      Parse.User.logOut();
    }
  })