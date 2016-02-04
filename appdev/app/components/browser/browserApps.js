(function(angular) {
  "use strict";

  angular.module('PracticalStartpage')
    .controller("BrowserAppCtrl", BrowserAppCtrl)
    .directive('psBrowserApps', BrowserAppsDirective);

  function BrowserAppCtrl(appService) {
    var vm = this;
    vm.loading = true;

    vm.getApps = function() {
      appService.appList()
        .then(function(appList) {
          vm.list = appList;
          vm.loading = false;
        });
    };

    vm.getApps();
  }

  function BrowserAppsDirective() {
    return {
      restrict: 'E',
      templateUrl: 'app/shared/widgetUrlList.html',
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
        return ctrl.col.tabRefreshed;
      }, function(n, o) {
        if (ctrl.col.activeTab === 'Apps') {
          ctrl.getApps();
        }
      });
    }
  }
})(angular);
