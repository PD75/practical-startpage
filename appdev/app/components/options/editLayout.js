(function(angular) {
  'use strict';

  angular.module('PracticalStartpage')
    .controller('EditLayoutCtrl', EditLayoutCtrl)
    .directive('psEditLayout', EditLayoutDirective);

  function EditLayoutCtrl($scope, $timeout, dataService) {
    var vm = this;
    vm.columns = [];
    vm.checkDisabledCol = checkDisabledCol;
    vm.checkDisabledTab = checkDisabledTab;
    vm.setData = setData;
    vm.saveData = saveData;
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
      priButton: [
        dataService.data.styles.primaryCol,
      ],
      secButton: [
        dataService.data.styles.secondaryCol,
      ],

    };
    setData();

    function setData() {
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
          widgets[tab].used = true;
        }
      }
      vm.widgets = [];
      var w = 0;
      angular.forEach(widgets, function(widget, key) {
        if (angular.isUndefined(widget.used) || !widget.used) {
          vm.widgets[w] = widget;
          w++;
        }
      });
    }

    function saveData() {
      var layout = [],
        c = 0,
        t = 0;
      for (c = 0; c < vm.columns.length; c++) {
        layout[c] = {
          title: vm.columns[c].title,
          items: vm.columns[c].items,
          label: vm.columns[c].label,
          tabs: [],
        };
        for (t = 0; t < vm.columns[c].tabs.length; t++) {
          layout[c].tabs[t] = vm.columns[c].tabs[t].label;
        }
      }
      dataService.setData({
        layout: layout,
      });
    }

    function checkDisabledCol(col) {
      return (col.tabs.length === col.items);
    }

    function checkDisabledTab(col) {
      return (col.tabs.length === 1);
    }
  }

  function EditLayoutDirective() {
    return {
      restrict: 'E',
      templateUrl: 'app/components/options/editLayout.html',
      controller: 'EditLayoutCtrl',
      controllerAs: 'vm',
      scope: {},
    };
  }
})(angular);
