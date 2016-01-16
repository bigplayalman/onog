angular.module('onog', [
  'ngParse',
  'ui.router',
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
        $state.go('login');
      } else if(requireAdmin && !Admin.returnRole()) {
        event.preventDefault();
        Admin.getRole(Parse.User.current()).then(function (role) {
          if(role){
            Admin.setRole(role);
            $state.go(name);
          } else {
            $state.go('home');
          }
        });
      }
    });
  })

