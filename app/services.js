angular.module('synergyApp.services', []).run(function ($http) {

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
  .factory('ParseEmployee', ['Parse', function (Parse) {
    "use strict";
    var ParseEmployee = Parse.Object.extend('Employees');
    Parse.defineAttributes(ParseEmployee, ['name', 'picture'])
    return ParseEmployee;
  }])