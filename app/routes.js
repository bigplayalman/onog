angular.module('onog.routes', [])

  .config(function($stateProvider, $urlRouterProvider) {
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/home');
    $stateProvider
      .state('menu', {
        url: '/menu',
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })
      .state('login' , {
          url: '/login',
          templateUrl: 'templates/pages/login.html',
          controller: 'userCtrl'
      })
      .state('signUp' , {
          url: '/signUp',
          templateUrl: 'templates/pages/signUp.html',
          controller: 'userCtrl'
      })
      .state('home', {
        url: '/home',
        templateUrl: 'templates/pages/home.html',
        controller: 'userCtrl'

      })
  });