angular.module('onog.routes', [])

  .config(function($stateProvider, $urlRouterProvider) {
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/home');
    $stateProvider

      .state('admin', {
        abstract: true,
        url: '/admin',
        data: {
          requireLogin: true,
          requireAdmin: true
        },
        template: '<div ui-view="menu" class="menu col-md-3"></div><div ui-view="content" class="content col-md-9"></div>',
      })
      .state('admin.dashboard', {
        url: '',
        views: {
          'menu': {
            templateUrl: 'templates/menus/admin-menu.html',
            controller: 'AdminMenuController'
          },
          'content': {
            templateUrl: 'templates/admin/admin-home.html',
            controller: 'AdminController'
          }
        }
      })
      .state('admin.tournament', {
        url: '/tournament',
        abstract: true,
        views: {
          'menu': {
            templateUrl: 'templates/menus/admin-menu.html',
            controller: 'AdminMenuController'
          },
          'content': {
            template: '<div ui-view="tourney"></div>'
          }
        }
      })
      .state('admin.tournament.id', {
        url: '/:id',
        abstract: true,
        views: {
          'tourney': {
            template: '<div ui-view="tourney-info"></div>',
            controller: 'TourneyDetailsController'
          }
        }
      })

      .state('admin.tournament.id.details', {
        url: '/details',
        views: {
          'tourney-info': {
            templateUrl: 'templates/tournaments/tourney.html',
            controller: 'TourneyDetailsController'
          }
        }
      })
      .state('admin.tournament.create', {
        url: '/create',
        views: {
          'tourney': {
            templateUrl: 'templates/tournaments/tourney.html',
            controller: 'TourneyController'
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
      .state('login' , {
        url: '/login',
        data: {
          requireLogin: false,
        },
        templateUrl: 'templates/pages/login.html',
        controller: 'UserController'
      })
      .state('register' , {
        url: '/register',
        data: {
          requireLogin: false,
        },
        templateUrl: 'templates/pages/register.html',
        controller: 'UserController'
      })
      .state('home', {
        url: '/home',
        data: {
          requireLogin: false,
        },
        templateUrl: 'templates/pages/home.html',
        controller: 'UserController'

      })
      .state('viewTournaments', {
        url: '/view-tournaments',
        data: {
          requireLogin: false,
        },
        templateUrl: 'templates/pages/view-tournaments.html',
        controller: 'ViewTournamentsController'
      })
      .state('createBracket', {
        url: '/create-bracket',
        data: {
          requireLogin: true,
        },
        templateUrl: 'templates/pages/create-bracket.html',
        controller: 'CreateBracketController'
      })
      .state('bracket-detail', {
        url: '/bracket/:id',
        templateUrl: 'templates/pages/brackets/bracket-detail.html',
        controller: 'BracketDetailController'
      })
      .state('single-match', {
        url: '/match/:id',
        templateUrl: 'templates/pages/brackets/match.html',
        controller: 'MatchController'
      })
  });