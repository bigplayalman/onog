angular.module('onog.services.match', ['onog.services.tournament'])

  .factory('Match', ['Parse', '$filter', function (Parse, $filter) {
    var Model = Parse.Object.extend('Match');
    var attributes = ['tournament', 'round', 'matchNum', 'slot', 'player1', 'player2', 'score1', 'score2', 'winner', 'nextMatch', 'isValid', 'inValidReason', 'status', 'roundNum']
    Parse.defineAttributes(Model, attributes);

    return {
      Model: Model,
      getMatch: getMatch,
      saveMatch: saveMatch,
      submitMatch: submitMatch,
      getMatches: getMatches,
      getUserMatches: getUserMatches,
      randomPlayer: randomPlayer
    };

    function randomPlayer (array) {
      return Math.floor(Math.random()*array.length);
    }

    function getUserMatches (user, status) {
      var player1 = new Parse.Query(Model);
      player1.equalTo("player1", user);

      var player2 = new Parse.Query(Model);
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
      var match = new Model();
      match.id = id;
      return match.fetch();
    }
    function getMatches (tourney) {
      var query = new Parse.Query(Model);
      query.equalTo('tournament', tourney);
      query.include('nextMatch');
      query.include('player1');
      query.include('player2');
      query.include('round');
      query.ascending('gameNum');
      return query.find();
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

