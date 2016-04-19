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
            s.local = response[1];
            s.sync = response[2];
            s.data.localStorage = s.local.localStorage;
            angular.forEach(s.sync, function(value, key) {
              if (angular.isUndefined(s.data.localStorage) || angular.isUndefined(s.data.localStorage[key]) || !s.data.localStorage[key]) {
                s.data[key] = value;
              }
            });

            angular.forEach(s.local, function(value, key) {
              if (angular.isDefined(s.data.localStorage) && angular.isDefined(s.data.localStorage[key]) && s.data.localStorage[key]) {
                s.data[key] = value;
              }

              //Check if there is data that can not go sync storage, if so load it from local              
              if (angular.isDefined(widgetConstants.widgets[key]) && angular.isDefined(widgetConstants.widgets[key].noSyncData)) {

                angular.forEach(widgetConstants.widgets[key].noSyncData, function(noSyncKey) {
                  if (angular.isDefined(value[noSyncKey])) {
                    s.data[key][noSyncKey] = angular.copy(value[noSyncKey]);
                  }
                });

                s.data[key][widgetConstants.widgets[key].noSyncData] = angular.copy(s.local[key][widgetConstants.widgets[key].noSyncData]);
              }

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
            return setData(oldData);
          });
        }
        return promise;
      }

      function setData(newData, storage) {
        if (angular.isUndefined(storage)) {
          var promises = [];
          var local = {};
          var sync = {};
          angular.forEach(newData, function(value, key) {

            if (angular.isDefined(s.data.localStorage) && angular.isDefined(s.data.localStorage[key]) && s.data.localStorage[key]) {
              local[key] = angular.copy(value);
              s.local[key] = local[key];
              s.data[key] = value;
            }

            if (angular.isUndefined(s.data.localStorage) || angular.isUndefined(s.data.localStorage[key]) || !s.data.localStorage[key]) {
              sync[key] = angular.copy(value);

              //Check if there is data that can not go sync storage
              if (angular.isDefined(widgetConstants.widgets[key]) && angular.isDefined(widgetConstants.widgets[key].noSyncData)) {

                angular.forEach(widgetConstants.widgets[key].noSyncData, function(noSyncKey) {
                  if (angular.isDefined(value[noSyncKey])) {
                    s.local[key][noSyncKey] = angular.copy(sync[key][noSyncKey]);
                    delete sync[key][noSyncKey];
                  }
                });

                local[key] = s.local[key];
              }
              s.sync[key] = sync[key];
              s.data[key] = value;
            }

          });
          if (local !== {}) {
            promises.push(storageService.setData(local, 'local'));
          }
          if (sync !== {}) {
            promises.push(storageService.setData(sync, 'sync'));
          }
          return $q.all(promises);
        } else {
          angular.forEach(newData, function(value, key) {
            s.data[key] = value;
          });
          return storageService.setData(newData, storage);
        }

      }

      function getManifest() {
        return storageService.getManifest();
      }

      function getDefaultData(key) {
        var data = {};
        if (angular.isUndefined(key) || key === 'localStorage') {
          data.localStorage = getDefaultStorage();
        }
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

      function clearData(keys, storage) {
        return storageService.clearData(keys, storage);
      }

      function getDefaultStyles() {
        return {
          primaryCol: "blue",
          primaryInv: true,
          secondaryCol: "black",
          secondaryInv: true,
        };
      }

      function getDefaultStorage() {
        return {
          localStorage: true,
          version: true,
        };
      }
    });
