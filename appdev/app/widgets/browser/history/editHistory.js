(function(angular) {
  "use strict";

  angular.module('ps.widgets')
    .controller("EditHistoryCtrl", EditHistoryCtrl)
    .directive('psEditHistory', EditHistoryDirective);

  function EditHistoryCtrl(historyService, i18n) {
    var vm = this;
    vm.locale = locale;
    vm.input = {
      format: '',
      useMax: false,
      useDays: false,
      max: '',
      days: '',
    };

    function locale(text, placeholders) {
      return i18n.get(text, placeholders);
    }
  }

  function EditHistoryDirective() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/browser/history/editHistory.html',
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
