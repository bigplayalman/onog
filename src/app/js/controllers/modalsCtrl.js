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

  .controller('onog.controllers.modal.tournament.create.ctrl', function ($scope, $state, $uibModalInstance, Tournament, tournament, id, title) {

    $scope.title = title;
    $scope.id = id;

    if(tournament) {
      $scope.tournament = tournament;
    } else {
      $scope.tournament = {
        status: 'pending',
        type: 'single',
        game: 'Hearthstone',
        current: 0,
        max: null,
        name: null
      }
    }

    $scope.modes = Tournament.getModes();

    $scope.tourneySizes = Tournament.getSizes();


    $scope.submitTourney = function () {
      Tournament.setTournament($scope.tournament, id).then(function (tournament) {
        $uibModalInstance.close(tournament);
      });
    }

    $scope.cancel = function () {
      $uibModalInstance.close(null);
    };

  })

  .controller('onog.controllers.modal.tournament.registration.ctrl',
    function ($scope, $filter, $state, $uibModalInstance, playerServices, Tournament, tourney, player) {
      $scope.checkResults = [];
      $scope.title = 'Register for ' + tourney.name;

      $scope.player = {
        seed: 999,
      };

      if(player) {
        $scope.title = 'Edit Registration';
        $scope.player = player;
        $scope.checkResults = player.get('heroClasses');
      }

      $scope.heroClass = Tournament.getHeroClasses();

      $scope.ranks = Tournament.getRank();

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

        playerServices.updatePlayer($scope.player, $scope.checkResults, tourney).then(function (data) {
          if($scope.player.id) {
            $uibModalInstance.close(data);
            $state.reload();
          } else {
            Tournament.increaseCount(tourney).then(function () {
              $uibModalInstance.close(data);
              $state.reload();
            });
          }
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
