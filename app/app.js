var onog = angular.module('onog', ['ngParse', 'ui.bootstrap', 'ui.router', 'onog.routes', 'onog.controllers', 'onog.services', 'onog.directives']);

onog.config(['ParseProvider', function(ParseProvider) {
  ParseProvider.initialize('nYsB6tmBMYKYMzM5iV9BUcBvHWX89ItPX5GfbN6Q', 'zrin8GEBDVGbkl1ioGEwnHuP70FdG6HhzTS8uGjz');
}]);