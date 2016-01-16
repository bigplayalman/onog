angular.module('onog.controllers.admin', [])
  .controller('AdminController', function($scope, Parse, Admin) {

  })
  .controller('AdminMenuController', function($scope, $state) {
    $scope.active = {
      path: $state.$current.name
    }
    $scope.menuItems = [
      {
        title: 'Home',
        icon: 'fa-home',
        name: 'admin.dashboard'
      },
      {
        title: 'Active Tournaments',
        icon: 'fa-trophy',
        name: 'admin.tournaments.active'
      },
      {
        title: 'Create a Tournament',
        icon: 'fa-fort-awesome',
        name: 'admin.tournament.create'
      }
    ];

    $scope.logout = function () {
      Admin.setRole(null);
      Parse.User.logOut();
    }
  })