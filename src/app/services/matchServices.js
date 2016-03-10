angular.module('onog.services.match', ['onog.services.tournament'])

  .factory('Match', ['Parse', 'Tournament', function (Parse) {
    var Match = Parse.Object.extend('Match');
    var attributes = ['tournament', 'gameNum', 'player1', 'player2', 'score1', 'score2', 'round', 'winner', 'nextMatch', 'isValid', 'inValidReason', 'status']
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
      getMatches: getMatches,
      getUserMatches: getUserMatches
    };

    function getUserMatches (user, status) {
      var player1 = new Parse.Query(Match);
      player1.equalTo("player1", user);

      var player2 = new Parse.Query(Match);
      player2.equalTo("player2", user);

      var mainQuery = Parse.Query.or(player1, player2);
      mainQuery.equalTo('status', status);
      mainQuery.include('nextMatch');
      mainQuery.include('player1');
      mainQuery.include('player2');
      mainQuery.include('round');
      mainQuery.include('tournament');
      return mainQuery.find();

    }
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
        match.set('status', 'tbp');
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
        games[matchIndex].set('status', 'active');

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
  }]);
