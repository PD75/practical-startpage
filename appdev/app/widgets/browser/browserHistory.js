(function(angular) {
  "use strict";

  angular.module('ps.widgets')
    .controller("BrowserHistoryCtrl", BrowserHistoryCtrl)
    .directive('psBrowserHistory', BrowserHistoryDirective);

  function BrowserHistoryCtrl(historyService, layoutService) {
    var vm = this;
    activate();

    function activate() {
      if (layoutService.isActive('history')) {
        getHistory();
      }
      layoutService.setOnTabClick('history', getHistory);
    }

    function getHistory(historyParam) {
      if (!historyParam) {
        historyParam = {
          searchText: '',
          startDate: 0,
        };
      }
      var promise = historyService.historyList(historyParam);
      promise.then(function(historyList) {
        vm.list = historyList;
      });
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
