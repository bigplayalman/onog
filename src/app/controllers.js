angular.module('onog.controllers', ['onog.controllers.admin', 'onog.controllers.tournaments'])
  .controller('MenuController', function($scope, $state) {
      $scope.logout = function () {
        Parse.User.logOut();
        $state.go('login');
      }
  })
  .controller('ViewTournamentsController', function($scope, Parse, BracketList) {

    BracketList.getAvailableList().then(function (brackets) {
      $scope.availableList = brackets;
    });

    BracketList.getRegisteredList().then(function(brackets) {
      $scope.registeredList = brackets;
    });

    $scope.cancel = function (bracket) {
      var index = $scope.registeredList.indexOf(bracket);
      var relation = bracket.relation('players');
      var registered = bracket.get('registeredSlots')  - 1;
      relation.remove(Parse.User.current());
      $scope.availableList.push(bracket);
      $scope.registeredList.splice(index, 1);
      bracket.set('registeredSlots', registered);
      bracket.save().then(function () {
        var num = Parse.User.current().get('numOfTourneys') - 1;
        Parse.User.current().set('numOfTourneys', num);
        Parse.User.current().save();
      });
    }

    $scope.signUp = function (bracket) {
      var index = $scope.availableList.indexOf(bracket);
      var relation = bracket.relation('players');
      var registered = bracket.get('registeredSlots') + 1;
      relation.add(Parse.User.current());
      $scope.registeredList.push(bracket);
      $scope.availableList.splice(index, 1);
      bracket.set('registeredSlots', registered);
      bracket.save().then(function () {
        Parse.User.current().increment('numOfTourneys');
        Parse.User.current().save();
      });
    }
  })
  .controller('BracketDetailController', function($scope, $state, $stateParams, $uibModal, $filter, Parse, Bracket, Round, Match) {
    $scope.bracket = new Bracket();
    $scope.players = [];
    $scope.bracket.id = $stateParams.id;
    $scope.bracket.fetch().then(function (bracket) {
      $scope.bracket = bracket;
      var query = bracket.relation('players').query();
      query.descending('username');
      query.find({
        success: function(players) {
          $scope.players = players;
        }
      });
    }).catch(function(err) {
      $state.go('viewTournaments');
    }).then(function () {
      var query = new Parse.Query(Match.Match);
      query.equalTo('bracket', $scope.bracket);
      query.include('nextMatch');
      query.include('player1');
      query.include('player2');
      query.include('round');
      query.ascending('gameNum');
      query.find().then(function(matches) {
        $scope.displayBracket(matches);
      })
    });

    $scope.displayBracket = function (matches) {
      var rounds = [];
      var balance =[];
      var roundCount = 1;
      while($filter('filter')(matches, {round:{roundNum:roundCount}}).length > 0) {
        var round = {};
        var games = $filter('filter')(matches, {round:{roundNum:roundCount}});
        round.name = games[0].round.name;
        round.matches = games;
        roundCount++;
        if(round.name === 'Balance Round') {
          balance.push(round);
        } else {
          rounds.push(round);
        }
      }
      $scope.balance = balance;
      $scope.rounds = rounds.reverse();
    }

    $scope.generateBracket = function () {
      Match.deleteMatches($scope.bracket).then(function () {
        Match.createMatches($scope.players.length -1, $scope.bracket).then(function (matches) {
          Match.setNextMatch(matches).then(function(matches) {
            var games = $filter('orderBy')(matches, 'gameNum');
            Match.setPlayers($scope.players, games).then(function (matches) {
              var games = $filter('orderBy')(matches, 'gameNum');
              Round.deleteRounds($scope.bracket).then(function () {
                Round.createRounds($scope.bracket, games.length, $scope.players).then(function (rounds) {
                  Match.setRounds(rounds, games). then(function(matches){
                    $scope.displayBracket(matches);
                  });
                });
              });
            });
          });
        });
      });
    }
  })
  .controller('CreateBracketController', function($scope, Parse, Bracket) {
    $scope.bracket = new Bracket();
    $scope.createBracket = function () {
      $scope.bracket.set('registeredSlots', 0);
      $scope.bracket.save().then(function () {
        $scope.bracket = new Bracket();
      });
    }

  })
  .controller('MatchController', function($scope, $stateParams, Parse, Match) {
    var query = new Parse.Query(Match.Match);
    query.include('nextMatch');
    query.include('player1');
    query.include('player2');
    query.include('winner1');
    query.include('winner2');
    query.include('round');
    query.get($stateParams.id, {
      success: function(match) {
        $scope.match = match;
      },
      error: function(object, error) {
        // The object was not retrieved successfully.
        // error is a Parse.Error with an error code and message.
      }
    });


    $scope.submitMatch = function () {

      var winner = null;
      $scope.winner === $scope.match.player1.id ? winner = $scope.match.player1  : winner = $scope.match.player2
      $scope.match.set('winner', winner);

      if($scope.match.round.name === 'Balance Round') {
        if($scope.match.gameNum % 2 === 0) {
          $scope.match.nextMatch.set('player1', winner)
        } else {
          $scope.match.nextMatch.set('player2', winner);
        }
      } else {
        if($scope.match.gameNum % 2 === 0) {
          $scope.match.nextMatch.set('player2', winner)
        } else {
          $scope.match.nextMatch.set('player1', winner);
        }
      }

      $scope.match.save().then(function (match) {
        console.log(match);
      })

    }
  })
  .controller('UserController', function($scope, $state, Parse) {

    $scope.login = function (user) {
      Parse.User.logIn(user.username, user.password, {
        success: function(user) {
          $state.go('home');
        },
        error: function(user, error) {
          // The login failed. Check error to see why.
        }
      });
    }
    $scope.signUp = function (newUser) {
      var user = new Parse.User();
      user.set("username", newUser.username);
      user.set("password", newUser.password);
      user.set("email", newUser.email);

      user.signUp(null, {
        success: function(user) {
          $state.go('login');
        },
        error: function(user, error) {
          // Show the error message somewhere and let the user try again.
          alert("Error: " + error.code + " " + error.message);
        }
      });
    }
  });
