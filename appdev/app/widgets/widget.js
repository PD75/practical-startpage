
angular.module('PracticalStartpage')
  .directive('psWidget', function($compile) {
    "use strict";
    return {
      restrict: 'E',
      link: link,
    };

    function link(scope, element) {
      var template = '';
      if (scope.tab.directive) {
        template = '<ps-' + scope.tab.directive + ' ps-tab="tab" ps-col="col" ps-style="Layout.styles"></ps-' + scope.tab.directive + '>';
      }
      element.html(template);
      $compile(element.contents())(scope);
    }
  });
