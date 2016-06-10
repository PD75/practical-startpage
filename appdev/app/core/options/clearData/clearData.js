(function(angular) {
  'use strict';

  angular.module('ps.core.options.clear', ['ps.core.service'])
    .controller('ClearDataCtrl', ClearDataCtrl)
    .directive('psClearData', ClearDataDirective);

  function ClearDataCtrl($timeout, $q, dataService) {
    var vm = this;
    vm.checkboxCB = checkboxCB;
    vm.allselectedCB = allselectedCB;
    vm.widgets = dataService.data.widgets;
    vm.clearData = clearData;
    vm.primaryCol = dataService.data.styles.primaryCol;
    activate();

    function activate() {
      dataService.setOnChangeData('all', getData);
      getData();
    }

    function getData() {
      dataService.getStorageData()
        .then(function(data) {
          vm.data = [];
          vm.allSelected = false;
          var i = 0;
          vm.local = {
            exist: false,
            allSelected: false,
            buttonDisabled: true,
          };
          vm.sync = {
            exist: false,
            allSelected: false,
            buttonDisabled: true,
          };
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
                  exist: true,
                  selected: false,
                };
                vm.local.exist = true;
              }
              if (angular.isDefined(value.sync)) {
                vm.data[i].sync = {
                  exist: true,
                  selected: false,
                };
                vm.sync.exist = true;
              }
              i++;
            }
          });
          vm.data.sort(function(a, b) {
            var diff = a.order - b.order;
            if (diff === 0) {
              if (a.title < b.title) {
                diff = -1;
              } else {
                diff = 1;

              }
            }
            return diff;
          });
        });
    }

    function checkboxCB(type) {
      vm[type].allSelected = true;
      vm[type].buttonDisabled = true;
      for (var i = 0; i < vm.data.length; i++) {
        if (angular.isDefined(vm.data[i][type]) && !vm.data[i][type].selected) {
          vm[type].allSelected = false;
        } else {
          vm[type].buttonDisabled = false;
        }
      }
    }

    function allselectedCB(type) {
      var s = vm[type].allSelected;
      vm[type].buttonDisabled = !vm[type].allSelected;
      for (var i = 0; i < vm.data.length; i++) {
        if (angular.isDefined(vm.data[i][type])) {
          vm.data[i][type].selected = s;
        }
      }
    }

    function clearData() {
      var keys = {
        local: [],
        sync: [],
      };
      for (var i = 0; i < vm.data.length; i++) {
        if (angular.isDefined(vm.data[i].local) && vm.data[i].local.selected) {
          keys.local.push(vm.data[i].label);
        }
        if (angular.isDefined(vm.data[i].sync) && vm.data[i].sync.selected) {
          keys.sync.push(vm.data[i].label);
        }
      }
      var promises = [];
      promises[0] = dataService.clearData(keys.local, 'local');
      promises[1] = dataService.clearData(keys.sync, 'sync');
      $q.all(promises)
        .then(function() {
          vm.dataCleared ='c_o_cleared';
          $timeout(function() {
            vm.dataCleared = '';
          }, 1000);
        });
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
