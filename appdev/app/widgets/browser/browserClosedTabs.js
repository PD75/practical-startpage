(function(angular) {
  "use strict";

  angular.module('ps.widgets')
    .controller("BrowserClosedCtrl", BrowserClosedCtrl)
    .directive('psBrowserClosedTabs', BrowserClosedTabsDirective);

  function BrowserClosedCtrl(closedTabsService, layoutService) {
    var vm = this;
    vm.loading = true;
    vm.callbackSet = false;
    activate();

    function activate() {
      if (layoutService.isActive('closedTabs')) {
        getClosed();
      }
      closedTabsService.monitorClosedTabs(getClosed);
      layoutService.setOnTabClick('closedTabs', getClosed);
    }

    function getClosed() {
      var promise = closedTabsService.closedTabsList();
      promise.then(function(closedTabsList) {
        vm.list = closedTabsList;
        vm.loading = false;
      });
    }
  }

  function BrowserClosedTabsDirective() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/widgets/widgetUrlList.html',
      controller: 'BrowserClosedCtrl',
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
