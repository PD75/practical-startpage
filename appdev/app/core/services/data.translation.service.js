angular.module('ps.core.service')
  .service('dataTranslationService', function(i18n) {
    'use strict';

    var s = this;
    s.translate = translate;

    function translate(data) {
      angular.forEach(data, function(value, key) {
        switch (key) {
          case 'widgets':
            value = translateWidgets(value);
            break;
          case 'layout':
            value = translateLayout(value);
            break;
          default:

        }
      });
      return data;
    }

    function translateLayout(data) {
      angular.forEach(data, function(value, key) {
        value.title = i18n.get('c_l_' + value.label);
      });
      return data;
    }

    function translateWidgets(data) {
      angular.forEach(data, function(value, key) {
        value.title = i18n.get('w_' + key);
        value.help = i18n.get('w_' + key + '_help');
      });
      return data;
    }

  });
