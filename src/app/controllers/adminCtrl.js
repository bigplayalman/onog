angular.module('onog.controllers.admin', [])
  .controller('AdminController', function($scope, Parse, Admin) {

  })
  .controller('AdminMenuController', function($scope, $state) {
    var current = $state.$current.name.split('.');
    $scope.active = {
      path: current[current.length - 1]
    }
    $scope.menuItems = [
      {
        title: 'Admin Home',
        icon: 'fa-home',
        name: 'admin.dashboard',
        parent: 'dashboard'
      },
      {
        title: 'Active Tournaments',
        icon: 'fa-trophy',
        name: 'admin.tournaments.active',
        parent: 'active'
      },
      {
        title: 'Create a Tournament',
        icon: 'fa-fort-awesome',
        name: 'admin.tournament.create',
        parent: 'create'
      },
      {
        title: 'Back to Homepage',
        icon: 'fa-arrow-circle-o-left',
        name: 'home.index',
        parent: 'home'
      }
    ];

    $scope.logout = function () {
      Admin.setRole(null);
      Parse.User.logOut();
    }
  })