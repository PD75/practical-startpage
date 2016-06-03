/* global chrome*/
// Used to check and load data sets into chrome storage for various versions of Practical startpage
(function() {
  "use strict";

  angular.module('ps')
    .service('testDataService', testDataService)
    .directive('testData', testDataDirective);

  function testDataService($q, $log, dataModelConst) {
    var s = this;
    s.printToConsole = printToConsole;
    s.checkStorageData = checkStorageData;

    function printToConsole(asString) {
      getStorage('local')
        .then(function(data) {
          $log.log('local');
          $log.log((asString ? angular.toJson(data) : data));
          return getStorage('sync');
        })
        .then(function(data) {
          $log.log('sync');
          $log.log((asString ? angular.toJson(data) : data));
        });
    }

    function checkStorageData() {
      getStorage('local')
        .then(function(data) {
          checkData(data, dataModelConst.local, 'local');
          return getStorage('sync');
        })
        .then(function(data) {
          checkData(data, dataModelConst.sync, 'sync');
        });
    }

    function checkData(data, dataModel, dataPath) {
      var error = false;
      switch (typeof data) {
        case 'object':
          if (angular.isArray(data)) {
            if (angular.isArray(dataModel)) {
              for (var d = 0; d < data.length; d++) {
                checkData(data[d], dataModel[0], dataPath + '.' + d);
              }
            } else {
              error = true;
            }
          } else {
            if (angular.isObject(dataModel)) {
              angular.forEach(data, function(object, key) {
                checkData(object, dataModel[key], dataPath + '.' + key);
              });
            } else {
              error = true;
            }
          }
          break;

        default:
          if (dataModel !== typeof data) {
            error = true;
          }
          break;
      }
      if (error) {
        $log.log('Error: ' + dataPath);
        $log.log('Data:' + typeof data);
        $log.log(data);
        $log.log('Model:');
        $log.log(dataModel);
      }
    }

    function getStorage(type) {
      var deferred = $q.defer();
      chrome.storage[type].get(function(response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    }
  }

  function testDataDirective(testDataService) {
    testDataService.printToConsole(false);
    testDataService.checkStorageData();
    return {};
  }
})();
