
angular.module('ngSemanticUi')
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
