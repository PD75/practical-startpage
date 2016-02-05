(function(angular) {
  "use strict";

  angular.module('PracticalStartpage')
    .controller("quicklLinksCtrl", quicklLinksCtrl)
    .directive('psBrowserQuicklinks', BrowserQuicklinksDirective);

  function quicklLinksCtrl($scope, quickLinksService, dataService) {
    var vm = this;
    vm.getQuicklinks = getQuicklinks;
    vm.list = [];
    activate();

    function activate() {
      //Enough to watch when quicklinks changes. Initial load by style.js
      $scope.$watch(function() {
          return dataService.data.quicklinks;
        }, function(newValue) {
          if (angular.isDefined(newValue)) {
            getQuicklinks();
          }
        },
        true);
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
      templateUrl: 'app/shared/widgetUrlList.html',
      controller: 'quicklLinksCtrl',
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
        if (ctrl.col.activeTab === 'Quicklinks') {
          ctrl.getQuicklinks();
        }
      });
    }
  }
})(angular);
