(function(angular) {
  "use strict";

  angular.module('ps.widgets')
    .controller("quicklLinksCtrl", quicklLinksCtrl)
    .directive('psBrowserQuicklinks', BrowserQuicklinksDirective);

  function quicklLinksCtrl($scope, quickLinksService, dataService) {
    var vm = this;
    vm.list = [];
    activate();

    function activate() {
      $scope.$watchCollection(function() {
        return [
          dataService.data.quicklinks,
          vm.col.refreshed,
        ];
      }, function(newValue) {
        if (angular.isUndefined(dataService.data.quicklinks)) {
          dataService.data.quicklinks = [0];
        }
        getQuicklinks();
      });
    }

    function getQuicklinks() {
      quickLinksService.quickLinksList(dataService.data.quicklinks[0])
        .then(function(quickLinksList) {
          vm.list = quickLinksList;
        });
    }
  }

  function BrowserQuicklinksDirective() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/widgetUrlList.html',
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
