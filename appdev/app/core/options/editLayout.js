(function(angular) {
  'use strict';

  angular.module('ps.core')
    .controller('EditLayoutCtrl', EditLayoutCtrl)
    .directive('psEditLayout', EditLayoutDirective);

  function EditLayoutCtrl(dataService) {
    var vm = this;
    vm.columns = [];
    vm.checkDisabledCol = checkDisabledCol;
    vm.checkDisabledTab = checkDisabledTab;
    vm.getData = getData;
    vm.saveData = saveData;
    vm.getDefaults = getDefaults;
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
      var widgets = dataService.data.widgets;
      var layout = dataService.data.layout;
      var c = 0,
        t = 0,
        tab = {};
      for (c = 0; c < layout.length; c++) {
        vm.columns[c] = {
          title: layout[c].title,
          items: layout[c].items,
          label: layout[c].label,
          tabs: [],
        };
        for (t = 0; t < layout[c].tabs.length; t++) {
          tab = layout[c].tabs[t];
          vm.columns[c].tabs[t] = widgets[tab];
          vm.columns[c].tabs[t].label = tab;
          widgets[tab].used = true;
        }
      }
      vm.widgets = [];
      var w = 0;
      angular.forEach(widgets, function(widget, key) {
        if (angular.isUndefined(widget.used) || !widget.used) {
          vm.widgets[w] = widget;
          vm.widgets[w].label = key;
          w++;
        }
      });
    }

    function getDefaults() {
      dataService.data.layout = dataService.getDefaultLayout();
      getData();
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

    function checkDisabledCol(col) {
      var disabled = false;
      if (col.tabs.length === col.items) {
        disabled = true;
        for (var t = 0; t < col.tabs.length; t++) {
          if (angular.isDefined(col.tabs[t].drag) && col.tabs[t].drag) {
            disabled = false;
          }
        }
      }
      return disabled;
    }

    function checkDisabledTab(col) {
      return (col.tabs.length === 1);
    }
  }

  function EditLayoutDirective() {
    return {
      restrict: 'E',
      templateUrl: 'app/core/options/editLayout.html',
      controller: 'EditLayoutCtrl',
      controllerAs: 'vm',
      scope: {},
    };
  }
})(angular);
