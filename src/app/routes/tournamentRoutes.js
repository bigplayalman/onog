angular.module('tournament.routes', [])

  .config(function($stateProvider) {
    $stateProvider

      .state('tournament', {
        url: '/tournament',
        abstract: true,
        data: {
          requireLogin: false,
        },
        views: {
          menu: {
            template: ''
          },
          content: {
            templateUrl: 'templates/tournament.html'
          }
        }
      })
      .state('tournament.list', {
        url: '/list',
        views: {
          'tournament': {
            templateUrl: 'templates/tournaments/tournaments-list.html',
            controller: 'onog.controllers.tournament.list.ctrl'
          }
        }
      })

      .state('tournament.details', {
        url: '/:id',
        data: {
          canEdit: false
        },
        views: {
          'tournament': {
            templateUrl: 'templates/tournaments/tourney-details.html',
            controller: 'onog.controllers.tournament.detail.ctrl'
          }
        }
      })
  });
