angular.module('onog.services.tournament', [])
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
      Model:Model,
      fetchTournament: fetchTournament,
      getTournaments: getTournaments,
      setTournament: setTournament
    };
  }]);
