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
        template: '<div ui-view="menu"></div><div ui-view="content"></div>'
      })
      .state('admin.dashboard', {
        url: '',
        views: {
          'menu': {
            templateUrl: 'templates/menus/admin-menu.html',
          },
          'content': {
            templateUrl: 'templates/admin/admin-home.html',
            controller: 'AdminController'
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
        templateUrl: 'templates/pages/view-tournaments.html',
        controller: 'ViewTournamentsController'
      })
      .state('createBracket', {
        url: '/create-bracket',
        templateUrl: 'templates/pages/create-bracket.html',
        controller: 'CreateBracketController',
        onEnter: function($state, Parse){
          if(!Parse.User.current()) {
            $state.go('login');
          }
        }
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