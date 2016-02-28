(function(angular) {
  "use strict";

  angular.module('ps.widgets')
    .controller("BrowserHistoryCtrl", BrowserHistoryCtrl)
    .directive('psBrowserHistory', BrowserHistoryDirective);

  function BrowserHistoryCtrl(historyService, layoutService) {
    var vm = this;
    vm.searchCB = getHistory;
    vm.searchString = '';
    vm.historyParam = {
      startDate: 0,
    };
    activate();

    function activate() {
      vm.searchable = true;
      if (layoutService.isActive('history')) {
        getHistory();
      }
      layoutService.setOnTabClick('history', getHistory);
    }

    function getHistory() {
      if (vm.searchString.length === 0 || vm.searchString.length > 2) {
        vm.historyParam.searchText = vm.searchString;
        var promise = historyService.historyList(vm.historyParam);
        promise.then(function(historyList) {
          vm.list = historyList;
        });
      }
    }
  }

  function BrowserHistoryDirective() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/widgets/widgetUrlList.html',
      controller: 'BrowserHistoryCtrl',
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
