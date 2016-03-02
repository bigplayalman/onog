angular.module('onog.controllers.tournament', [])

  .controller('onog.controllers.tournament.ctrl', function ($scope, $state, $stateParams, Tournament) {
    $scope.status = null;
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

  .controller('onog.controllers.tournament.list.ctrl', function($scope, $state, Tournament) {
    $scope.tournaments = [];
    Tournament.getTournaments().then(function (tournaments) {
      $scope.tournaments = tournaments;
    })
  })

  .controller('onog.controllers.tournament.edit.ctrl', function($scope, $state, $stateParams, Tournament) {

    $scope.options = [
      {
        name: 'Active',
        value: 'active'
      },
      {
        name: 'On Hold',
        value: 'on hold'
      },
      {
        name: 'Completed',
        value: 'completed'
      }
    ];

    $scope.status = $scope.options[0].value;
    $scope.players = [];

    $scope.tourney = new Tournament.Model();
    $scope.tourney.id = $stateParams.id;
    $scope.tourney.fetch().then(function (tournament) {
      $scope.tourney = tournament;
      $scope.status = tournament.status;
    });

    $scope.submitTourney = function () {
      $scope.tourney.save().then(function () {
        $state.go('admin.tournament.id.details');
      })
    }
  })
  .controller('TourneyPlayerController', function ($scope, $state, $stateParams, $filter, Tournament, Match, Parse,Player, Round) {
    $scope.player = null;
    $scope.players = [];
    $scope.tourney = new Tournament.Model();
    $scope.tourney.id = $stateParams.id;

    $scope.user = Parse.User.current();
    $scope.balance = [];
    $scope.rounds = [];

    $scope.tourney.fetch().then(function (tournament) {
      $scope.tourney = tournament;
      var query = tournament.relation('players').query();
      query.descending('username');
      query.find().then(function (players) {
        $scope.players = players;
        if($scope.user) {
          var player = $filter('filter')(players, {id: $scope.user.id});
          if(player.length > 0) {
            $scope.signedUp = true;
          }
        }
        Match.getMatches($scope.tourney).then(function (matches) {
          $scope.displayBracket(matches);
        })
      });
    })


    var playerQuery = new Parse.Query(Player.Model);
    playerQuery.include('user');
    playerQuery.equalTo('user', Parse.User.current());
    playerQuery.equalTo('game', fetched.game);
    playerQuery.find().then(function (players) {
      $scope.player = players[0];
      fetched.relation('players').add(player);
    });
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

  })
  .controller('ActiveTourneysController', function($scope, $state, Tournament) {
    $scope.tournaments = [];
    Tournament.getActiveTournaments().then(function (tournaments) {
      $scope.tournaments = tournaments;
    })
  });