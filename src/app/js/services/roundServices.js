angular.module('onog.services.round', [])

  .factory('Round', ['Parse', function (Parse) {
    var Model = Parse.Object.extend('Round');
    Parse.defineAttributes(Model, ['matches', 'name', 'tournament', 'roundNum', 'numOfGames']);
    return {
      Model: Model
    };
  }]);
