(function(angular) {
  "use strict";

  angular.module('ps.core')
    .controller("HelpCtrl", HelpCtrl)
    .directive('psHelp', helpDirective);

  function HelpCtrl($sce, dataService, i18n) {
    var vm = this;

    activate();

    function activate() {
      var widgets = dataService.data.widgets;
      var h = 0;
      vm.widgetTitle = i18n.get('Widgets');
      vm.widgets = [];
      angular.forEach(widgets, function(widget) {
        vm.widgets[h] = {
          icon: widget.icon,
          title: widget.title,
          html: $sce.trustAsHtml(widget.help),
        };
        h++;
      });
      vm.startpage = [{
        icon: 'block layout',
        title:i18n.get('c_help_title_0'),
        text:i18n.get('c_help_text_0'),
      }, {
        icon: 'maximize layout',
        title:i18n.get('c_help_title_1'),
        text:i18n.get('c_help_text_1'),
      }, {
        icon: 'columns layout',
        title:i18n.get('c_help_title_2'),
        text:i18n.get('c_help_text_2'),
      }];
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
