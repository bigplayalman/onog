angular.module('onog', [
  'ngParse',
  'ui.router',
  'ng-sortable',
  'ui.bootstrap',
  'onog.templates',
  'onog.routes',
  'onog.controllers',
  'onog.services',
  'onog.directives'
])

  .config(function(ParseProvider) {
  ParseProvider.initialize('nYsB6tmBMYKYMzM5iV9BUcBvHWX89ItPX5GfbN6Q', 'zrin8GEBDVGbkl1ioGEwnHuP70FdG6HhzTS8uGjz');
  })
  .run(function ($rootScope, $state, Parse, Admin) {

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
      var requireLogin = toState.data.requireLogin;
      var requireAdmin = toState.data.requireAdmin;
      var name = toState.name;

      if (requireLogin && Parse.User.current() === null) {
        event.preventDefault();
        $state.go('home.index');
      } else if(requireAdmin && !Admin.returnRole()) {
        Admin.getRole(Parse.User.current()).then(function (role) {
          if(role){
            Admin.setRole(role);
          } else {
            $state.go('home.index');
          }
        });
      }
    });
  })

