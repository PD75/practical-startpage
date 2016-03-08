/// <reference path="../../services/chrome/chrome.i18n.service.js" />

(function() {
  'use strict';

  angular
    .module('ps.core')
    .controller('BottomMenuCtrl', BottomMenuCtrl)
    .directive('psBottomMenu', bottomMenuDirective);

  function BottomMenuCtrl($http, dataService, badgeConstants, i18n) {
    var vm = this;
    vm.activateModal = activateModal;
    vm.showModal = false;

    vm.bottomSubMenu = [{
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
    activate();

    function activate() {
      var badges = badgeConstants.badges;
      var bottomMenu = [];
      vm.bottomMenu = [];
      if (angular.isDefined(dataService.data.bottomMenu)) {
        bottomMenu = angular.copy(dataService.data.bottomMenu);
      }
      for (var b = 0; b < bottomMenu.length; b++) {
        vm.bottomMenu[b] = badges[bottomMenu[b]];
      }
    }

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
      bindToController: true,
      link: link,
    };
    function link(scope, el, attr) {
      var bottomMenu = scope.vm.bottomMenu;
      var directive = '';
      for (var b = 0; b < bottomMenu.length; b++) {
        var element = bottomMenu[b].directive;
        directive = '<psb-' + element + '></psb-' + element + '>';
        var q = 12;
      }
    }
  }
})();
