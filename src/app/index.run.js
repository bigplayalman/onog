(function() {
  'use strict';

  angular
    .module('tournament')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
