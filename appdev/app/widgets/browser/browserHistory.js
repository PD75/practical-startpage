(function(angular) {
  "use strict";

  angular.module('ps.widgets')
    .controller("BrowserHistoryCtrl", BrowserHistoryCtrl)
    .directive('psBrowserHistory', BrowserHistoryDirective);

  function BrowserHistoryCtrl(historyService) {
    var vm = this;
    vm.getHistory = getHistory;
    // Initialize
    vm.getHistory();

    function getHistory(historyParam) {
      if (!historyParam) {
        historyParam = {
          searchText: '',
          startDate: 0,
          maxResults: 200,
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
      templateUrl: 'app/widgets/widgetUrlList.html',
      controller: 'BrowserHistoryCtrl',
      controllerAs: 'vm',
      scope: {
        tab: '=psTab',
        col: '=psCol',
        style: '=psStyle',
      },
      bindToController: true,
      link: link,
    };

    function link(scope, el, attr, ctrl) {
      scope.$watch(function() {
        return ctrl.col.refreshed;
      }, function(n, o) {
        if (ctrl.tab.active) {
          ctrl.getHistory();
        }
      });
    }
  }
})(angular);
