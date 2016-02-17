(function(angular) {
  'use strict';

  angular.module('chrome')
    .factory('permissionService', permissionService);

  function permissionService($q) {
    return {
      checkPermissions: checkPermissions,
      requestPermissions: requestPermissions,
    };

    function checkPermissions(permissionsList) {
      var deferred = $q.defer();
      chrome.permissions.contains(permissionsObject(permissionsList),
        function(result) {
          deferred.resolve(result);
        });
      return deferred.promise;
    }

    function requestPermissions(permissionsList) {
      var deferred = $q.defer();
      chrome.permissions.request(permissionsObject(permissionsList),
        function(result) {
          deferred.resolve(result);
        });
      return deferred.promise;
    }

    function permissionsObject(permissionsList) {
      var permissions = {
        permissions: [],
        origins: [],
      };
      for (var p = 0; p < permissionsList.length; p++) {
        var regexp = new RegExp(/(ftp|http|https):\/\//);
        if (regexp.test(permissionsList[p])) {
          permissions.origins.push(permissionsList[p]);
        } else {
          permissions.permissions.push(permissionsList[p]);
        }
      }
      return permissions;
    }
  }
})(angular);
