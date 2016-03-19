(function(angular) {
  "use strict";

  angular.module('ps.widgets')
    .controller("BrowserAppCtrl", BrowserAppCtrl)
    .directive('psBrowserApps', BrowserAppsDirective);

  function BrowserAppCtrl(appService, layoutService, urlService) {
    var vm = this;
    vm.clickCB = clickCB;
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

    function clickCB(e, url) {
      if (!/(http:\/\/|https:\/\/|ftp:\/\/)/.test(url)) {
        if ((e.which === 1 && e.ctrlKey === true) || (e.which === 2)) {
          urlService.openInNewTab(url);
        } else if (e.which === 1 && e.ctrlKey === false) {
          urlService.openInThisTab(url);
        }
        e.preventDefault();
      }
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
