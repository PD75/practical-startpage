(function(angular) {
  'use strict';
  /*eslint camelcase: 0*/
  angular.module('chrome')
    .factory('i18n', i18n);

  function i18n() {

    return {
      get: get,
    };

    function get(text) {
      var x = chrome.i18n.getMessage("w_bk");
      return chrome.i18n.getMessage(text);

    }

  }
})(angular);
