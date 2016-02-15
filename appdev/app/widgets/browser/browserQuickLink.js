(function(angular) {
  "use strict";

  angular.module('ps.widgets')
    .controller("quicklLinksCtrl", quicklLinksCtrl)
    .directive('psBrowserQuicklinks', BrowserQuicklinksDirective);

  function quicklLinksCtrl(quickLinksService, dataService, layoutService) {
    var vm = this;
    vm.list = [];
    activate();

    function activate() {
      getQuicklinks();
      dataService.setOnChangeData('quicklinks', getQuicklinks);
      layoutService.setOnTabClick('quicklinks', getQuicklinks);
    }

    function getQuicklinks() {
      if (angular.isUndefined(dataService.data.quicklinks)) {
        dataService.data.quicklinks = [0];
      }
      quickLinksService.quickLinksList(dataService.data.quicklinks[0])
        .then(function(quickLinksList) {
          vm.list = quickLinksList;
        });
    }
  }

  function BrowserQuicklinksDirective() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/widgets/widgetUrlList.html',
      controller: 'quicklLinksCtrl',
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
