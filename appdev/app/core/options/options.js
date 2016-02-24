(function(angular) {
  'use strict';

  angular.module('ps.core.options')
    .controller('OptionsCtrl', OptionsCtrl)
    .directive('psOptions', optionsDirective);

  function OptionsCtrl($timeout, dataService) {
    var vm = this;
    vm.tab = 1;

    activate();

    function activate() {
      vm.primaryCol = dataService.data.styles.primaryCol;
      $timeout(function() {
        vm.modal.modal('refresh');
      });
    }
  }

  function optionsDirective() {
    return {
      restrict: 'E',
      templateUrl: 'app/core/options/options.html',
      controller: 'OptionsCtrl',
      controllerAs: 'vm',
      bindToController: true,
      scope: {
        modal: "=psModal",
      },
    };
  }

})(angular);
