angular.module('onog.controllers.tournaments', [])
  .controller('TourneyController', function ($scope, $state, $stateParams, Tournament) {
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
  .controller('TourneyEditController', function($scope, $state, $stateParams, Tournament) {

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
  .controller('TourneyDetailsController', function($scope, $state, $stateParams, $filter, Tournament, Match, Parse, Round) {
    $scope.players = [];
    $scope.signedUp = false;
    $scope.hidden = $state.current.data.canEdit;
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
      })
    });
    $scope.setWidth = function (length) {
      var width = (100/length) + '%';
      return width;
    }
    $scope.matchMargin = function (length) {
      if(length === 1) {
       return '10px'
      }
      var margin = (256/Math.pow(length, 2)) + 'px';
      console.log(margin);
      return margin;
    }

    $scope.displayBracket = function (matches) {
      var rounds = [];
      var balance =[];
      var roundCount = 1;
      while($filter('filter')(matches, {round:{roundNum:roundCount}}).length > 0) {
        var round = {};
        var games = $filter('filter')(matches, {round:{roundNum:roundCount}});
        round.name = games[0].round.name;
        round.matches = games;
        roundCount++;
        if(round.name === 'Balance Round') {
          balance.push(round);
        } else {
          rounds.push(round);
        }
      }
      $scope.balance = balance;
      $scope.rounds = rounds.reverse();
    };

    $scope.edit = function () {
      $state.go('admin.tournament.id.edit');
    };
    $scope.delete = function () {
      $scope.tourney.destroy().then(function () {
        $state.go('admin.tournaments.active');
      });
    }

    $scope.cancel = function () {
      var tourney = new Tournament.Model();
      var minusTourney = $scope.tourney.current - 1;
      var minusPlayer = Parse.User.current().get('numOfTourneys') - 1;
      tourney.id = $scope.tourney.id;
      tourney.fetch().then(function(fetched) {
        fetched.relation('players').remove(Parse.User.current());
        fetched.set('current', minusTourney);
        fetched.save().then(function (saved) {
          $scope.tourney = saved;
          $scope.signedUp = false;
          Parse.User.current().set('numOfTourneys', minusPlayer);
          Parse.User.current().save().then(function(user) {
            $scope.user = user;
          });
        });
      });
    }

    $scope.signUp = function () {
      var tourney = new Tournament.Model();
      tourney.id = $scope.tourney.id;
      tourney.fetch().then(function(fetched) {
        fetched.relation('players').add(Parse.User.current());
        fetched.increment('current');
        fetched.save().then(function (saved) {
          $scope.tourney = saved;
          $scope.signedUp = true;
          Parse.User.current().increment('numOfTourneys');
          Parse.User.current().save().then(function(user) {
            $scope.user = user;
          });
        });
      });
    }

    $scope.activate = function (type) {
      switch (type) {
        case 'Single Elimination Bracket': generateSingleBracket(); break;
        default: break;
      }
    }
    
    var generateSingleBracket = function () {
      Match.deleteMatches($scope.tourney).then(function () {
        Match.createMatches($scope.players.length -1, $scope.tourney).then(function (matches) {
          Match.setNextMatch(matches).then(function(matches) {
            var games = $filter('orderBy')(matches, 'gameNum');
            Match.setPlayers($scope.players, games).then(function (matches) {
              var games = $filter('orderBy')(matches, 'gameNum');
              Round.deleteRounds($scope.tourney).then(function () {
                Round.createRounds($scope.tourney, games.length, $scope.players).then(function (rounds) {
                  Match.setRounds(rounds, games). then(function(matches){
                    $scope.displayBracket(matches);
                  });
                });
              });
            });
          });
        });
      });
    }
  })
  .controller('ActiveTourneysController', function($scope, $state, Tournament) {
    $scope.tournaments = [];
    Tournament.getActiveTournaments().then(function (tournaments) {
      $scope.tournaments = tournaments;
    })
  })
  .controller('TournamentListController', function($scope, $state, Tournament) {
    $scope.tournaments = [];
    Tournament.getActiveTournaments().then(function (tournaments) {
      $scope.tournaments = tournaments;
    })
  });