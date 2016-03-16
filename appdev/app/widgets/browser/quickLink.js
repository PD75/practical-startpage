(function(angular) {
  "use strict";

  angular.module('ps.widgets')
    .controller("quicklLinksCtrl", quicklLinksCtrl)
    .directive('psBrowserQuicklinks', BrowserQuicklinksDirective);

  function quicklLinksCtrl($sce, quickLinksService, dataService, layoutService) {
    var vm = this;
    vm.list = [];
    activate();

    function activate() {
      if (layoutService.isActive('quicklinks')) {
        getQuicklinks();
      }
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
          if (angular.isUndefined(vm.list) || vm.list.length === 0) {
            vm.message = setMessage();
          } else if (angular.isDefined(vm.message)) {
            vm.message.show = false;
          }
        });
    }

    function setMessage() {
      return {
        show: true,
        header: $sce.trustAsHtml(dataService.data.widgets.quicklinks.title),
        text: $sce.trustAsHtml(dataService.data.widgets.quicklinks.help),
      };
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
