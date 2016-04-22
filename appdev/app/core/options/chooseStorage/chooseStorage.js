(function(angular) {
  'use strict';

  angular.module('ps.core.options')
    .controller('ChooseStorageCtrl', ChooseStorageCtrl)
    .directive('psChooseStorage', ChooseStorageDirective);


  function ChooseStorageCtrl($timeout, dataService, i18n) {
    var vm = this;
    vm.switchStorage = switchStorage;


    vm.locale = locale;
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
          var localStorage = dataService.data.localStorage;
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
                title: value.title,
                order: value.order,
                local: {},
                sync: {},
              };
              if (angular.isDefined(value.local)) {
                vm.data[i].local.exist = true;
              }

              if (angular.isDefined(value.sync)) {
                vm.data[i].sync.exist = true;
              }
              if (angular.isDefined(localStorage) && localStorage[key]) {
                vm.data[i].local.storage = true;
              } else {
                vm.data[i].local.storage = false;
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

    function locale(text) {
      return i18n.get(text);
    }

    function switchStorage(object, copyData) {
      var data = {
        label: object.label,
        localStorage: object.local.storage,
        copyData: copyData,
      };
      dataService.setStorage(data);
    }
  }

  function ChooseStorageDirective() {
    return {
      restrict: 'E',
      templateUrl: 'app/core/options/ChooseStorage/ChooseStorage.html',
      controller: 'ChooseStorageCtrl',
      controllerAs: 'vm',
      bindToController: true,
      scope: {},
    };
  }

})(angular);
