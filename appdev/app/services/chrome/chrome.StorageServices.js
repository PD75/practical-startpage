(function(angular) {
  'use strict';

  angular.module('chrome').factory('storageService', storageService);

  function storageService($q) {
    return {
      getLocalData: getLocalData,
      setLocalData: setLocalData,
      clearData: clearData,
      getManifest: getManifest,
      setDataCB: setDataCB,
    };

    function getLocalData() {
      var deferred = $q.defer();
      chrome.storage.local.get(function(response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    }

    function setLocalData(data) {
      var deferred = $q.defer();
      chrome.storage.local.set(data, function() {
        deferred.resolve();
      });
      return deferred.promise;
    }

    function clearData(keys) {
      var d1 = $q.defer();
      var d2 = $q.defer();
      if (angular.isDefined(keys)) {
        chrome.storage.local.remove(keys, function() {
          d1.resolve();
        });
        chrome.storage.sync.remove(keys, function() {
          d2.resolve();
        });
      } else {
        chrome.storage.local.clear(function() {
          d1.resolve();
        });
        chrome.storage.sync.clear(function() {
          d2.resolve();
        });
      }
      return $q.all([d1, d2]);
    }

    function getManifest() {
      return chrome.runtime.getManifest();
    }

    function setDataCB(CB) {
      chrome.storage.onChanged.addListener(function(changes, areaName) {
        CB(changes);
      });
    }
  }

})(angular);
