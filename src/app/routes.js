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
          requireAdmin: true,
          canEdit: true
        },
        templateUrl: 'templates/admin/admin.html'
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
        url: '/edit',
        views: {
          'tourney-info': {
            templateUrl: 'templates/tournaments/tourney.html',
            controller: 'TourneyEditController'
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
        abstract: true,
        data: {
          requireLogin: false,
        },
        templateUrl: 'templates/home.html',
      })
      .state('home.index', {
        url: '',
        views: {
          'content': {
            template: 'hello'
          }
        }
      })
      .state('tournaments', {
        url: '/tournaments',
        abstract: true,
        data: {
          requireLogin: false,
        },
        template: '<div ui-view="menu" class="navbar navbar-inverse"></div><div ui-view="content" class="col-xs-12"></div>'
      })
      .state('tournaments.index', {
        url: '',
        views: {
          'menu': {
            templateUrl: 'templates/menus/home-menu.html',
            controller: 'MenuController'
          },
          'content': {
            templateUrl: 'templates/pages/tournaments.html',
            controller: 'TournamentListController'
          }
        }
      })

      .state('tournaments.tournament', {
        url: '/:id',
        data: {
          canEdit: false
        },
        views: {
          'menu': {
            templateUrl: 'templates/menus/home-menu.html',
            controller: 'MenuController'
          },
          'content': {
            templateUrl: 'templates/tournaments/tourney-details.html',
            controller: 'TourneyDetailsController'
          }
        }
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