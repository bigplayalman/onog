angular.module('onog.services',
  [
    'onog.services.modal',
    'onog.services.player',
    'onog.services.tournament',
    'onog.services.match'

  ])
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

