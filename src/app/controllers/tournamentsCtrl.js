angular.module('onog.controllers.tournament', [])

  .controller('onog.controllers.tournament.list.ctrl', function($scope, $state, Tournament) {
    $scope.tournaments = [];
    Tournament.getTournaments().then(function (tournaments) {
      $scope.tournaments = tournaments;
    })
  })
  .controller('onog.controllers.tournament.detail.ctrl', function($scope, $state, $stateParams, $filter, Tournament, Match, Parse, Round, Player) {

    $scope.nextId = null;
    $scope.currentId = null;
    $scope.players = [];

    $scope.signedUp = false;
    $scope.hidden = $state.current.data.canEdit;


    $scope.user = Parse.User.current();
    $scope.balance = [];
    $scope.rounds = [];

    Tournament.fetchTournament($stateParams.id).then(function (tournament) {
      $scope.tourney = tournament;
      var query = tournament.relation('players').query();
      query.descending('username');
      query.find().then(function (players) {
        $scope.players = players;
        Match.getMatches($scope.tourney).then(function (matches) {
          $scope.displayBracket(matches);
        })
      })
    });

    $scope.setWidth = function (length) {
      var width = (100/length) + '%';
      return width;
    }

    $scope.matchMargin = function (index) {
      var margin = '10px;'
      return margin;
    }

    $scope.displayBracket = function (matches) {
      var rounds = [];
      var roundCount = 1;
      while($filter('filter')(matches, {round:{roundNum:roundCount}}).length > 0) {
        var round = {};
        var games = $filter('filter')(matches, {round:{roundNum:roundCount}});
        round.name = games[0].round.name;
        round.matches = games;
        roundCount++;
        rounds.push(round);
      }
      $scope.firstRound = rounds[rounds.length -1].name;
      console.log($scope.firstRound);
      $scope.rounds = rounds.reverse();
    };

    $scope.showActive = function ($event,match) {
      $scope.currentId = match.id;
      if(match.nextMatch){
        $scope.nextId = match.nextMatch.id;
      } else {
        $scope.nextId = match.id;
      }
      console.log($scope.nextId);
    }

  });