(function(angular) {
  "use strict";

  angular.module('ps.widgets')
    .controller("EditHistoryCtrl", EditHistoryCtrl)
    .directive('psEditHistory', EditHistoryDirective);

  function EditHistoryCtrl(historyService, layoutService) {
    var vm = this;

  }

  function EditHistoryDirective() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/widgets/widgetUrlList.html',
      controller: 'EditHistoryCtrl',
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
