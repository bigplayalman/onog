var Directives = angular.module('synergyApp.directives', []);

Directives.directive('synergyEmployee', [function() {
    return {
      restrict: 'A',
      controller: 'synergyEmployee',
      templateUrl: 'pages/synergyEmployee.html'
    };
  }])
  .controller('synergyEmployee', ['$scope', 'Parse',
    function($scope, Parse) {
      $scope.picture = null;
      $scope.name = null;
      if($scope.model) {
        $scope.picture = $scope.model.get('picture').url();
        $scope.name = $scope.model.get('name');
      }
      $scope.removeUser = function (user) {
        "use strict";
        user.destroy({
          success: function (user) {
            $scope.collection.splice(user, 1);
          }
        })
      }
    }])
  .directive('appMenu', [function() {
    return {
      restrict: 'A',
      controller: 'appMenu',
      templateUrl: 'component/menu.html'
    };
  }])
  .controller('appMenu', ['$scope',
    function($scope) {
      $scope.isCollapsed = true;
      $scope.appName = 'Synergy App';
      $scope.menuItems = [
        {
          name: 'Home',
          icon: 'fa-tachometer',
          link: '#/'
        },
        {
          name: 'Add Employee',
          icon: 'fa-user-plus',
          link: '#add-employee'
        },
        {
          name: 'Logout',
          icon: 'fa-sign-out',
          link: '#login'
        },
      ]
    }]);