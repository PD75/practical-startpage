(function(angular) {
  "use strict";

  angular.module('ps.widgets')
    .controller("BrowserAppCtrl", BrowserAppCtrl)
    .directive('psBrowserApps', BrowserAppsDirective);

  function BrowserAppCtrl(appService, layoutService) {
    var vm = this;
    activate();

    function activate() {
      if (layoutService.isActive('chromeApps')) {
        getApps();
      }
      layoutService.setOnTabClick('chromeApps', getApps);
    }

    function getApps() {
      appService.appList()
        .then(function(appList) {
          vm.list = appList;
        });
    }
  }

  function BrowserAppsDirective() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/widgets/widgetUrlList.html',
      controller: 'BrowserAppCtrl',
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
