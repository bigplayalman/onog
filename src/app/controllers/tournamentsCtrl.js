angular.module('onog.controllers.tournaments', [])
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
      Tournament.setTournament($scope.tourney).then(function (tournament) {
        $state.go('admin.tournaments.active');
      });
    }
  })
  .controller('TourneyDetailsController', function($scope, $stateParams, Tournament) {
    $scope.players = [];
    $scope.tourney = new Tournament.Model();
    $scope.tourney.id = $stateParams.id;
    $scope.tourney.fetch().then(function (tournament) {
      $scope.tourney = tournament;
    });
  })
  .controller('ActiveTourneysController', function($scope, $state, Tournament) {
    $scope.tournaments = [];
    Tournament.getActiveTournaments().then(function (tournaments) {
      $scope.tournaments = tournaments;
    })
  })