(function(angular) {
  'use strict';

  angular.module('ps.core.options')
    .controller('ClearDataCtrl', ClearDataCtrl)
    .directive('psClearData', ClearDataDirective);


  function ClearDataCtrl($timeout, dataService) {
    var vm = this;
    vm.checkboxCB = checkboxCB;
    vm.allselectedCB = allselectedCB;
    vm.widgets = dataService.data.widgets;
    vm.clearData = clearData;
    vm.buttonDisabled = true;
    vm.primaryCol = dataService.data.styles.primaryCol;
    getData();

    function getData() {
      dataService.getStorageData()
        .then(function(data) {
          vm.data = [];
          vm.allSelected = false;
          var i = 0;
          angular.forEach(data, function(value, key) {
            switch (key) {
              case 'version':
                vm.data[i] = {
                  label: key,
                  title: 'Version Check',
                  order: 0,
                  selected: false,
                };
                i++;
                break;
              case 'activeTabs':
                vm.data[i] = {
                  label: key,
                  title: 'Active Tabs',
                  order: 1,
                  selected: false,
                };
                i++;
                break;
              case 'layout':
                vm.data[i] = {
                  label: key,
                  title: 'Widget Layout',
                  order: 2,
                  selected: false,
                };
                i++;
                break;
              case 'styles':
                vm.data[i] = {
                  label: key,
                  title: 'Styles, colors',
                  order: 3,
                  selected: false,
                };
                i++;
                break;
              default:
                vm.data[i] = {
                  label: key,
                  title: vm.widgets[key].title,
                  order: 10 + i,
                  selected: false,
                };
                i++;
            }
          });
        });
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
      var keys;
      if (!vm.allSelected) {
        keys = [];
        for (var i = 0; i < vm.data.length; i++) {
          if (vm.data[i].selected) {
            keys.push(vm.data[i].label);
          }
        }
      }
      if (angular.isUndefined(keys) || keys.length > 0) {
        dataService.clearData(keys)
          .then(function() {
            vm.buttonDisabled = true;
            vm.dataCleared = 'Cleared!!!';
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
      templateUrl: 'app/core/options/clearData.html',
      controller: 'ClearDataCtrl',
      controllerAs: 'vm',
      bindToController: true,
      scope: {},
    };
  }

})(angular);
