angular.module('ngSemanticUi')
  .directive('uiDropdown', function() {
    'use strict';
    return {
      restrict: 'EA',
      scope: {
        dropdownData: '=uiDropdownData',
        dropdownObj: '=?uipDropdown',
      },
      link: link,
    };

    function link(s, e) {
      if (angular.isObject(s.dropdownData)) {
        e.dropdown(s.dropdownData);
        s.$watchCollection('dropdownData', function() {
          e.dropdown(s.dropdownData);
          e.dropdown('refresh');
        });
      } else {
        e.dropdown();
      }
      s.dropdownObj = e;
    }
  });
