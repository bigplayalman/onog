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

    var deleteRounds = function (bracket) {
      var query = new Parse.Query(Round);
      query.equalTo('parent', bracket);
      return query.find({
        success: function (rounds) {
          Parse.Object.destroyAll(rounds);
        }
      });
    }

    var createRounds = function(bracket, numGames, players) {
      var rounds =[];
      var roundCount = 0;

      while(players.length > Math.pow(2,roundCount)) {
        roundCount++;
        var round = new Round();
        round.set('parent', bracket);
        round.set('roundNum', roundCount);
        switch(roundCount) {
          case 1:
            round.set('name', 'Finals');
            break;
          case 2:
            round.set('name', 'Semifinals');
            break;
          default:
            if(numGames === Math.pow(2,roundCount)) {
              round.set('name', 'Round of ' + Math.pow(2,roundCount))
            } else {
              round.set('name', 'Balance Round');
            }
        }
        rounds.push(round);
      }
      return Parse.Object.saveAll(rounds);
    }

    return {
      Round: Round,
      createRounds: createRounds,
      deleteRounds: deleteRounds
    };
  }])
  .factory('Match', ['Parse', function (Parse) {
    var Match = Parse.Object.extend('Match');
    var attributes = ['bracket', 'gameNum', 'player1', 'player2', 'score1', 'score2', 'round', 'winner', 'nextMatch', 'isValid', 'inValidReason']
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
        match.set('isValid', true);
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

    var setPlayers = function (players, games) {
      var gamers = players.slice();
      var matchIndex = games.length -1;
      var matches =[];
      while(gamers.length > 0){
        if(gamers.length > 0) {
          var player = gamers[0];
          games[matchIndex].set('player1', player);
          games[matchIndex].set('score1', 0);
          gamers.splice(0,1);
        }
        if (gamers.length > 0) {
          var player = gamers[0];
          games[matchIndex].set('player2', player)
          gamers.splice(0,1);
        }

        matchIndex--;

      }
      return Parse.Object.saveAll(games);
    }

    var setRounds = function (rounds, games) {
      var matches = [];
      var roundIndex = 0;
      var gamesIndex = 1;

      while(gamesIndex <= games.length){
        if(gamesIndex >= Math.pow(2,roundIndex)) {
          roundIndex++
        }
        games[gamesIndex-1].set('round', rounds[roundIndex-1]);
        console.log('game: ' + gamesIndex + 'round: ' + roundIndex);
        gamesIndex++;
      }

      while(roundIndex < rounds.length) {
        var roundGames = Math.pow(2,roundIndex);
        while(gamesIndex < roundGames) {
          games[gamesIndex].set('round', rounds[roundIndex]);
          gamesIndex++;
          console.log('game: ' + gamesIndex + 'round: ' + roundIndex);
        }
        roundIndex++;
      }
      return Parse.Object.saveAll(games);
    }
    var submitMatch = function (match) {
      if(match.score1 > match.score2) {
        match.set('winner', match.player1);
        match.set('loser', match.player2);
      } else {
        match.set('winner', match.player2);
        match.set('loser', match.player1);
      }
    }

    return {
      Match: Match,
      deleteMatches: deleteMatches,
      createMatches: createMatches,
      setNextMatch: setNextMatch,
      setPlayers: setPlayers,
      setRounds: setRounds,
      submitMatch: submitMatch
    };
  }])
  .factory('Tournament', ['Parse', function(Parse) {
    var Model = Parse.Object.extend('Tournament');
    Parse.defineAttributes(Model, ['name', 'type', 'game', 'max', 'current', 'status', 'details']);

    var setTournament = function (attributes) {
      var tourney = new Model();
      tourney.set(attributes);
      return tourney.save();
    }

    var getActiveTournaments = function () {
      var query = new Parse.Query(Model);
      query.equalTo('status', 'active');
      return query.find();
    }

    return {
      Model: Model,
      getActiveTournaments: getActiveTournaments,
      setTournament: setTournament
    };
  }])
  .factory('Bracket', ['Parse', function (Parse) {
    var Bracket = Parse.Object.extend('Bracket');
    Parse.defineAttributes(Bracket, ['name', 'type', 'game', 'totalSlots', 'registeredSlots']);

    return Bracket;
  }])
  .service('Admin', function(Parse) {
    var admin = null;
    var returnRole = function () {
      return admin;
    }
    var getRole = function (usr) {
      var adminRoleQuery = new Parse.Query(Parse.Role);
      adminRoleQuery.equalTo('name', 'Administrators');
      adminRoleQuery.equalTo('users', usr);

      return adminRoleQuery.first();
    }
    var setRole = function (roles) {
      admin = roles
    }
    return {
      returnRole: returnRole,
      getRole: getRole,
      setRole: setRole
    }
  })
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

