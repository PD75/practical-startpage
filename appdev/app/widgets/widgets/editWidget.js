angular.module('ps.widgets')
  .directive('psEditWidget', function($compile) {
    "use strict";
    return {
      restrict: 'E',
      bindToController: true,
      link: link,
    };

    function link(scope, element,a,c) {
      scope.title = scope.$parent.Layout.modalTitle;
      var dir = scope.$parent.Layout.modalDirective;
      var template = '<ps-'+dir+' ps-data="modalData" ps-instance=modalInstance ps-events="modalEvents"></ps-'+dir+'>';
      element.html(template);
      $compile(element.contents())(scope);
    }
  });
