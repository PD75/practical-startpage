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
    activate();

    function activate() {
      var widgets = dataService.data.widgets;
      var layout = dataService.data.layout;
      var c = 0,
        t = 0,
        tab = {};
      for (c = 0; c < layout.length; c++) {
        vm.columns[c] = {
          title: layout[c].title,
          items: layout[c].items,
          tabs: [],
        };
        for (t = 0; t < layout[c].tabs.length; t++) {
          tab = layout[c].tabs[t];
          vm.columns[c].tabs[t] = widgets[tab];
        }
      }
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
