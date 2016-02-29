(function(angular) {
  "use strict";

  angular.module('ps.widgets')
    .controller("EditHistoryCtrl", EditHistoryCtrl)
    .directive('psEditHistory', EditHistoryDirective);

  function EditHistoryCtrl($timeout, historyService, dataService, i18n) {
    var vm = this;
    vm.locale = locale;
    vm.save = save;
    vm.selected = selected;
    vm.dataValid = dataValid;
    vm.input = {
      useMax: false,
      max: 100,
      useDays: false,
      days: 100,
      showDelete: false,
      listType: 'BL',
    };
    activate();
    // $timeout(function() {
    //   vm.dropdown.dropdown();
    // });
    function activate() {
      var history = dataService.data.history;
      if (angular.isDefined(history)) {
        vm.input.listType = history.listType;
        vm.input.showDelete = history.showDelete;
        if (angular.isDefined(history.max)) {
          vm.input.max = history.max;
          vm.input.useMax = true;
        }
        if (angular.isDefined(history.days)) {
          vm.input.days = history.days;
          vm.input.useDays = true;
        }
      }
    }

    function save() {
      var history = {};
      history.listType = vm.input.listType;
      history.showDelete = vm.input.showDelete;
      if (vm.input.useMax) {
        history.max = vm.input.max;
      }
      if (vm.input.useDays) {
        history.days = vm.input.days;
      }
      dataService.setData({
        history: history,
      });
    }

    function selected(listType) {
      vm.input.listType = listType;
    }

    function dataValid() {
      var valid = true;
      if (vm.input.useMax && (!Number.isInteger(vm.input.max) || vm.input.max < 0)) {
        valid = false;
      }
      if (vm.input.useDays && (!Number.isInteger(vm.input.days) || vm.input.days < 0)) {
        valid = false;
      }
      if (!vm.input.useDays && !vm.input.useMax && vm.input.listType === 'BL' && angular.isUndefined(dataService.data.history)) {
        valid = false;
      }
      return valid;
    }

    function locale(text, placeholders) {
      return i18n.get(text, placeholders);
    }
  }

  function EditHistoryDirective() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/browser/history/editHistory.html',
      controller: 'EditHistoryCtrl',
      controllerAs: 'vm',
      scope: {
        tab: '=psTab',
        col: '=psCol',
        style: '=psStyle',
      },
      bindToController: true,
    };
  }
})(angular);
