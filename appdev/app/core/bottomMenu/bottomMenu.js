(function() {
  'use strict';

  angular.module('ps.core')
    .controller('BottomMenuCtrl', BottomMenuCtrl)
    .directive('psBottomMenu', bottomMenuDirective);

  function BottomMenuCtrl(i18n) {
    var vm = this;
    vm.activateModal = activateModal;
    vm.showModal = false;

    vm.bottomMenu = [{
      "title": i18n.get("Options"),
      "icon": "options",
      "url": "app/core/options/optionsModal.html",
    }, {
      "title": i18n.get("Help"),
      "icon": "help",
      "url": "app/core/bottomMenu/help.html",
    }, {
      "title": i18n.get("About"),
      "icon": "info",
      "url": "app/core/bottomMenu/about.html",
    }, {
      "title": i18n.get("WhatsNew"),
      "icon": "announcement",
      "url": "app/core/bottomMenu/whatsNew.html",
    }];

    function activateModal(menuItem) {
      vm.modalUrl = menuItem.url;
      vm.showModal = true;
      vm.modalTitle = menuItem.title;
    }

  }

  function bottomMenuDirective() {
    return {
      restrict: 'E',
      controller: 'BottomMenuCtrl',
      controllerAs: 'vm',
      templateUrl: 'app/core/bottomMenu/bottomMenu.html',
    };
  }
})();
