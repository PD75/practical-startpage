(function(angular) {
  "use strict";

  angular.module('ps.widgets')
    .controller("BrowserHistoryCtrl", BrowserHistoryCtrl)
    .directive('psBrowserHistory', BrowserHistoryDirective);

  function BrowserHistoryCtrl(historyService, dataService, layoutService) {
    var vm = this;
    vm.searchCB = getHistory;
    vm.searchString = '';
    vm.history = {
      searchText: '',
      startDate: 0,
      // maxResults: 2000,
    };
    activate();

    function activate() {
      vm.searchable = true;
      if (layoutService.isActive('history')) {
        getHistory();
      }
      dataService.setOnChangeData('history', getHistory);
      layoutService.setOnTabClick('history', getHistory);
    }

    function setParams() {
      var searchText = vm.history.searchText;
      vm.history = {
        searchText: searchText,
        startDate: 0,
      };
      var history = dataService.data.history;
      if (angular.isDefined(history) && angular.isDefined(history.max)) {
        vm.history.maxResults = history.max;
      }
      if (angular.isDefined(history) && angular.isDefined(history.days)) {
        var x = new Date().getTime() - 1000 * 60 * 60 * 24 * history.days;
        var y = x.toString();
        vm.history.startDate = new Date().getTime() - 1000 * 60 * 60 * 24 * history.days;
      }
    }

    function getHistory() {
      setParams();
      if (vm.searchString.length === 0 || vm.searchString.length > 2 || vm.history.searchText.length > vm.searchString.length) {
        if (vm.history.searchText.length > vm.searchString.length && vm.searchString.length < 3) {
          vm.history.searchText = '';
        } else {
          vm.history.searchText = vm.searchString;
        }
        historyService.historyList(vm.history)
          .then(function(historyList) {
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
