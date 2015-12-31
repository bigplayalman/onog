angular.module('onog.routes', [])

  .config(function($stateProvider, $urlRouterProvider) {
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/home');
    $stateProvider
      .state('login' , {
          url: '/login',
          templateUrl: 'templates/pages/login.html',
          controller: 'userCtrl'
      })
      .state('register' , {
          url: '/register',
          templateUrl: 'templates/pages/register.html',
          controller: 'userCtrl'
      })
      .state('home', {
        url: '/home',
        templateUrl: 'templates/pages/home.html',
        controller: 'userCtrl'

      })
      .state('createBracket', {
        url: '/create-bracket',
        templateUrl: 'templates/pages/create-bracket.html',
        controller: 'createBracketCtrl',
        onEnter: function($state, Parse){
          if(!Parse.User.current()) {
            $state.go('login');
          }
        }

      })
  });