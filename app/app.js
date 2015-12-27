// script.js

// create the module and name it synergyApp
// also include ngRoute for all our routing needs

var synergyApp = angular.module('synergyApp', ['synergyApp.controllers', 'synergyApp.services', 'synergyApp.directives', 'ngRoute', 'ngParse', 'ui.bootstrap']);

synergyApp.config(['ParseProvider', function(ParseProvider) {
  ParseProvider.initialize('SbLlzPb3iyTBJTah7MjI4ypRm5wVFHQ8m8sdaQ3y', 'ZUKUhCdNlL8EL3N2FcYo6fEgoyHcTwyCE7ve45RG');
}]);
// configure our routes
synergyApp.config(function($routeProvider) {
  $routeProvider

  // route for the home page
    .when('/', {
      templateUrl : 'pages/home.html',
      controller  : 'mainController'
    })

    // route for the about page
    .when('/login', {
      templateUrl : 'pages/login.html',
      controller  : 'loginController'
    })
    .when('/sign-up', {
      templateUrl : 'pages/signUp.html',
      controller  : 'signUpController'
    })

    // route for the contact page
    .when('/add-employee', {
      templateUrl : 'pages/addEmployee.html',
      controller  : 'addEmployeeController'
    });
});