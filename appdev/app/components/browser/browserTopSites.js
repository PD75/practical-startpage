(function(angular) {
  "use strict";

  angular.module('PracticalStartpage')
    .controller("BrowserTopSitesCtrl", BrowserTopSitesCtrl)
    .directive('psBrowserTopSites', psBrowserTopSites);

  function BrowserTopSitesCtrl(topSitesService) {
    var vm = this;
    vm.loading = true;
    vm.getTopSites = getTopSites;

    vm.getTopSites();

    function getTopSites() {
      var promise = topSitesService.topSitesList();
      promise.then(function(topSitesList) {
        vm.list = topSitesList;
        vm.loading = false;
      });
    }
  }

  function psBrowserTopSites() {
    return {
      restrict: 'E',
      templateUrl: 'app/shared/widgetUrlList.html',
      controller: 'BrowserTopSitesCtrl',
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
          ctrl.getTopSites();
        }
      });
    }
  }
})(angular);
