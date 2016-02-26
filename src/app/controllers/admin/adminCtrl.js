angular.module('admin.controllers', ['admin.controllers.tournament'])
  .controller('admin.controllers.dashboard.ctrl', function($scope, Parse, Admin) {

  })
  .controller('admin.controllers.menu.ctrl', function($scope, $state) {
    var current = $state.$current.name.split('.');
    $scope.active = {
      path: current[current.length - 1]
    }
    $scope.menuItems = [
      {
        title: 'Dashboard',
        icon: 'fa-home',
        name: 'admin.dashboard',
        parent: 'dashboard',
        children: []
      },
      {
        title: 'Tournaments',
        icon: 'fa-trophy',
        name: 'admin.tournament.list',
        parent: 'active',
        children: [
          {
            title: 'Create a Tournament',
            icon: 'fa-fort-awesome',
            name: 'admin.tournament.create',
            parent: 'create',
          }
        ]
      },
      {
        title: 'Matches',
        icon: 'fa-gamepad',
        name: 'admin.matches',
        parent: 'matches',
        children: []
      },
      {
        title: 'Home',
        icon: 'fa-home',
        name: 'home.index',
        parent: 'home',
        children: []
      }
    ];

    $scope.logout = function () {
      Admin.setRole(null);
      Parse.User.logOut();
      $state.go('home');
    }
  })