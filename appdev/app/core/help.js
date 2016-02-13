(function(angular) {
  "use strict";

  angular.module('ps.core')
    .controller("HelpCtrl", HelpCtrl)
    .directive('psHelp', helpDirective);

  function HelpCtrl($sce, dataService) {
    var vm = this;

    activate();

    function activate() {
      var widgets = dataService.data.widgets;
      var h = 0;
      vm.helpTexts = [];
      angular.forEach(widgets, function(widget) {
        vm.helpTexts[h] = {
          icon: widget.icon,
          title: widget.title,
          html: $sce.trustAsHtml(widget.help),
        };
        h++;
      });
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
