angular.module('ps.core.service', ['ps.widgets.constants', 'chrome'])
  .service('dataService',
    function($q, storageService, widgetConstants, dataTranslationService) {
      'use strict';

      var s = this;

      s.getData = getData;
      s.setData = setData;
      s.clearData = clearData;
      s.getManifest = getManifest;
      s.getDefaultData = getDefaultData;
      s.setOnChangeData = setOnChangeData;
      s.getStorageData = getStorageData;
      s.data = {
        dataChangeCB: {},
        layout: [],
        styles: [],
        widgets: [],
        activeTabs: [],
      };

      activate();

      function activate() {
        s.dataCB = {};
        storageService.setDataCB(runOnChangeData);
      }

      function getData() {
        return $q
          .all([
            getStorageData(),
            getDefaultData(),
          ])
          .then(function(response) {
            s.data = response[1];
            angular.forEach(response[0], function(value, key) {
              s.data[key] = value;
            });
            s.data = dataTranslationService.translate(s.data);
          });
      }

      function getStorageData() {
        return storageService.getLocalData()
          .then(function(data) {
            return data;
          });
      }

      function setData(newData) {
        angular.forEach(newData, function(value, key) {
          s.data[key] = value;
        });
        return storageService.setLocalData(newData);
      }

      function getManifest() {
        return storageService.getManifest();
      }

      function getDefaultData(key) {
        var data = {};
        if (angular.isUndefined(key) || key === 'styles') {
          data.styles = getDefaultStyles();
        }
        if (angular.isUndefined(key) || key === 'layout') {
          data.layout = getDefaultLayout();
        }
        if (angular.isUndefined(key) || key === 'widgets') {
          data.widgets = widgetConstants.widgets;
        }
        return data;
      }

      function setOnChangeData(key, fnCB) {
        if (angular.isUndefined(s.dataCB[key])) {
          s.dataCB[key] = [];
        }
        s.dataCB[key].push(fnCB);
      }

      function runOnChangeData(changes) {
        var f = 0;
        angular.forEach(changes, function(value, key) {
          if (angular.isDefined(value.newValue)) {
            s.data[key] = value.newValue;
          } else {
            s.data[key] = getDefaultData(key)[key];
          }
          if (angular.isDefined(s.dataCB) && angular.isDefined(s.dataCB[key])) {
            for (f = 0; f < s.dataCB[key].length; f++) {
              s.dataCB[key][f]();
            }
          }
        });
      }

      function clearData(keys) {
        return storageService.clearData(keys);
      }

      function getDefaultStyles() {
        return {
          primaryCol: "blue",
          primaryInv: true,
          secondaryCol: "black",
          secondaryInv: true,
        };
      }

      function getDefaultLayout() {
        return [{
          title: "Left",
          label: "left",
          tabs: ['bookmarkTree'],
          items: 2,
        }, {
          title: "Middle",
          label: "middle",
          tabs: ['quicklinks', 'history', 'topSites'],
          items: 4,
        }, {
          title: "Right",
          label: "right",
          tabs: ['closedTabs', 'chromeApps'],
          items: 2,
        }];
      }
    });
