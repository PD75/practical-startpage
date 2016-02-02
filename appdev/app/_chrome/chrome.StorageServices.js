(function(angular) {
  'use strict';

  angular.module('chromeModule').factory('storageService', storageService);

  function storageService($q) {
    return {
      getLocalData: getLocalData,
      setLocalData: setLocalData,
      clearData: clearData,
      getManifest: getManifest,
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

    function clearData() {
      var d1 = $q.defer();
      chrome.storage.local.clear(function() {
        d1.resolve();
      });
      var d2 = $q.defer();
      chrome.storage.local.clear(function() {
        d2.resolve();
      });
      return $q.all([d1, d2]);
    }

    function getManifest() {
      return chrome.runtime.getManifest();
    }
  }

})(angular);
