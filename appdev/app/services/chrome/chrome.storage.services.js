(function(angular) {
  'use strict';

  angular.module('chrome').factory('storageService', storageService);

  function storageService($q) {
    return {
      getData: getData,
      setData: setData,
      clearData: clearData,
      getManifest: getManifest,
      setDataCB: setDataCB,
    };

    function getData(type,keys) {
      // type = 'local';
      var deferred = $q.defer();
      chrome.storage[type].get(keys,function(response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    }

    function setData(data, type) {
      // type = 'local';
      var deferred = $q.defer();
      chrome.storage[type].set(data, function() {
        deferred.resolve();
      });
      return deferred.promise;
    }

    function clearData(keys, type) {
      // type = 'local';
      var deferred = $q.defer();
      if (angular.isDefined(keys)) {
        chrome.storage[type].remove(keys, function() {
          deferred.resolve();
        });
      } else {
        chrome.storage[type].clear(function() {
          deferred.resolve();
        });
      }
      return deferred.promise;
    }

    function getManifest() {
      return chrome.runtime.getManifest();
    }

    function setDataCB(CB) {
      chrome.storage.onChanged.addListener(function(changes,areaName) {
        CB(changes,areaName);
      });
    }
  }

})(angular);
