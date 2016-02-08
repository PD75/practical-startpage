/* eslint angular/no-services: 0*/

angular.module('ngSemanticUi')
  .directive('uiModal', function($timeout, $http, $compile) {
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
        'modalInstance': '=?uiModalinstance',
      },
      template: '<div class="ui modal" ng-transclude></div>',
      link: link,
    };

    function link(scope, element) {
      scope.modalInstance = element;

      scope.$watch('modalData', function() {
        setData(scope, element);
      });

      scope.$watch('modalShow', function(modalShow) {
        $timeout(function() { //To give time for angular content to load
          element.modal(modalShow ? 'show' : 'hide');
        });
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
  });
