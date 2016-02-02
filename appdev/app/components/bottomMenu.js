(function() {
  'use strict';

  angular.module('PracticalStartpage')
    .controller('BottomMenuCtrl', BottomMenuCtrl)
    .directive('psBottomMenu', bottomMenuDirective);

  function BottomMenuCtrl() {
    var vm = this;
    vm.activateModal = activateModal;
    vm.showModal = false;

    vm.modalUrl = 'app/components/help.html';

    function activateModal(menuItem) {
      vm.modalUrl = menuItem.url;
      vm.showModal = true;
    }
  }

  function bottomMenuDirective() {
    return {
      restrict: 'E',
      controller: 'BottomMenuCtrl',
      controllerAs: 'vm',
      templateUrl: 'app/components/bottomMenu.html',
    };
  }
})();
