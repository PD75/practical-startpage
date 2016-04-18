(function(angular) {
  'use strict';

  angular.module('ps.core.options.clear', ['ps.core.service'])
    .controller('ClearDataCtrl', ClearDataCtrl)
    .directive('psClearData', ClearDataDirective);


  function ClearDataCtrl($timeout, dataService, i18n) {
    var vm = this;
    vm.checkboxCB = checkboxCB;
    vm.allselectedCB = allselectedCB;
    vm.widgets = dataService.data.widgets;
    vm.clearData = clearData;
    vm.locale = locale;
    vm.buttonDisabled = true;
    vm.primaryCol = dataService.data.styles.primaryCol;
    getData();

    function getData() {
      dataService.getStorageData()
        .then(function(data) {
          // var data = storageData[1];
          vm.data = [];
          vm.allSelected = false;
          var i = 0;
          angular.forEach(data, function(value, key) {
            if (angular.isDefined(value.title)) {
              vm.data[i] = {
                label: key,
                selected: false,
                title: value.title,
                order: value.order,
              };
              if (angular.isDefined(value.local)) {
                vm.data[i].local = {
                  defined: true,
                  selected: false,
                };
              }
              if (angular.isDefined(value.sync)) {
                vm.data[i].sync = {
                  defined: true,
                  selected: false,
                };
              }
              i++;
            }
          });
        });
    }

    function locale(text) {
      return i18n.get(text);
    }

    function checkboxCB() {
      vm.allSelected = true;
      vm.buttonDisabled = true;
      for (var i = 0; i < vm.data.length; i++) {
        if (!vm.data[i].selected) {
          vm.allSelected = false;
        } else {
          vm.buttonDisabled = false;
        }
      }
    }

    function allselectedCB() {
      var s = vm.allSelected;
      vm.buttonDisabled = !vm.allSelected;
      for (var i = 0; i < vm.data.length; i++) {
        vm.data[i].selected = s;
      }
    }

    function clearData() {
      var keys = [];
      for (var i = 0; i < vm.data.length; i++) {
        if (vm.data[i].selected) {
          keys.push(vm.data[i].label);
        }
      }
      if (keys.length > 0) {
        dataService.clearData(keys)
          .then(function() {
            vm.buttonDisabled = true;
            vm.dataCleared = i18n.get('c_o_cleared');
            $timeout(function() {
              vm.dataCleared = '';
              getData();
            }, 1000);
          });
      }
    }
  }

  function ClearDataDirective() {
    return {
      restrict: 'E',
      templateUrl: 'app/core/options/clearData/clearData.html',
      controller: 'ClearDataCtrl',
      controllerAs: 'vm',
      bindToController: true,
      scope: {},
    };
  }

})(angular);
