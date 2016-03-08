(function(angular) {
  'use strict';

  angular.module('ps.core.options')
    .controller('EditBadgesCtrl', EditBadgesCtrl)
    .directive('psEditBadges', psEditBadges);

  function EditBadgesCtrl(dataService, i18n, badgeConstants) {
    var vm = this;
    vm.bottomMenu = [];
    vm.getData = getData;
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

    getData();

    function getData() {
      vm.bottomMenu = [];
      var bottomMenu = [];
      if (angular.isDefined(dataService.data.bottomMenu)) {
        bottomMenu = angular.copy(dataService.data.bottomMenu);
      }
      var badges = badgeConstants.badges;
      for (var m = 0; m < bottomMenu.length; m++) {
        vm.bottomMenu[m] = badges[bottomMenu[m]];
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
      var layout = [],
        activeTabs = [],
        c = 0,
        t = 0;
      for (c = 0; c < vm.columns.length; c++) {
        layout[c] = {
          title: vm.columns[c].title,
          items: vm.columns[c].items,
          label: vm.columns[c].label,
          tabs: [],
        };
        activeTabs[c] = vm.columns[c].tabs[0].label;
        for (t = 0; t < vm.columns[c].tabs.length; t++) {
          layout[c].tabs[t] = vm.columns[c].tabs[t].label;
        }
      }
      dataService.setData({
        layout: layout,
        activeTabs: activeTabs,
      });
    }


    function locale(text) {
      return i18n.get(text);
    }
  }

  function psEditBadges() {
    return {
      restrict: 'E',
      templateUrl: 'app/core/options/editBadges/editBadges.html',
      controller: 'EditBadgesCtrl',
      controllerAs: 'vm',
      scope: {},
    };
  }
})(angular);
