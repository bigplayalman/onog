angular.module('admin.routes', [])

  .config(function($stateProvider) {
    $stateProvider

      .state('admin', {
        abstract: true,
        url: '/admin',
        data: {
          requireLogin: true,
          requireAdmin: true
        },
        views: {
          menu: {
            template: '<div onog-menu class="container-fluid"></div>',
            controller: 'onog.controllers.menu.default.ctrl'
          },
          content: {
            template: '<div class="navbar-inverse"><div onog-sub-menu class="container-fluid"></div></div><div ui-view="admin" class="container-fluid"></div>',
            controller: 'admin.controllers.menu.ctrl'
          }
        }

      })
      .state('admin.dashboard', {
        url: '',
        views: {
          admin: {
            templateUrl: 'templates/admin/dashboard.html',
            controller: 'admin.controllers.dashboard.ctrl'
          }
        }
      })
      .state('admin.tournament', {
        url: '/tournament',
        abstract: true,
        views: {
          admin: {
            template: '<div ui-view="tourney"></div>'
          }
        }
      })
      .state('admin.tournament.list', {
        url: '/list',
        views: {
          tourney: {
            templateUrl: 'templates/tournaments/tournaments-list.html',
            controller: 'admin.controllers.tournament.list.ctrl'
          }
        }
      })
      .state('admin.tournament.details', {
        url: '/:name',
        views: {
          tourney: {
            templateUrl: 'templates/admin/tournaments/admin-tournament-details.html',
            controller: 'admin.controllers.tournament.details.ctrl'
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

      .state('admin.match', {
        url: '/match',
        abstract: true,
        views: {
          content: {
            template: '<div ui-view="matches"></div>'
          }
        }
      })
      .state('admin.match.details', {
        url: '/:matchId',
        views: {
          matches: {
            templateUrl: 'templates/matches/admin-match.html',
            controller: 'MatchController'
          }
        }
      })
      .state('admin.match.list', {
        url: '/list',
        views: {
          matches: {
            templateUrl: 'templates/matches/admin-matches.html',
            controller: 'matchListController'
          }
        }
      })
  });
