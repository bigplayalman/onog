var onog = angular.module('onog', ['ngParse', 'ui.bootstrap', 'ui.router', 'onog.routes', 'onog.controllers', 'onog.services', 'onog.directives']);

onog.config(['ParseProvider', function(ParseProvider) {
  ParseProvider.initialize('SbLlzPb3iyTBJTah7MjI4ypRm5wVFHQ8m8sdaQ3y', 'ZUKUhCdNlL8EL3N2FcYo6fEgoyHcTwyCE7ve45RG');
}]);