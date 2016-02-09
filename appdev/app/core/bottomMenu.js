(function() {
  'use strict';

  angular.module('ps.core')
    .controller('BottomMenuCtrl', BottomMenuCtrl)
    .directive('psBottomMenu', bottomMenuDirective);

  function BottomMenuCtrl() {
    var vm = this;
    vm.activateModal = activateModal;
    vm.showModal = false;

    vm.bottomMenu = [{
      "title": "options",
      "icon": "options",
      "url": "app/core/options/optionsModal.html",
    }, {
      "title": "help",
      "icon": "help",
      "url": "app/core/help.html",
    }, {
      "title": "about",
      "icon": "info",
      "url": "app/core/about.html",
    }, {
      "title": "revision",
      "icon": "code",
      "url": "app/core/revision.html",
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
      templateUrl: 'app/core/bottomMenu.html',
    };
  }
})();
