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
      s.local = {};
      s.sync = {};

      activate();

      function activate() {
        s.dataCB = {};
        storageService.setDataCB(runOnChangeData);
      }

      function getData(keys) {
        s.getDataPromise = $q
          .all([
            getDefaultData(),
            storageService.getData('local', keys),
            storageService.getData('sync', keys),
          ])
          .then(function(response) {
            if (angular.isDefined(keys)) {
              for (var k = 0; k < keys.length; k++) {
                s.data[keys[k]] = response[0][keys[k]];
              }
            } else {
              s.data = response[0];
            }
            if (angular.isDefined(response[1].localStorage)) {
              s.data.localStorage = response[1].localStorage;
            }
            angular.forEach(response[2], function(value, key) {
              consolidateSyncData(value, key);
            });
            angular.forEach(response[1], function(value, key) {
              consolidateLocalData(value, key);
            });

            s.data = dataTranslationService.translate(s.data);
          });
        return s.getDataPromise;
      }

      function consolidateLocalData(value, key) {
        s.local[key] = value;
        if (angular.isDefined(s.data.localStorage) && angular.isDefined(s.data.localStorage[key]) && s.data.localStorage[key]) {
          if (angular.isDefined(value)) {
            s.data[key] = value;
          } else {
            s.data[key] = getDefaultData(key)[key];
          }
        } else {
          consolidateNoSyncData(key);
        }
      }

      function consolidateSyncData(value, key) {
        s.sync[key] = value;
        if (angular.isUndefined(s.data.localStorage) || angular.isUndefined(s.data.localStorage[key]) || !s.data.localStorage[key]) {
          if (angular.isDefined(value)) {
            s.data[key] = value;
          } else {
            s.data[key] = getDefaultData(key)[key];
          }
          consolidateNoSyncData(key);
        }
      }

      function consolidateNoSyncData(key) {
        //Check if there is data that can not go sync storage, if so load it from local 
        if (angular.isDefined(widgetConstants.widgets[key]) && angular.isDefined(widgetConstants.widgets[key].noSyncData)) {

          angular.forEach(widgetConstants.widgets[key].noSyncData, function(noSyncKey) {
            if (angular.isDefined(s.local[key]) && angular.isDefined(s.local[key][noSyncKey])) {
              if (angular.isUndefined(s.data[key])) {
                s.data[key] = {};
              }
              s.data[key][noSyncKey] = angular.copy(s.local[key][noSyncKey]);
            }
          });

        }
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
        } else {
          promise = promise.then(function() {
            return getData([data.label]);
          });
          promise = promise.then(function() {
            for (var f = 0; f < s.dataCB[data.label].length; f++) {
              s.dataCB[data.label][f]();
            }
            return;
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
            s.data[key] = angular.copy(value);

            if (angular.isDefined(s.data.localStorage) && angular.isDefined(s.data.localStorage[key]) && s.data.localStorage[key]) {
              local[key] = angular.copy(value);
              s.local[key] = local[key];
            }

            if (angular.isUndefined(s.data.localStorage) || angular.isUndefined(s.data.localStorage[key]) || !s.data.localStorage[key]) {
              sync[key] = angular.copy(value);

              //Check if there is data that can not go sync storage
              if (angular.isDefined(widgetConstants.widgets[key]) && angular.isDefined(widgetConstants.widgets[key].noSyncData)) {

                angular.forEach(widgetConstants.widgets[key].noSyncData, function(noSyncKey) {
                  if (angular.isDefined(value[noSyncKey])) {
                    if (angular.isUndefined(s.local[key])) {
                      s.local[key] = {};
                    }
                    s.local[key][noSyncKey] = angular.copy(value[noSyncKey]);
                    delete sync[key][noSyncKey];
                  }
                });

                local[key] = s.local[key];
              }
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

      function runOnChangeData(changes, storage) {
        var f = 0;
        angular.forEach(changes, function(value, key) {
          if (storage === 'sync') {
            consolidateSyncData(value.newValue, key);
          } else {
            consolidateLocalData(value.newValue, key);
          }

          if (angular.isDefined(s.dataCB) && angular.isDefined(s.dataCB[key])) {
            for (f = 0; f < s.dataCB[key].length; f++) {
              s.dataCB[key][f]();
            }
          }
        });
        if (angular.isDefined(s.dataCB) && angular.isDefined(s.dataCB['all'])) {
          for (f = 0; f < s.dataCB['all'].length; f++) {
            s.dataCB['all'][f]();
          }
        }
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
