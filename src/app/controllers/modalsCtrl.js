angular.module('onog.controllers.modal', [])

  .controller('onog.controllers.modal.login.ctrl', function ($scope, $state, $uibModalInstance, Parse) {
    $scope.user = {
      username: null,
      password: null
    }
    $scope.login = function () {
      $scope.errorMessage = null;
      Parse.User.logIn($scope.user.username, $scope.user.password, {
        success: function(user) {
          $uibModalInstance.close(user);

        },
        error: function(user, error) {
          $scope.errorMessage = error;
          // The login failed. Check error to see why.
        }
      }).then (function () {
        $state.reload();
      });
    };

    $scope.invalid = function () {
      return (!$scope.user.username || !$scope.user.password);
    }

    $scope.cancel = function () {
      $uibModalInstance.close(null);
    };
  })
  .controller('onog.controllers.modal.register.ctrl', function ($scope, $state, $uibModalInstance, Parse) {
    $scope.user = {
      username: null,
      password: null
    }
    $scope.register = function () {
      $scope.errorMessage = null;
      var user = new Parse.User();
      user.set($scope.user)

      user.signUp(null,
        {
          success: function (user) {
            $uibModalInstance.close(user);
          },
          error: function (user, error) {
            $scope.errorMessage = error;
            // The login failed. Check error to see why.
          }
        })
        .then (function () {
          $state.reload();
        });
    }
    $scope.cancel = function () {
      $uibModalInstance.close(null);
    };
  })

  .controller('onog.controllers.modal.tournament.registration.edit.ctrl', function ($scope, $state, $uibModalInstance, $filter, playerServices, Tournament, player) {
    $scope.title = 'Edit Registration';

    $scope.heroClass = Tournament.getHeroClasses();

    $scope.player = player;
    $scope.checkResults = player.get('heroClasses');

    angular.forEach($scope.checkResults, function (hero) {
      var found = $filter('filter')($scope.heroClass, hero, true);
      found[0].value = true;
    });

    $scope.disableCheckbox = function (item) {
      var disable = false;
      if($scope.checkResults.length >= 3 && !item.value) {
        disable = true;
        return disable;
      }
      return disable;
    }

    $scope.$watch('heroClass', function(newValues, oldValues, scope) {
      $scope.checkResults = [];
      angular.forEach($scope.heroClass, function (model) {
        if (model.value) {
          $scope.checkResults.push(model.name);
        }
      });
    }, true);

    $scope.register = function () {
      $scope.errorMessage = null;

      playerServices.updatePlayer($scope.player, $scope.checkResults).then(function (data) {
        $uibModalInstance.close(data);
        $state.reload();
      }, function (err) {
        $scope.errorMessage = err.message;
      });

    }

    $scope.cancel = function () {
      $uibModalInstance.close(null);
    };

  })

  .controller('onog.controllers.modal.tournament.create.ctrl', function ($scope, $state, $uibModalInstance, Tournament, tournament) {
    $scope.title = 'Create Tournament';

    if(tournament) {
      $scope.tourney = tournament;
    } else {
      $scope.tourney = {
        status: null,
        maxPlayers: null,
        name: null
      }
    }

    $scope.modes = Tournament.getModes();

    $scope.tourneySizes = Tournament.getSizes();


    $scope.submitTourney = function () {
      if(typeof $scope.tourney.id === 'undefined') {
        $scope.tourney.status = 'registration';
        $scope.tourney.current = 0;
      };
      Tournament.setTournament($scope.tourney).then(function (tournament) {
        $uibModalInstance.close(null);
        $state.reload();
      });
    }
    $scope.cancel = function () {
      $uibModalInstance.close(null);
    };

  })

  .controller('onog.controllers.modal.tournament.registration.ctrl', function ($scope, $state, $uibModalInstance, playerServices, Tournament, tourney) {
    $scope.checkResults = [];
    $scope.title = 'Register for ' + tourney.name;

    $scope.heroClass = Tournament.getHeroClasses();

    $scope.player = {
      seed: 999,
    };

    $scope.disableCheckbox = function (item) {
      var disable = false;
      if($scope.checkResults.length >= 3 && !item.value) {
        disable = true;
        return disable;
      }
      return disable;
    }

    $scope.$watch('heroClass', function(newValues, oldValues, scope) {
      $scope.checkResults = [];
      angular.forEach($scope.heroClass, function (model) {
        if (model.value) {
          $scope.checkResults.push(model.name);
        }
      });
    }, true);

    $scope.register = function () {
      $scope.errorMessage = null;

      playerServices.createPlayer($scope.player, $scope.checkResults, tourney).then(function (data) {
        Tournament.increaseCount(tourney).then(function () {
          $uibModalInstance.close(data);
          $state.reload();
        });
      }, function (err) {
        $scope.errorMessage = err.message;
      });

    }

    $scope.cancel = function () {
      $uibModalInstance.close(null);
    };

  })
  .controller('onog.controllers.modal.tournament.cancel.ctrl', function ($scope, $state, $uibModalInstance, playerServices, Tournament, player, tourney) {
    $scope.player = player;
    $scope.cancelRegistration = function () {
      $scope.player.destroy().then(function (data) {
        Tournament.decreaseCount(tourney).then(function () {
          $uibModalInstance.close(data);
          $state.reload();
        })
      })
    }
    $scope.cancel = function () {
      $uibModalInstance.close(null);
    };
  });
