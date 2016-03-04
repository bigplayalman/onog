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
            template: ''
          },
          content: {
            templateUrl: 'templates/account.html'
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
