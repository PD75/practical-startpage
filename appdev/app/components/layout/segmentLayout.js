(function(angular) {
  "use strict";

  angular.module('PracticalStartpage')
    .directive('psSegmentLayout', segmentLayoutDirective);

  function segmentLayoutDirective($window, $timeout) {
    return {
      replace: true,
      transclude: true,
      template: '<div class="ui segment" ng-transclude></div>',
      link: function(scope, element) {
        setSegmentHeight(element);
        $timeout(function() { //redo when top modal has been rendered
          setSegmentHeight(element);
        });
        angular.element($window).bind('resize', function() {
          setSegmentHeight(element);
        });
        scope.$on('$destroy', function() {
          angular.element($window).off('resize', setSegmentHeight);
        });

      },
    };

    function setSegmentHeight(element) {
      var segmentHeight = $window.innerHeight - (angular.element('ps-layout .row').outerHeight() - angular.element('ps-layout .row').height()) - angular.element('.column.middle .menu').outerHeight() - (element.outerHeight() - element.innerHeight())
        //Segment padding
        - angular.element('ps-bottom-menu').outerHeight() - parseFloat(angular.element("body").css("font-size")) * 2;
      element.outerHeight(segmentHeight);
    }
  }

})(angular);
