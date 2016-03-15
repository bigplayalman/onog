angular.module('account.routes', [])

  .config(function($stateProvider) {
    $stateProvider

      .state('account', {
        url: '/account',
        abstract: true,
        data: {
          requireLogin: true,
        },
        views: {
          menu: {
            template: '<div onog-menu class="container-fluid"></div>',
            controller: 'onog.controllers.menu.default.ctrl'
          },
          content: {
            template: '<div class="navbar-inverse"><div onog-sub-menu class="container-fluid"></div></div><div ui-view="account" class="content"></div>',
            controller: 'account.controllers.menu.ctrl'
          }
        }
      })

      .state('account.dashboard', {
        url: '',
        views: {
          'account': {
            templateUrl: 'templates/account/dashboard.html',
            controller: 'account.controllers.dashboard.ctrl'
          }
        }
      })
      .state('account.tournament', {
        url: '/tournament',
        abstract: true,
        data: {
          requireLogin: false,
        },
        views: {
          account: {
            template: '<div ui-view name="tournament" class="container-fluid"></div>',
          }
        }
      })
      .state('account.tournament.list', {
        url: '/list',
        views: {
          'tournament': {
            templateUrl: 'templates/tournaments/tournaments-list.html',
            controller: 'account.controllers.tournament.list.ctrl'
          }
        }
      })
      .state('account.tournament.details', {
        url: '/:name',
        views: {
          'tournament': {
            templateUrl: 'templates/tournaments/tourney-details.html',
            controller: 'onog.controllers.tournament.detail.ctrl'
          }
        },
        resolve: {
          tournament: function ($stateParams, Tournament) {
            return Tournament.fetchTournament($stateParams.name);
          },
          players: function(tournament, playerServices) {
            return playerServices.getPlayers(tournament[0]);
          }
        }
      })

      .state('account.matches', {
        url: '/matches',
        views: {
          'account': {
            templateUrl: 'templates/account/matches.html',
            controller: 'account.controllers.matches.ctrl'
          }
        }
      })
  });
