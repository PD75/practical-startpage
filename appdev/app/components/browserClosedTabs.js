(function(angular) {
  "use strict";

  angular.module('PracticalStartpage')
    .controller("BrowserClosedCtrl", BrowserClosedCtrl)
    .directive('psBrowserClosedTabs', BrowserClosedTabsDirective);

  function BrowserClosedCtrl(closedTabsService) {
    var vm = this;
    vm.loading = true;
    vm.getClosed = getClosed;
    vm.callbackSet = false;
    activate();

    function getClosed() {
      var promise = closedTabsService.closedTabsList();
      promise.then(function(closedTabsList) {
        vm.list = closedTabsList;
        vm.loading = false;
      });
    }

    function activate() {
      closedTabsService.monitorClosedTabs(getClosed);
    }
  }

  function BrowserClosedTabsDirective() {
    return {
      restrict: 'E',
      templateUrl: 'app/shared/widgetUrlList.html',
      controller: 'BrowserClosedCtrl',
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
        return ctrl.col.tabRefreshed;
      }, function(n, o) {
        if (ctrl.col.activeTab === 'Closed') {
          ctrl.getClosed();
        }
      });
    }
  }
})(angular);
