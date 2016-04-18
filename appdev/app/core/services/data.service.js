angular
  .module('ps.core.service', ['ps.widgets.constants', 'chrome'])
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
      s.setStorage = setStorage;
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
        s.getDataPromise = $q
          .all([
            getDefaultData(),
            storageService.getData('local'),
            storageService.getData('sync'),
          ])
          .then(function(response) {
            s.data = response[0];
            angular.forEach(response[1], function(value, key) {
              s.data[key] = value;
            });
            s.data = dataTranslationService.translate(s.data);
          });
        return s.getDataPromise;
      }

      function getStorageData() {
        var promises = [];
        promises[0] = storageService.getData('local')
          .then(function(response) {
            return getStorageDataType(response, 'local');
          });
        promises[1] = storageService.getData('sync')
          .then(function(response) {
            return getStorageDataType(response, 'sync');
          });
        return $q.all(promises)
          .then(function(response) {
            var returnData = response[0];
            angular.merge(returnData, response[1]);
            var x = dataTranslationService.setStorageDataLabels(returnData);
            return x;
          });
      }

      function getStorageDataType(data, type) {
        var returnData = {};
        angular.forEach(data, function(value, key) {
          returnData[key] = {};
          returnData[key][type] = value;
        });
        return returnData;
      }

      function setStorage(data) {
        var oldData = {};
        oldData[data.label] = angular.copy(s.data[data.label]);
        //Check if there is data that can not go sync storage
        if (data.localStorage && angular.isDefined(widgetConstants.widgets[data.label]) && angular.exists(widgetConstants.widgets[data.label].noSyncData)) {
          delete oldData[data.label][widgetConstants.widgets[data.label].noSyncData];
        }
        //Set new localStorage
        if (angular.isUndefined(s.data.localStorage)) {
          s.data.localStorage = {};
        }
        s.data.localStorage[data.label] = !data.localStorage;
        var d = {
          localStorage: s.data.localStorage,
        };
        var promise = setData(d, 'local');
        if (data.copyData) {
          promise = promise.then(function() {
            return setData(oldData, (data.localStorage ? "sync" : "local"));
          });
        }
        return promise;
      }

      function setData(newData, storage) {
        if (angular.isUndefined(storage)) {
          storage = 'local'; //change before relase
        }
        angular.forEach(newData, function(value, key) {
          s.data[key] = value;
        });
        return storageService.setData(newData, storage);
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
          data.layout = widgetConstants.defaultWidgets;
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
        var promises = [];
        promises[0] = storageService.clearData(keys.local);
        promises[1] = storageService.clearData(keys.sync);
        return $q.all(promises);
      }

      function getDefaultStyles() {
        return {
          primaryCol: "blue",
          primaryInv: true,
          secondaryCol: "black",
          secondaryInv: true,
        };
      }
    });
