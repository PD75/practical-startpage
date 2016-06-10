angular.module('uiAngular', []);

angular.module('uiAngular')
  .config(["$compileProvider", function($compileProvider) {
    'use strict';
    $compileProvider.debugInfoEnabled(false);
  }]);


angular.module('uiAngular')
  .directive('uiPopup', function() {
    'use strict';
    return {
      restrict: 'A',
      scope: {
        popupData: '=uiPopup',
        popupObj: '=?uiPopupObj',
      },
      link: link,
    };

    function link(s, e) {
      if (angular.isObject(s.popupData)) {
        e.popup(s.popupData);
        s.$watchCollection('popupData', function() {
          e.popup('destroy');
          e.popup(s.popupData);
        });
      } else {
        e.popup();
      }
      s.popupObj = e;
      s.$on('$destroy', function() {
        e.popup('destroy');
      });
    }
  });

/* eslint angular/no-services: 0*/

angular.module('uiAngular')
  .directive('uiModal', ["$timeout", "$http", "$compile", function($timeout, $http, $compile) {
    'use strict';

    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        'modalShow': '=?uiModalShow',
        'modalData': '=?uiModalData',
        'modalUrlObj': '=?uiModalUrl',
        'modalUrl': '@?uiModalUrl',
        'modalObj': '=?uiModalObj',
      },
      template: '<div class="ui modal" ng-transclude></div>',
      link: link,
    };

    function link(scope, element) {
      scope.modalObj = element;

      scope.$watch('modalData', function() {
        setData(scope, element);
      });

      scope.$watch('modalShow', function(modalShow) {
          element.modal(modalShow ? 'show' : 'hide');
      });
      scope.$on('$destroy', function() {
        element.modal('hide');
        element.remove();
      });
    }
    // Support Functions
    function useUrlForContent(s, e) {
      if (angular.isString(s.modalUrlObj)) {
        getContentFromUrl(s, e, s.modalUrlObj);
      } else {
        getContentFromUrl(s, e, s.modalUrl);
      }
    }

    function getContentFromUrl(s, e, Url) {
      $http.get(Url)
        .then(function(data) {
          e.html(data.data);
          $compile(e.contents())(s);
          $timeout(function() {
            e.modal('refresh');
          });
        });
    }

    function setData(s, e) {
      var modalData = {};
      if (angular.isObject(s.modalData)) {
        angular.copy(s.modalData, modalData);
      }
      modalData.onHide = function() {
        s.modalShow = false;
        $timeout(function() {
          s.$apply();
        });
        if (angular.isDefined(s.modalData) && angular.isFunction(s.modalData.onHide)) {
          s.modalData.onHide();
        }
      };
      modalData.onShow = function() {
        if (angular.isDefined(s.modalUrl)) {
          useUrlForContent(s, e);
        }
        s.modalShow = true;
        $timeout(function() {
          s.$apply();
        });
        if (angular.isDefined(s.modalData) && angular.isFunction(s.modalData.onShow)) {
          s.modalData.onShow();
        }
      };
      e.modal(modalData);
    }
  }]);

angular.module('uiAngular')
  .directive('uiDropdown', ["$timeout", function($timeout) {
    'use strict';
    return {
      restrict: 'A',
      scope: {
        dropdownData: '=uiDropdownData',
        dropdownObj: '=?uiDropdown',
      },
      link: link,
    };

    function link(s, e) {
      if (angular.isObject(s.dropdownData)) {
        e.dropdown(s.dropdownData);
        s.$watchCollection('dropdownData', function() {
          e.dropdown(s.dropdownData);
          $timeout(function() {
            e.dropdown('refresh');
          });
        });
      } else {
        $timeout(function() {
          e.dropdown();
        });
      }
      s.dropdownObj = e;
    }
  }]);
