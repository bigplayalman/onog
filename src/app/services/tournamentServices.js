angular.module('onog.services.tournament', [])
  .factory('Tournament', ['Parse', function(Parse) {
    var Model = Parse.Object.extend('Tournament');
    Parse.defineAttributes(Model, ['name', 'type', 'game', 'max', 'current', 'status', 'details']);

    return {
      Model:Model,
      increaseCount: increaseCount,
      decreaseCount: decreaseCount,
      fetchTournament: fetchTournament,
      getTournaments: getTournaments,
      setTournament: setTournament
    };

    function increaseCount (tourney) {
      var tournament = new Model();
      tournament.id = tourney.id;
      tournament.increment('current');
      return tournament.save();
    }

    function decreaseCount (tourney) {
      var tournament = new Model();
      var current = tourney.current - 1;
      tournament.id = tourney.id;
      tournament.set('current', current);
      return tournament.save();
    }

    function fetchTournament (name) {
      var query = new Parse.Query(Model);
      query.equalTo('name', name)
      return query.find();
    }

    function setTournament (attributes) {
      var tourney = new Model();
      tourney.set(attributes);
      return tourney.save();
    }

    function getTournaments () {
      var query = new Parse.Query(Model);
      return query.find();
    }


  }]);
