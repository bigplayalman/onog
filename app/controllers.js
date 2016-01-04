var Controllers = angular.module('onog.controllers', [])
  .controller('MenuController', function($scope, $state) {
      $scope.logout = function () {
        Parse.User.logOut();
        $state.go('login');
      }
  })
  .controller('ViewTournamentsController', function($scope, Parse, BracketList) {

    BracketList.getAvailableList().then(function (brackets) {
      $scope.availableList = brackets;
    });

    BracketList.getRegisteredList().then(function(brackets) {
      $scope.registeredList = brackets;
    });

    $scope.cancel = function (bracket) {
      var index = $scope.registeredList.indexOf(bracket);
      var relation = bracket.relation('players');
      var registered = bracket.get('registeredSlots')  - 1;
      relation.remove(Parse.User.current());
      $scope.availableList.push(bracket);
      $scope.registeredList.splice(index, 1);
      bracket.set('registeredSlots', registered);
      bracket.save();
    }

    $scope.signUp = function (bracket) {
      var index = $scope.availableList.indexOf(bracket);
      var relation = bracket.relation('players');
      var registered = bracket.get('registeredSlots') + 1;
      relation.add(Parse.User.current());
      $scope.registeredList.push(bracket);
      $scope.availableList.splice(index, 1);
      bracket.set('registeredSlots', registered);
      bracket.save();
    }
  })
  .controller('BracketDetailController', function($scope, $state, $stateParams, Parse, Bracket, Shuffle, BracketRounds, Match, Round) {
    $scope.bracket = new Bracket();
    $scope.players = [];
    $scope.bracket.id = $stateParams.id;
    $scope.bracket.fetch().then(function (bracket) {
      $scope.bracket = bracket;
      bracket.relation('players').query().find({
        success: function(players) {
          $scope.players = players;
          $scope.displayBracket();
        }
      });
    }).catch(function(err) {
      $state.go('viewTournaments');
    });

    $scope.displayBracket = function () {
      var query = new Parse.Query(Round);
      query.equalTo('parent', $scope.bracket);
      query.include('matches');
      query.descending('roundNum');
      query.find().then(function(rounds) {
        $scope.rounds = rounds;
      });
    }

    $scope.deleteRounds = function () {
      var query = new Parse.Query(Round);
      query.equalTo('parent', $scope.bracket);
      return query.find({
        success: function (rounds) {
          Parse.Object.destroyAll(rounds);
      }});
    }
    $scope.deleteMatches = function () {
      var query = new Parse.Query(Match);
      query.equalTo('bracket', $scope.bracket);
      return query.find({
        success: function (rounds) {
          Parse.Object.destroyAll(rounds);
        }});
    }

    $scope.createRounds = function () {
      var players = $scope.players.length;
      var numRounds = BracketRounds.getRounds(players);
      var rounds  = [];
      for(var i = numRounds; i >= 1; i--) {
        var round = new Round();
        var name = '';
        var numGames = 0;
        var remainder = 0;
        if(players % 4 !== 0 && players > 4) {
          remainder = 4 - (players % 4);
        }
        if(remainder === 2 && players > 4) {
          numGames = 2;
          name = 'Balance Round'
          players = players + remainder;
        } else if(remainder === 3 && players > 4) {
          numGames = 1;
          name = 'Balance Round'
          players = players + remainder;
        } else {
          players = (players + remainder);
          numGames = players/2;
          name = $scope.getRoundName(i);
        }

        if(players === 2) {
          numGames = 1;
          name = 'Finals';
        }

        round.set('name', name);
        round.set('numGames', numGames);
        round.set('roundNum', i);
        round.set('parent', $scope.bracket);
        players = players/2;
        rounds.push(round);
      }
      return Parse.Object.saveAll(rounds);
    }

    $scope.getRoundName = function (roundNum) {
      switch(roundNum) {
        case 1:
          return 'Finals';
          break;
        case 2:
          return 'Semifinals';
          break;
        case 3:
          return 'Quarterfinals';
          break;
        default: return  'Round of ' + roundNum;
      }
    }

    $scope.createMatches = function (list) {
      var matches = [];
      var players = Shuffle.shufflePlayers($scope.players.slice());
      var remainder = 4 - (players.length % 4);

      list.forEach(function(round) {
        var matchCount = 1;
        var currentRound = round;
        while(matchCount <= round.get('numGames')) {


          var match = new Match();
          var playerOne = players[0];
          var playerTwo = players[1];
          var defaults = {
            bracket: $scope.bracket,
            score: null,
            playerOne: null,
            playerTwo: null,
            winner: null,
            loser: null,
          }

          match.set(defaults);
          match.set('parent', currentRound);

          if (players.length === 2) {
            if(round.get('name') === 'Balance Round') {
              match.set('playerOne', playerOne);
              match.set('playerTwo', playerTwo);
              players.splice(0, 2);
            } else {
              match.set('playerOne', playerOne);
              players.splice(0, 1);
            }
          }

          if(players.length === 1) {
            if (remainder === 1) {
              match.set('playerOne', playerOne);
              match.set('winner', playerOne);
              match.set('score', 'defwin');
              remainder = 0;
            } else if(matchCount === round.get('numGames')) {
              match.set('playerTwo', playerOne);
              players.splice(0, 1);
            }
          }

          if(players.length > 2) {
            match.set('playerOne', playerOne);
            match.set('playerTwo', playerTwo);
            players.splice(0, 2);
          }

          matchCount++;
          matches.push(match);
        }
      });
      return Parse.Object.saveAll(matches);
    }
    $scope.updateRounds = function (matches) {
      var rounds = [];
      matches.forEach(function(match) {
        var game = new Match();
        game.id = match.id;
        var round = new Round();
        round.id = match.parent.id;
        round.add('matches', game);
        rounds.push(round);
      });
      return Parse.Object.saveAll(rounds);
    }

    $scope.generateBracket = function () {
      $scope.deleteRounds().then(function(){
        $scope.createRounds().then(function (rounds) {
          $scope.deleteMatches().then(function () {
            $scope.createMatches(rounds).then(function(matches) {
              $scope.updateRounds(matches).then(function(rounds) {
                $scope.displayBracket();
              });
            });
          });
        });
      });
    }
  })
  .controller('CreateBracketController', function($scope, Parse, Bracket) {
    $scope.bracket = new Bracket();
    $scope.createBracket = function () {
      $scope.bracket.set('registeredSlots', 0);
      $scope.bracket.save().then(function () {
        $scope.bracket = new Bracket();
      });
    }

  })
  .controller('UserController', function($scope, $state, Parse) {

    $scope.login = function (user) {
      Parse.User.logIn(user.username, user.password, {
        success: function(user) {
          $state.go('home');
        },
        error: function(user, error) {
          // The login failed. Check error to see why.
        }
      });
    }
    $scope.signUp = function (newUser) {
      var user = new Parse.User();
      user.set("username", newUser.username);
      user.set("password", newUser.password);
      user.set("email", newUser.email);

      user.signUp(null, {
        success: function(user) {
          $state.go('login');
        },
        error: function(user, error) {
          // Show the error message somewhere and let the user try again.
          alert("Error: " + error.code + " " + error.message);
        }
      });
    }
  });
