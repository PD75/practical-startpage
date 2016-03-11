/// <reference path="../../services/chrome/chrome.i18n.service.js" />

(function() {
  'use strict';

  angular
    .module('ps.core')
    .controller('BottomMenuCtrl', BottomMenuCtrl)
    .directive('psBottomMenu', bottomMenuDirective);

  function BottomMenuCtrl(i18n) {
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

    function activateModal(menuItem) {
      vm.modalUrl = menuItem.url;
      vm.showModal = true;
      vm.modalTitle = menuItem.title;
    }
  }

  function bottomMenuDirective($compile, dataService, badgeConstants) {
    return {
      restrict: 'E',
      controller: 'BottomMenuCtrl',
      controllerAs: 'vm',
      templateUrl: 'app/core/bottomMenu/bottomMenu.html',
      bindToController: true,
      link: link,
    };
    function link(scope, el) {
      loadBadges(el, scope);
      dataService.setOnChangeData('bottomMenu', function() {
        loadBadges(el, scope);
      });
    }
    function loadBadges(e, s) {
      var badges = badgeConstants.badges;
      var bottomMenu = [];
      var directive = '';
      e.children('.badges').empty();
      if (angular.isDefined(dataService.data.bottomMenu)) {
        bottomMenu = angular.copy(dataService.data.bottomMenu);
      }
      for (var b = 0; b < bottomMenu.length; b++) {
        directive = badges[bottomMenu[b]].directive;
        e.children('.badges').append('<psb-' + directive + '></psb-' + directive + '>');
      }
      $compile(e.children('.badges'))(s);
    }
  }
})();
