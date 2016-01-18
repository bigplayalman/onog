angular.module('onog.controllers.menu', [])
  .controller('MenuController', function($scope, $state, Parse, Admin) {
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

    $scope.logout = function () {
      Admin.setRole(null);
      Parse.User.logOut();
    }
  })