angular.module('onog.services',
  [
    'onog.services.modal',
    'onog.services.player',
    'onog.services.tournament',
    'onog.services.match',
    'onog.services.round'

  ])
  .filter('unique', function () {

    return function (items, filterOn) {

      if (filterOn === false) {
        return items;
      }

      if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
        var hashCheck = {}, newItems = [];

        var extractValueToCompare = function (item) {
          if (angular.isObject(item) && angular.isString(filterOn)) {
            return item[filterOn];
          } else {
            return item;
          }
        };

        angular.forEach(items, function (item) {
          var valueToCheck, isDuplicate = false;

          for (var i = 0; i < newItems.length; i++) {
            if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
              isDuplicate = true;
              break;
            }
          }
          if (!isDuplicate) {
            newItems.push(item);
          }

        });
        items = newItems;
      }
      return items;
    };
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
      admin = roles;
    }
    return {
      returnRole: returnRole,
      getRole: getRole,
      setRole: setRole
    }
  });

