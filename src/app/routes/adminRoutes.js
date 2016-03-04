angular.module('admin.routes', [])

  .config(function($stateProvider) {
    $stateProvider

      .state('admin', {
        abstract: true,
        url: '/admin',
        data: {
          requireLogin: true,
          requireAdmin: true
        },
        views: {
          menu: {
            template: ''
          },
          content: {
            templateUrl: 'templates/admin/admin.html'
          }
        }

      })
      .state('admin.dashboard', {
        url: '',
        views: {
          content: {
            templateUrl: 'templates/admin/dashboard.html',
            controller: 'admin.controllers.dashboard.ctrl'
          }
        }
      })
      .state('admin.tournament', {
        url: '/tournament',
        abstract: true,
        views: {
          content: {
            template: '<div ui-view="tourney"></div>'
          }
        }
      })
      .state('admin.tournament.list', {
        url: '/list',
        views: {
          tourney: {
            templateUrl: 'templates/admin/tournaments/list.html',
            controller: 'admin.controllers.tournament.list.ctrl'
          }
        }
      })
      .state('admin.tournament.id', {
        url: '/:id',
        abstract: true,
        views: {
          'tourney': {
            template: '<div ui-view="tourney-info"></div>'
          }
        }
      })
      .state('admin.tournament.id.details', {
        url: '/details',
        views: {
          'tourney-info': {
            templateUrl: 'templates/admin/tournaments/details.html',
            controller: 'admin.controllers.tournament.details.ctrl'
          }
        }
      })

      .state('admin.tournament.id.edit', {
        url: '/edit/:id',
        views: {
          'tourney-info': {
            templateUrl: 'templates/admin/tournaments/tourney.html',
            controller: 'admin.controllers.tournament.ctrl'
          }
        }
      })

      .state('admin.tournament.id.match', {
        url: '/match/:matchId',
        views: {
          'tourney-info': {
            templateUrl: 'templates/matches/admin-match.html',
            controller: 'MatchController'
          }
        }
      })
      .state('admin.tournament.create', {
        url: '/create',
        views: {
          'tourney': {
            templateUrl: 'templates/admin/tournaments/tourney.html',
            controller: 'admin.controllers.tournament.ctrl'
          }
        }
      })
      .state('admin.tournaments', {
        url: '/tournaments',
        abstract: true,
        views: {
          'menu': {
            templateUrl: 'templates/menus/admin-menu.html',
            controller: 'AdminMenuController'
          },
          'content': {
            template: '<div ui-view="tourneyList"></div>'
          }
        }
      })
      .state('admin.tournaments.active', {
        url: '/active',
        views: {
          'tourneyList': {
            templateUrl: 'templates/tournaments/active-tournaments.html',
            controller: 'ActiveTourneysController'
          }
        }
      })
      .state('admin.matches', {
        url: '/matches',
        abstract: true,
        views: {
          'menu': {
            templateUrl: 'templates/menus/admin-menu.html',
            controller: 'AdminMenuController'
          },
          'content': {
            template: '<div ui-view="matchList"></div>'
          }
        }
      })
      .state('admin.matches.active', {
        url: '',
        views: {
          'matchList': {
            templateUrl: 'templates/matches/admin-matches.html',
            controller: 'matchListController'
          }
        }
      })
  });
