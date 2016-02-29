angular.module('ngSemanticUi')
  .directive('uiDropdown', function($timeout) {
    'use strict';
    return {
      restrict: 'EA',
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
  });
