(function() {
  'use strict';

  angular.module('ps.core.options')
    .controller('SelectBadgesCtrl', SelectBadgesCtrl)
    .directive('psSelectBadges', SelectBadgesDirective);

  function SelectBadgesCtrl(dataService, i18n, badgeConstants) {
    var vm = this;
    vm.badgeLayout = [];
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

    function activate(badgeLayout) {
      var badgeLayout = [];
      if (angular.isDefined(dataService.data.badgeLayout)) {
        badgeLayout = angular.copy(dataService.data.badgeLayout);
      }
      getData(badgeLayout);
    }

    function clear(badgeLayout) {
      var badgeLayout = [];
      getData(badgeLayout);
    }

    function getData(badgeLayout) {
      vm.badgeLayout = [];
      var badges = angular.copy(badgeConstants.badges);
      for (var m = 0; m < badgeLayout.length; m++) {
        vm.badgeLayout[m] = badges[badgeLayout[m]];
        vm.badgeLayout[m].label = badgeLayout[m];
        badges[badgeLayout[m]].used = true;
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
      var badgeLayout = [];
      for (var m = 0; m < vm.badgeLayout.length; m++) {
        badgeLayout[m] = vm.badgeLayout[m].label;
      }
      dataService.setData({
        badgeLayout: badgeLayout,
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
