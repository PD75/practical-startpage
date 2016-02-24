(function() {
  'use strict';
  angular.module('ps.core')
    .factory('versionService', versionService);

  function versionService(dataService) {
    return {
      checkVersion: checkVersion,
    };

    function checkVersion(newVersion, oldVersion) {
      return dataService.setData({
        'version': newVersion,
      }).then(function() {
        //from v1.x.x
        if (angular.isUndefined(oldVersion) || oldVersion.charAt(0) < '2') {
          if (angular.isDefined(dataService.data.bookmarkid)) {
            var data = {};
            data.quicklinks = [dataService.data.bookmarkid];
            dataService.setData(data);
          }
          oldVersion = '2.0.0';
        }
        //from v2.0.0
        if (oldVersion === '2.0.0') {
          dataService.clearData('layout');
        }
        return;
      });
    }
  }


})();
