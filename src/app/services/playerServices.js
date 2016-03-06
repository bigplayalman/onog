angular.module('onog.services.player', [])
  .service('playerServices', function (Player, Parse, Tournament, $filter) {

    return {
      findPlayer: findPlayer,
      createPlayer: createPlayer,
      getPlayers: getPlayers
    };

    function getPlayers (tourneyId) {
      var tournament = new Tournament.Model();
      tournament.id = tourneyId;
      var query = new Parse.Query(Player.Model);
      query.equalTo('tournament', tournament);
      return query.find();
    }
    function  findPlayer (players) {
      return $filter('filter')(players, Parse.User.current().id, true)[0] || null;
    }

    function createPlayer (current, heroes, tournament) {
      var player = new Player.Model(current);
      player.set('tournament', tournament);
      player.set('heroClasses', heroes);
      player.set('status', 'registered');
      player.set('user', Parse.User.current());
      return player.save();
    }


  })
  .factory('Player', ['Parse', function (Parse) {
    var Player = Parse.Object.extend('Player');
    Parse.defineAttributes(Player, ['tournament', 'user', 'seed', 'classes', 'rank', 'status']);

    return {
      Model: Player
    }
  }]);

