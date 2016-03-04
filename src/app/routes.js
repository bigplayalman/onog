angular.module('onog.routes', ['admin.routes', 'account.routes', 'tournament.routes'])

  .config(function($stateProvider, $urlRouterProvider) {
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/home');
    $stateProvider

      .state('home', {
        url: '/home',
        abstract: true,
        data: {
          requireLogin: false,
        },
        views: {
          menu: {
            template: '<div onog-menu class="container-fluid"></div>',
            controller: 'onog.controllers.menu.default.ctrl'
          },
          content: {
            template: '<div ui-view></div>',
          }
        }

      })
      .state('home.index', {
        url: '',
        template: 'hello'
      })
  });
