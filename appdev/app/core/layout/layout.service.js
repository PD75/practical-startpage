(function(angular) {
  'use strict';

  angular.module('ps.core')
    .service('layoutService', layoutService);

  function layoutService(dataService) {
    var s = this;
    s.tabCB = {};
    s.setOnTabClick = setOnTabClick;
    s.runOnTabClick = runOnTabClick;
    s.isActive = isActive;

    function isActive(tab) {
      var activeTabs = dataService.data.activeTabs;
      var isActive = false;
      for (var t = 0; t < activeTabs.length; t++) {
        if (tab === activeTabs[t]) {
          isActive = true;
        }
      }
      return isActive;
    }

    function setOnTabClick(key, fnCB) {
      if (angular.isUndefined(s.tabCB[key])) {
        s.tabCB[key] = [];
      }
      s.tabCB[key].push(fnCB);
    }

    function runOnTabClick(tab) {
      if (angular.isDefined(s.tabCB) && angular.isDefined(s.tabCB[tab])) {
        for (var f = 0; f < s.tabCB[tab].length; f++) {
          s.tabCB[tab][f]();
        }
      }
    }
  }
})(angular);
