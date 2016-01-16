angular.module('onog.controllers.admin', [])
  .controller('AdminController', function($scope, Parse, Admin) {

  })
  .controller('TourneyController', function ($scope, $state, $stateParams, Tournament) {
    if(typeof $stateParams.id === 'undefined') {
      $scope.tourney = {};
    }

    $scope.reset = function () {
      $scope.tourney = {};
    }

    $scope.submitTourney = function () {
      if(typeof $scope.tourney.id === 'undefined') {
        $scope.tourney.status = 'active';
        $scope.tourney.current = 0;
      };
      console.log($scope.tourney);
      Tournament.setTournament($scope.tourney).then(function (tournament) {
        $scope.tourney = tournament;
      });
    }
  })
  .controller('TournamentsController', function($scope, $state, Tournament) {
    $scope.tournaments = [];
    Tournament.getActiveTournaments().then(function (tournaments) {
      $scope.tournaments = tournaments;
    })
  })
  .controller('AdminMenuController', function($scope, $state) {
    $scope.active = {
      path: $state.$current.name
    }
    $scope.menuItems = [
      {
        title: 'Home',
        icon: 'fa-home',
        name: 'admin.dashboard'
      },
      {
        title: 'Active Tournaments',
        icon: 'fa-trophy',
        name: 'admin.tournaments.active'
      },
      {
        title: 'Create a Tournament',
        icon: 'fa-fort-awesome',
        name: 'admin.tournament.create'
      }
    ];

    $scope.logout = function () {
      Admin.setRole(null);
      Parse.User.logOut();
    }
  })