(function() {
  'use strict';

  angular.module('ps.core.options')
    .controller('SelectBadgesCtrl', SelectBadgesCtrl)
    .directive('psSelectBadges', SelectBadgesDirective);

  function SelectBadgesCtrl(dataService, i18n, badgeConstants) {
    var vm = this;
    vm.bottomMenu = [];
    vm.clear = clear;
    vm.undoAll = activate;
    vm.saveData = saveData;
    vm.locale = locale;
    vm.styles = {
      priMenu: [
        dataService.data.styles.primaryCol, {
          inverted: dataService.data.styles.primaryInv,
        },
      ],
      secMenu: [
        dataService.data.styles.secondaryCol, {
          inverted: dataService.data.styles.secondaryInv,
        },
      ],
      priButton: dataService.data.styles.primaryCol,
      secButton: dataService.data.styles.secondaryCol,
    };

    activate();

    function activate(bottomMenu) {
      var bottomMenu = [];
      if (angular.isDefined(dataService.data.bottomMenu)) {
        bottomMenu = angular.copy(dataService.data.bottomMenu);
      }
      getData(bottomMenu);
    }

    function clear(bottomMenu) {
      var bottomMenu = [];
      getData(bottomMenu);
    }

    function getData(bottomMenu) {
      vm.bottomMenu = [];
      var badges = angular.copy(badgeConstants.badges);
      for (var m = 0; m < bottomMenu.length; m++) {
        vm.bottomMenu[m] = badges[bottomMenu[m]];
        vm.bottomMenu[m].label = bottomMenu[m];
        badges[bottomMenu[m]].used = true;
      }
      var b = 0;
      vm.badges = [];
      angular.forEach(badges, function(badge, key) {
        if (angular.isUndefined(badge.used) || !badge.used) {
          vm.badges[b] = badge;
          vm.badges[b].label = key;
          b++;
        }
      });
    }

    function saveData() {
      var bottomMenu = [];
      for (var m = 0; m < vm.bottomMenu.length; m++) {
        bottomMenu[m] = vm.bottomMenu[m].label;
      }
      dataService.setData({
        bottomMenu: bottomMenu,
      });
    }

    function locale(text) {
      return i18n.get(text);
    }
  }

  function SelectBadgesDirective() {
    return {
      restrict: 'E',
      templateUrl: 'app/core/options/selectBadges/selectBadges.html',
      controller: 'SelectBadgesCtrl',
      controllerAs: 'vm',
      scope: {},
    };
  }
})();
