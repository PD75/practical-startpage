(function(angular) {
  "use strict";

  angular.module('ps.widgets')
    .controller("BrowserAppCtrl", BrowserAppCtrl)
    .directive('psBrowserApps', BrowserAppsDirective);

  function BrowserAppCtrl(appService) {
    var vm = this;
    vm.loading = true;
    vm.getApps = getApps;

    vm.getApps();

    function getApps() {
      appService.appList()
        .then(function(appList) {
          vm.list = appList;
          vm.loading = false;
        });
    }
  }

  function BrowserAppsDirective() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/widgetUrlList.html',
      controller: 'BrowserAppCtrl',
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
        if (ctrl.col.activeTab === ctrl.tab.label) {
          ctrl.getApps();
        }
      });
    }
  }
})(angular);
