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
    Parse.defineAttributes(Round, ['matches', 'name', 'tournament', 'roundNum']);

    var deleteRounds = function (tournament) {
      var query = new Parse.Query(Round);
      query.equalTo('tournament', tournament);
      return query.find({
        success: function (rounds) {
          Parse.Object.destroyAll(rounds);
        }
      });
    }

    var createRounds = function(tournament, numGames, players) {
      var rounds =[];
      var roundCount = 0;

      while(players.length > Math.pow(2,roundCount)) {
        roundCount++;
        var round = new Round();
        round.set('tournament', tournament);
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
  .factory('Player', ['Parse', function (Parse) {
    var Model = Parse.Object.extend('Player');
    var attributes = ['game', 'user', 'tourneyCount', 'matches', 'status', 'statusReason', 'results'];
    Parse.defineAttributes(Model, attributes);

    return {
      Model: Model
    }
  }])
  .factory('Match', ['Parse', function (Parse) {
    var Match = Parse.Object.extend('Match');
    var attributes = ['tournament', 'gameNum', 'player1', 'player2', 'score1', 'score2', 'round', 'winner', 'nextMatch', 'isValid', 'inValidReason', 'active']
    Parse.defineAttributes(Match, attributes);

    return {
      Match: Match,
      getMatch: getMatch,
      saveMatch: saveMatch,
      deleteMatches: deleteMatches,
      createMatches: createMatches,
      setNextMatch: setNextMatch,
      setPlayers: setPlayers,
      setRounds: setRounds,
      submitMatch: submitMatch,
      getMatches: getMatches
    };

    function saveMatch (match) {
      return match.save();
    }
    function getMatch(id) {
      var match = new Match();
      match.id = id;
      return match.fetch();
    }
    function getMatches (tourney) {
      var query = new Parse.Query(Match);
      query.equalTo('tournament', tourney);
      query.include('nextMatch');
      query.include('player1');
      query.include('player2');
      query.include('round');
      query.ascending('gameNum');
      return query.find();
    }

    function deleteMatches (tourney) {
      var query = new Parse.Query(Match);
      query.equalTo('tournament', tourney);
      return query.find({
        success: function (matches) {
          Parse.Object.destroyAll(matches);
        }
      });
    }
    function createMatches (numGames, tourney) {
      var gameCount = 0;
      var matches = [];
      while(gameCount < numGames) {
        var match = new Match();
        match.set('gameNum', gameCount);
        match.set('isValid', true);
        match.set('tournament', tourney);
        match.set('active', false);
        matches.push(match);
        gameCount++;
      }
      return Parse.Object.saveAll(matches);
    }

    function setNextMatch (games) {
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

    function setPlayers (players, games) {
      var gamers = players.slice();
      var matchIndex = games.length -1;
      var matches =[];
      while(gamers.length > 0){
        if(gamers.length > 0) {
          var player = gamers[0];
          games[matchIndex].set('player1', player);
          games[matchIndex].set('score1', {player1: 0, player2: 0});
          gamers.splice(0,1);
        }
        if (gamers.length > 0) {
          var player = gamers[0];
          games[matchIndex].set('player2', player);
          games[matchIndex].set('score2', {player1: 0, player2: 0});
          gamers.splice(0,1);
        }
        games[matchIndex].set('active', true);

        matchIndex--;

      }
      return Parse.Object.saveAll(games);
    }

    function setRounds (rounds, games) {
      var matches = [];
      var roundIndex = 0;
      var gamesIndex = 1;

      while(gamesIndex <= games.length){
        if(gamesIndex >= Math.pow(2,roundIndex)) {
          roundIndex++
        }
        games[gamesIndex-1].set('round', rounds[roundIndex-1]);
        gamesIndex++;
      }

      while(roundIndex < rounds.length) {
        var roundGames = Math.pow(2,roundIndex);
        while(gamesIndex < roundGames) {
          games[gamesIndex].set('round', rounds[roundIndex]);
          gamesIndex++;
        }
        roundIndex++;
      }
      return Parse.Object.saveAll(games);
    }
    function submitMatch (match) {
      if(match.score1 > match.score2) {
        match.set('winner', match.player1);
        match.set('loser', match.player2);
      } else {
        match.set('winner', match.player2);
        match.set('loser', match.player1);
      }
    }
  }])
  .factory('Tournament', ['Parse', function(Parse) {
    var Model = Parse.Object.extend('Tournament');
    Parse.defineAttributes(Model, ['name', 'type', 'game', 'max', 'current', 'status', 'details']);

    var fetchTournament = function (id) {
      var tournament = new Model();
      tournament.id = id;
      return tournament.fetch();
    }

    var setTournament = function (attributes) {
      var tourney = new Model();
      tourney.set(attributes);
      return tourney.save();
    }

    var getTournaments = function () {
      var query = new Parse.Query(Model);
      return query.find();
    }

    return {
      fetchTournament: fetchTournament,
      getTournaments: getTournaments,
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

