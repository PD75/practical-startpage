(function(angular) {
  "use strict";

  angular.module('ps.widgets')
    .controller("BrowserTopSitesCtrl", BrowserTopSitesCtrl)
    .directive('psBrowserTopSites', psBrowserTopSites);

  function BrowserTopSitesCtrl(topSitesService, layoutService) {
    var vm = this;
    activate();

    function activate() {
      if (layoutService.isActive('topSites')) {
        getTopSites();
      }
      layoutService.setOnTabClick('topSites', getTopSites);
    }

    function getTopSites() {
      var promise = topSitesService.topSitesList();
      promise.then(function(topSitesList) {
        vm.list = topSitesList;
      });
    }
  }

  function psBrowserTopSites() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/widgets/widgetUrlList.html',
      controller: 'BrowserTopSitesCtrl',
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
