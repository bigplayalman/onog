angular.module('onog.routes', [])

  .config(function($stateProvider, $urlRouterProvider) {
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/home');
    $stateProvider
      .state('login' , {
        url: '/login',
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
        templateUrl: '/templates/pages/brackets/bracket-detail.html',
        controller: function($scope, $stateParams) {
          console.log($stateParams);
        }
      })
  });