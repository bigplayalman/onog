angular.module('onog.services.tournament', [])
  .factory('Tournament', ['Parse', '$q', '$filter', 'Round', 'Match', function(Parse, $q, $filter, Round, Match) {
    var Model = Parse.Object.extend('Tournament');
    Parse.defineAttributes(Model, ['name', 'date', 'type', 'game', 'max', 'current', 'status', 'details', 'objectId', 'gameCount', 'finalsCount', 'winner']);

    return {
      Model:Model,
      increaseCount: increaseCount,
      decreaseCount: decreaseCount,
      fetchTournament: fetchTournament,
      getTournaments: getTournaments,
      saveTournament: saveTournament,
      getHeroClasses: getHeroClasses,
      getModes: getModes,
      getSizes: getSizes,
      getRank: getRank,
      deleteData: deleteData,
      createRounds: createRounds,
      createMatches: createMatches,
      connectMatches: connectMatches,
      seedMatches: seedMatches,
      getMatches: getMatches,
      evaluateMatches: evaluateMatches
    };

    function evaluateMatches (matches) {

      var lastRound = matches[matches.length - 1].roundNum;
      var lastRoundMatches = $filter('filter')(matches, {roundNum: lastRound});

      angular.forEach(lastRoundMatches, function (match) {

        var players = [];
        if(match.player1) {
          players.push(match.player1);
        }
        if(match.player2) {
          players.push(match.player2);
        }

        if(players.length === 1) {
          match.set('winner', players[0]);
          match.set('defWin', true);
          match.set('status', 'completed');
          if(match.slot) {
            match.nextMatch.set('player1', players[0]);
            match.nextMatch.set('status', 'active');
            match.nextMatch.set('user1', players[0].user);
          } else {
            match.nextMatch.set('player2', players[0]);
            match.nextMatch.set('status', 'active');
            match.nextMatch.set('user2', players[0].user);
          }
        }
      });

      return Parse.Object.saveAll(matches);
    }

    function getMatches (tournament) {
      var query = new Parse.Query(Match.Model);
      query.equalTo('tournament', tournament);
      query.include('nextMatch');
      query.include('player1');
      query.include('player2');
      query.include('round');
      query.ascending('matchNum');
      return query.find();
    }

    function seedMatches (connectedMatches, players) {
      var matchCount = connectedMatches.length - 1;
      var firstRound = connectedMatches[matchCount].round;
      var firstRoundMatches = $filter('filter')(connectedMatches, {round: firstRound});
      var firstRoundCount = firstRoundMatches.length - 1;
      var firstRoundIndex = 0;
      var sortedSeeded = $filter('orderBy')(players, 'seed');

      for(var i = 0; i < sortedSeeded.length; i++) {
        if(i%2) {
          firstRoundMatches[firstRoundCount].set('player2', sortedSeeded[i]);
          firstRoundMatches[firstRoundCount].set('status', 'active');
          firstRoundMatches[firstRoundCount].set('user2', sortedSeeded[i].user);
          firstRoundCount--;
        } else {
          firstRoundMatches[firstRoundIndex].set('player1', sortedSeeded[i]);
          firstRoundMatches[firstRoundIndex].set('status', 'active');
          firstRoundMatches[firstRoundIndex].set('user1', sortedSeeded[i].user);
          firstRoundIndex++;
        }

      }
      return Parse.Object.saveAll(connectedMatches);
    }
    function connectMatches (matches) {
      var matchCount = matches.length;
      var slot = 0;

      while (matchCount) {
        var currentMatch = matchCount - 1;
        var nextMatch = Math.floor(matchCount/2) - 1;
        if(matchCount !== 1) {
          matches[currentMatch].set('slot', slot);
          matches[currentMatch].set('nextMatch', matches[nextMatch]);
          if(slot > 0) {
            slot = -1;
          }
        }
        matchCount--;
        slot++;
      }
      return Parse.Object.saveAll(matches);
    }

    function createMatches (rounds) {
      var matches = [];
      var matchCount = 0;
      var tournament = rounds[0].tournament;
      var numOfRounds = rounds.length;
      while(numOfRounds) {
        var numOfMatches = Math.pow(2, rounds[numOfRounds - 1].roundNum - 1);
        while (numOfMatches) {
          var match = new Match.Model();
          matchCount++;
          match.set('matchNum', matchCount);
          match.set('tournament', tournament);
          match.set('status', 'pending');
          match.set('isValid', true);
          match.set('defWin', false);
          match.set('score', {player1: 0, player2:0 });
          match.set('roundNum', rounds[numOfRounds - 1].roundNum)
          match.set('round', rounds[numOfRounds - 1]);
          numOfMatches--;
          matches.push(match);
        }
        numOfRounds--;
      }
      return Parse.Object.saveAll(matches);
    }
    function createRounds (tourney) {
      var rounds =[]
      var numOfRounds = Math.ceil(Math.log2(tourney.current));

      while(numOfRounds) {
        var round = new Round.Model();
        round.set('tournament', tourney);
        round.set('roundNum', numOfRounds);
        switch(numOfRounds) {
          case 1:
            round.set('name', 'Finals');
            round.set('numOfGames', tourney.finalsCount);
            break;
          case 2:
            round.set('name', 'Semifinals');
            round.set('numOfGames', tourney.gameCount);
            break;
          default:
            round.set('numOfGames', tourney.gameCount);
            round.set('name', 'Round of ' + Math.pow(2,numOfRounds));
            break;
        }
        rounds.push(round);
        numOfRounds--;
      }
      return Parse.Object.saveAll(rounds);
    }

    function deleteData (tourney) {
      var data = [];
      var cb = $q.defer();
      var matches = new Parse.Query('Match');
      matches.equalTo('tournament', tourney);
      matches.find().then(function (matches) {
        var query = new Parse.Query('Round');
        query.equalTo('tournament', tourney);
        query.find({
          success: function (rounds) {
            data = rounds.concat(matches);
            tourney.winner = null;
            tourney.save().then(function () {
              Parse.Object.destroyAll(data).then(function () {
                cb.resolve();
              });
            });
            
          }
        });
      });
      return cb.promise;

    }

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
      var query = new Parse.Query('Tournament');
      query.equalTo('name', name)
      query.include('winner');
      return query.find();
    }

    function saveTournament (attributes) {
      var tourney = new Model(attributes);
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
    function getRank () {
      return ['25','24','23','22','21','20','19','18','17','16','15','14','13','12','11','10','9','8','7','6','5','4','3','2','1', 'Legend'];
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
