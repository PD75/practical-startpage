angular.module('ps')
  .directive('psI18n', i18nDirective);

function i18nDirective($compile, i18n) {
  "use strict";
  return {
    restrict: 'A',
    scope: {
      i18n: '@psI18n',
    },
    link: link,
  };

  function link(scope, element) {
    var template = i18n.get(scope.i18n);
    if (template === '') {
      template = scope.i18n;
    }
    element.html(template);
    $compile(element.contents())(scope);
  }
}
