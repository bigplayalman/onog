angular.module('onog.services.player', [])
  .service('playerServices', function (Player, Parse, Tournament, $filter) {
    var user = Parse.User.current ();

    return {
      findPlayer: findPlayer,
      getPlayers: getPlayers,
      updatePlayer: updatePlayer,
      checkIn: checkIn,
      getMyTournaments: getMyTournaments,
      saveSeeding: saveSeeding
    };
    
    function saveSeeding (players) {
      return Parse.Object.saveAll(players);
    }

    function getMyTournaments () {
      var query = new Parse.Query(Player.Model);
      query.equalTo('user', user);
      query.include('tournament');
      return query.find();
    }

    function checkIn (current) {
      var player = new Player.Model();
      player.id = current.id;
      player.set('checkin', true);
      return player.save();
    }

    function updatePlayer (current, heroes, tournament) {
      var player = new Player.Model();
      if(current.id) {
        player.id = current.id;
      } else {
        player.set('status', 'registered');
        player.set('user', Parse.User.current());
        player.set('checkin', false);
        player.set('tournament', tournament);
        player.set('seed', current.seed);
      }
      player.set('heroClasses', heroes);
      player.set('rank', current.rank);
      return player.save();
    }

    function getPlayers (tourney) {
      var tournament = new Tournament.Model();
      tournament.id = tourney;
      var query = new Parse.Query(Player.Model);
      query.equalTo('tournament', tournament);
      query.include('user');
      return query.find();
    }
    function  findPlayer (players, user) {
      if(!user) {
        return null;
      }
      return $filter('filter')(players, Parse.User.current().id, true)[0] || null;
    }

  })
  .factory('Player', ['Parse', function (Parse) {
    var Player = Parse.Object.extend('Player');
    Parse.defineAttributes(Player, ['tournament', 'user', 'seed', 'heroClasses', 'rank', 'status', 'checkin']);

    return {
      Model: Player
    }
  }]);

