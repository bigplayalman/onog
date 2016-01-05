angular.module('onog.services', []).run(function ($http) {

  })
  .service('userService', function () {
    var newUser = false;
    var setNewUser = function (value) {
      newUser = value;
    };
    var getNewUser = function () {
      return newUser;
    };
    return {
      setNewUser : setNewUser,
      getNewUser : getNewUser
    };
  })
  .service('BracketRounds', function (Parse, Round, Match) {
    var getRounds = function (length) {
      var rounds = 0;
      var remainder = 4 - (length % 4);
      var players = length + remainder
      for(var i = 0; i <= players; i += 4) {
        rounds++;
      }
      return rounds;
    }
    var updateRounds = function (matches) {
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
    var deleteRounds = function (bracket) {
      var query = new Parse.Query(Round);
      query.equalTo('parent', bracket);
      return query.find({
        success: function (rounds) {
          Parse.Object.destroyAll(rounds);
        }});
    }

    var getRoundName = function (roundNum) {
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

    var createRounds = function (players, bracket) {
      var numRounds = getRounds(players);
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
          name = getRoundName(i);
        }

        if(players === 2) {
          numGames = 1;
          name = 'Finals';
        }

        round.set('name', name);
        round.set('numGames', numGames);
        round.set('roundNum', i);
        round.set('parent', bracket);
        players = players/2;
        rounds.push(round);
      }
      return Parse.Object.saveAll(rounds);
    }
    return {
      createRounds: createRounds,
      deleteRounds: deleteRounds,
      updateRounds: updateRounds,
      getRounds : getRounds,
      getRoundName: getRoundName
    }
  })
  .service('Shuffle', function () {
    var shufflePlayers = function (array) {
      var m = array.length, t, i;
      // While there remain elements to shuffle…
      while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
      }

      return array;
    }
    return {
      shufflePlayers : shufflePlayers
    }
  })
  .factory('Round', ['Parse', function (Parse) {
    var Round = Parse.Object.extend('Round');
    Parse.defineAttributes(Round, ['matches', 'name', 'parent', 'roundNum']);

    return Round;
  }])
  .factory('Match', ['Parse', function (Parse) {
    var Match = Parse.Object.extend('Match');
    var attributes = ['bracket', 'gameNum', 'playerOne', 'playerTwo', 'scoreOne', 'scoreTwo', 'winner', 'loser', 'nextMatch', 'previousMatchOne', 'previousMatchTwo']
    Parse.defineAttributes(Match, attributes);

    var deleteMatches = function (bracket) {
      var query = new Parse.Query(Match);
      query.equalTo('bracket', bracket);
      return query.find({
        success: function (matches) {
          Parse.Object.destroyAll(matches);
        }
      });
    }
    var createMatches = function (numGames, bracket) {
      var gameCount = 0;
      var matches = [];
      while(gameCount < numGames) {
        var match = new Match();
        match.set('gameNum', gameCount);
        match.set('bracket', bracket);
        matches.push(match);
        gameCount++;
      }
      return Parse.Object.saveAll(matches);
    }

    var setNextMatch = function (games) {
      var matches = games.slice(1, games.length);
      var gameCount = matches.length;//6
      while(gameCount > 0) {
        gameCount--;
        var nextGame = Math.floor(gameCount/2);
        matches[gameCount].set('nextMatch', games[nextGame]);
      }
      matches.push(games.slice(0,1)[0]);
      return Parse.Object.saveAll(matches);
    }

    return {
      Match: Match,
      deleteMatches: deleteMatches,
      createMatches: createMatches,
      setNextMatch: setNextMatch
    };
  }])
  .factory('Bracket', ['Parse', function (Parse) {
    var Bracket = Parse.Object.extend('Bracket');
    Parse.defineAttributes(Bracket, ['name', 'type', 'game', 'totalSlots', 'registeredSlots']);

    return Bracket;
  }])
  .service('BracketList', function(Parse, Bracket) {
    var getAvailableList = function() {
      var query = new Parse.Query(Bracket);
      query.notEqualTo('players', Parse.User.current());
      return query.find();
    }
    var getRegisteredList = function() {
      var query = new Parse.Query(Bracket);
      query.equalTo('players', Parse.User.current());
      return query.find();
    }
    return {
      getAvailableList : getAvailableList,
      getRegisteredList : getRegisteredList
    }
  });

