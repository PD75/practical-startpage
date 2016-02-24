(function() {
  'use strict';
  angular.module('ps.core')
    .factory('versionService', versionService);

  function versionService($q,dataService) {
    return {
      checkVersion: checkVersion,
    };

    function checkVersion(newVersion, oldVersion) {
      var promises = [];
      var p = 1;
      promises[0] = dataService.setData({
        'version': newVersion,
      });
      //from v1.x.x
      if (angular.isUndefined(oldVersion) || oldVersion.charAt(0) < '2') {
        if (angular.isDefined(dataService.data.bookmarkid)) {
          var data = {};
          data.quicklinks = [dataService.data.bookmarkid];
          promises[p] = dataService.setData(data);
          p++;
        }
        oldVersion = '2.0.0';
      }
      //from v2.0.0
      if (oldVersion === '2.0.0') {
        promises[p] = dataService.clearData('layout');
        p++;
      }
      return $q.all(promises);
    }
  }


})();
