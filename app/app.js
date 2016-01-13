var onog = angular.module('onog', ['ngParse', 'ui.bootstrap', 'ui.router', 'onog.routes', 'onog.controllers', 'onog.services', 'onog.directives'])

  .config(function(ParseProvider) {
  ParseProvider.initialize('nYsB6tmBMYKYMzM5iV9BUcBvHWX89ItPX5GfbN6Q', 'zrin8GEBDVGbkl1ioGEwnHuP70FdG6HhzTS8uGjz');
  })
  .run(function ($rootScope, $state, Parse, Admin) {

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
      var requireLogin = toState.data.requireLogin;

      if (requireLogin && Parse.User.current() === null) {
        event.preventDefault();
        $state.go('login');
        // get me a login modal!
      } else {
        var requireAdmin = toState.data.requireAdmin;

        if (requireAdmin) {
          if (!Admin.returnRole()) {
            Admin.getRole(Parse.User.current())
              .then(function (roles) {
                Admin.setRole(roles);
                if (!Admin.returnRole()) {
                  event.preventDefault();
                  $state.go('home');
                }
              });
          } else {
            event.preventDefault();
            $state.go('home');
          }
        }


      }



    });

  });

