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
      setTournament: setTournament,
      getHeroClasses: getHeroClasses,
      getModes: getModes,
      getSizes: getSizes
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
    function getSizes () {
      return [8,16,32,64,128,256,512,1024];
    }

    function getModes () {
      return ['registration','check-in','active','finished'];
    }
    function getHeroClasses () {
      return [
        {
          name: 'Druid',
          value: false,
        },
        {
          name: 'Hunter',
          value: false
        },
        {
          name: 'Mage',
          value: false
        },
        {
          name: 'Paladin',
          value: false
        },
        {
          name: 'Priest',
          value: false
        },
        {
          name: 'Rogue',
          value: false
        },
        {
          name: 'Shaman',
          value: false
        },
        {
          name: 'Warrior',
          value: false
        }
      ]
    }


  }]);
