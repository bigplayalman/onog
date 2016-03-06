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
            template: '<div onog-menu class="container-fluid"></div>',
            controller: 'onog.controllers.menu.default.ctrl'
          },
          content: {
            template: '<div ui-view name="tournament" class="container-fluid"></div>',
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
        },
        resolve: {
          tournament: function ($stateParams, Tournament) {
            return Tournament.fetchTournament($stateParams.id);
          },
          players: function ($stateParams, playerServices) {
            return playerServices.getPlayers($stateParams.id);
          }
        }
      })
  });
