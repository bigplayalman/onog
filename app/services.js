angular.module('onog.services', []).run(function ($http) {

  })
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
  .factory('Bracket', ['Parse', function (Parse) {
    var Bracket = Parse.Object.extend('Bracket');
    Parse.defineAttributes(Bracket, ['name', 'type', 'game', 'totalSlots', 'openSlots']);

    return Bracket;
  }])