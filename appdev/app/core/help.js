(function(angular) {
  "use strict";

  angular.module('ps.core')
    .controller("HelpCtrl", HelpCtrl)
    .directive('psHelp', helpDirective);

  function HelpCtrl($sce, dataService) {
    var vm = this;

    getHelpText();

    function getHelpText() {
      var layout = dataService.data.layout;
      var widgets = dataService.data.widgets;
      var i, j, help;
      vm.helpTexts = [];
      for (i = 0; i < layout.length; i++) {
        for (j = 0; j < layout[i].tabs.length; j++) {
            help = {
              icon: widgets[layout[i].tabs[j]].icon,
              title: widgets[layout[i].tabs[j]].title,
              html: $sce.trustAsHtml(widgets[layout[i].tabs[j]].help),
            };
            vm.helpTexts.push(help);
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
