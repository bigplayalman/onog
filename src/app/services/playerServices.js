angular.module('onog.services.player', [])
  .service('playerServices', function (Player, Parse, Tournament, $filter) {

    return {
      findPlayer: findPlayer,
      createPlayer: createPlayer,
      getPlayers: getPlayers,
      updatePlayer: updatePlayer,
      checkIn: checkIn
    };

    function checkIn (current) {
      var player = new Player.Model();
      player.id = current.id;
      player.set('checkin', true);
      return player.save();
    }

    function updatePlayer (current, heroes) {
      var player = new Player.Model();
      player.id = current.id;
      player.set('heroClasses', heroes);
      player.set('rank', current.rank);
      return player.save();
    }

    function getPlayers (tourney) {
      var query = new Parse.Query(Player.Model);
      query.equalTo('tournament', tourney);
      query.include('user');
      return query.find();
    }
    function  findPlayer (players, user) {
      if(!user) {
        return null;
      }
      return $filter('filter')(players, Parse.User.current().id, true)[0] || null;
    }


    function createPlayer (current, heroes, tournament) {
      var player = new Player.Model(current);
      player.set('tournament', tournament);
      player.set('heroClasses', heroes);
      player.set('status', 'registered');
      player.set('checkin', false)
      player.set('user', Parse.User.current());
      return player.save();
    }

  })
  .factory('Player', ['Parse', function (Parse) {
    var Player = Parse.Object.extend('Player');
    Parse.defineAttributes(Player, ['tournament', 'user', 'seed', 'heroClasses', 'rank', 'status', 'checkin']);

    return {
      Model: Player
    }
  }]);

