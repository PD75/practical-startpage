angular.module('ps.core.service')
  .service('dataTranslationService', function(i18n) {
    'use strict';

    var s = this;
    s.translate = translate;
    s.setStorageDataLabels = setStorageDataLabels;

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
      angular.forEach(data, function(value) {
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

    function setStorageDataLabels(data) {
      var i = 0;
      angular.forEach(data, function(value, key) {
        switch (key) {
          case 'layout':
          case 'badgeLayout':
          case 'styles':
            value.title = i18n.get('c_o_' + key);
            value.order = -1;
            i++;
            break;
          default:
            if (i18n.get('w_' + key) !== '') {
              value.title = i18n.get('w_' + key);
              value.order = +1;
              i++;
            }
        }
      });
      return data;
    }
  });
