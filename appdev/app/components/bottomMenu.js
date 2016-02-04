(function() {
  'use strict';

  angular.module('PracticalStartpage')
    .controller('BottomMenuCtrl', BottomMenuCtrl)
    .directive('psBottomMenu', bottomMenuDirective);

  function BottomMenuCtrl() {
    var vm = this;
    vm.activateModal = activateModal;
    vm.showModal = false;

    vm.bottomMenu = [{
      "title": "options",
      "icon": "options",
      "url": "app/components/options/optionsModal.html",
    }, {
      "title": "help",
      "icon": "help",
      "url": "app/components/help.html",
    }, {
      "title": "about",
      "icon": "info",
      "url": "app/components/about.html",
    }, {
      "title": "revision",
      "icon": "code",
      "url": "app/components/revision.html",
    }];

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
