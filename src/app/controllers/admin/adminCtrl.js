angular.module('admin.controllers', ['admin.controllers.tournament'])
  .controller('admin.controllers.dashboard.ctrl', function($scope, Parse, Admin) {

  })
  .controller('admin.controllers.menu.ctrl', function($scope, $state, Parse, modalServices, Admin) {

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
        parent: 'tournament',
        children: []
      },
      {
        title: 'Matches',
        icon: 'fa-gamepad',
        name: 'admin.match.list',
        parent: 'match',
        children: []
      },
      {
        title: 'Create Tournament',
        icon: 'fa-plus-circle',
        name: 'createTournament'
      },
    ];

    $scope.goTo = function (path) {
      switch (path) {
        case 'createTournament': modalServices.showTournament(null); break;
        default: $state.go(path); break;
      }
    }

    $scope.logout = function () {
      Admin.setRole(null);
      Parse.User.logOut();
      $state.go('home');
    }
  })
