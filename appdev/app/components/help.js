(function(angular) {
  "use strict";

  angular.module('PracticalStartpage')
    .controller("HelpCtrl", HelpCtrl)
    .directive('psHelp', helpDirective);

  function HelpCtrl($sce, dataService) {
    var vm = this;

    getHelpText();

    function getHelpText() {
      var layout = dataService.data.columns;
      var i, j, help;
      vm.helpTexts = [];
      for (i = 0; i < layout.length; i++) {
        for (j = 0; j < layout[i].tabs.length; j++) {
          if (angular.isUndefined(layout[i].tabs[j].delegate) || !layout[i].tabs[j].delegate) {
            help = {
              icon: layout[i].tabs[j].icon,
              title: layout[i].tabs[j].title,
              html: $sce.trustAsHtml(layout[i].tabs[j].help),
            };
            vm.helpTexts.push(help);
          }
        }
      }
    }
  }

  function helpDirective() {
    return {
      restrict: 'A',
      controller: 'HelpCtrl',
      controllerAs: 'vm',
    };
  }
})(angular);
