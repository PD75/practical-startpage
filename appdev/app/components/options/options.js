(function(angular) {
  'use strict';

  angular.module('PracticalStartpage.options', ['chromeModule'])
    .controller('OptionsCtrl', OptionsCtrl)
    .directive('psOptions', optionsDirective);


  function OptionsCtrl($timeout, storageService) {
    var vm = this;
    vm.tab = 3;
    vm.setTab = setTab;
    vm.clearData = clearData;

    function setTab(tab) {
      vm.tab = tab;
    }

    function clearData() {
      storageService.clearData()
        .then(function() {
          vm.dataCleared = 'Cleared!!!';
          $timeout(function() {
            vm.dataCleared = '';
          }, 3000);
        });
    }
  }

  function optionsDirective() {
    return {
      restrict: 'E',
      templateUrl: 'app/components/options/options.html',
      controller: 'OptionsCtrl',
      controllerAs: 'vm',
    };
  }

})(angular);
