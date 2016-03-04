angular.module('onog.controllers.menu', [])

  .controller('onog.controllers.menu.default.ctrl', function($scope, $state, $uibModal, Parse, Admin) {

    $scope.user = Parse.User.current();

    var currentState = $state.$current.name.split('.')[0];
    $scope.active = {
      path: currentState
    }

    $scope.menuItems = [
      {
        title: 'Home',
        icon: 'fa-home',
        name: 'home.index',
        parent: 'home'
      },
      {
        title: 'Tournaments',
        icon: 'fa-trophy',
        name: 'tournament.list',
        parent: 'tournament'
      }
    ];

    if($scope.user) {
      $scope.menuItems.push({
        title: 'My Account',
        icon: 'fa-user',
        name: 'account.dashboard',
        parent: 'account'
      });

      Admin.getRole($scope.user).then(function (role) {
        if(role){
          Admin.setRole(role);
          $scope.admin = true;
          $scope.menuItems.push({
            title: 'Admin',
            icon: 'fa-dashboard',
            name: 'admin.dashboard',
            parent: 'admin'
          });
        } else {
          $scope.admin = false;
        }
      });
    }

    $scope.login = function () {
      showModal('templates/modals/login.html');
    }

    $scope.register = function () {
      showModal('templates/modals/register.html');
    }

    function showModal (templateUrl) {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: templateUrl,
        controller: 'onog.controllers.menu.modal.ctrl',
        size: 'sm',
        backdrop: 'static'
      });

      modalInstance.result.then(function (user) {
        $scope.user = user;
        console.log(user);
        $state.reload();
      });
    }

    $scope.logout = function () {
      Parse.User.logOut().then(function () {
        Admin.setRole(null);
        $scope.user = null;
        $state.reload();
      });
    }
  })
  .controller('onog.controllers.menu.modal.ctrl', function ($scope, $uibModalInstance, Parse) {
    $scope.user = {
      username: null,
      password: null
    }
    $scope.register = function () {
      $scope.errorMessage = null;
      var user = new Parse.User();
      user.set($scope.user)

      user.signUp(null, {
        success: function(user) {
          $uibModalInstance.close(user);
        },
        error: function(user, error) {
          $scope.errorMessage = error;
          // The login failed. Check error to see why.
        }
      });
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
      });
    };

    $scope.invalid = function () {
      return (!$scope.user.username || !$scope.user.password);
    }

    $scope.cancel = function () {
      $uibModalInstance.close(null);
    };
  })
