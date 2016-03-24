angular.module('account.routes', [])

  .config(function($stateProvider) {
    $stateProvider

      .state('account', {
        url: '/account',
        abstract: true,
        data: {
          requireLogin: true,
        },
        views: {
          menu: {
            template: '<div onog-menu class="container-fluid"></div>',
            controller: 'onog.controllers.menu.default.ctrl'
          },
          content: {
            template: '<div class="navbar-inverse"><div onog-sub-menu class="container-fluid"></div></div><div ui-view="account" class="content"></div>',
            controller: 'account.controllers.menu.ctrl'
          }
        }
      })

      .state('account.dashboard', {
        url: '',
        views: {
          'account': {
            templateUrl: 'templates/account/dashboard.html',
            controller: 'account.controllers.dashboard.ctrl'
          }
        }
      })

      .state('account.matches', {
        url: '/matches',
        views: {
          'account': {
            templateUrl: 'templates/account/matches.html',
            controller: 'account.controllers.matches.ctrl'
          }
        }
      })
  });
