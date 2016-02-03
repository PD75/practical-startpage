(function(angular) {
  "use strict";

  angular.module('PracticalStartpage')
    .directive('psSegmentBottomLayout', segmentBottomLayoutDirective);

  function segmentBottomLayoutDirective($window, $timeout) {
    return {
      replace: true,
      transclude: true,
      template: '<div class="ui bottom attached segment" ng-transclude></div>',
      link: function(scope, element, attr) {
        setBottomSegmentHeight(element);
        $timeout(function() { //redo when top modal has been rendered
          setBottomSegmentHeight(element);
        });
        angular.element($window).bind('resize', function() {
          setBottomSegmentHeight(element);
        });
        scope.$on('$destroy', function() {
          angular.element($window).off('resize', setBottomSegmentHeight);
        });

      },
    };

    function setBottomSegmentHeight(element) {
      var bottomSegmentHeight = $window.innerHeight - (angular.element('ps-layout .row').outerHeight() - angular.element('ps-layout .row').height()) - angular.element('.column.middle .menu').outerHeight() - (element.outerHeight() - element.innerHeight()) - angular.element('.top.segment').outerHeight()
        //Segment padding
        - angular.element('ps-bottom-menu').outerHeight() - parseFloat(angular.element("body").css("font-size")) * 2;
      if (angular.element('.top.segment').outerHeight() === 0) {
        bottomSegmentHeight -= 69;
      }
      element.outerHeight(bottomSegmentHeight);
    }
  }
})(angular);
