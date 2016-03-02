angular.module('home.controllers', [])
  .controller('home.controllers.menu.ctrl', function($scope, $state, Parse, Admin) {
    $scope.admin = false;
    $scope.user = Parse.User.current();
    var currentState = $state.$current.name.split('.')[0];
    $scope.active = {
      path: currentState
    }
    $scope.menuItems = [
      {
        title: 'Home',
        icon: 'fa-home',
        name: 'home.index',
        parent: 'home'
      },
      {
        title: 'Tournaments',
        icon: 'fa-trophy',
        name: 'tournament.list',
        parent: 'tournament'
      }
    ];

    if($scope.user) {
      $scope.menuItems.push({
        title: 'My Account',
        icon: 'fa-user',
        name: 'account.index',
        parent: 'account'
      });

      Admin.getRole($scope.user).then(function (role) {
        if(role){
          Admin.setRole(role);
          $scope.admin = true;
          $scope.menuItems.push({
            title: 'Admin',
            icon: 'fa-dashboard',
            name: 'admin.dashboard',
            parent: 'admin'
          });
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