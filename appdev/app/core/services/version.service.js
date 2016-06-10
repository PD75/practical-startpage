(function() {
  'use strict';
  angular.module('ps.core.service')
    .factory('versionService', versionService);

  function versionService($q, dataService, storageService) {
    return {
      checkVersion: checkVersion,
      linkUninstallSurvey: linkUninstallSurvey,
    };

    function linkUninstallSurvey() {
      var today = new Date().getTime();
      var usageTime = 1;
      if (angular.isDefined(dataService.data.installDate)) {
        usageTime = Math.round((today - dataService.data.installDate) / (1000 * 60 * 60 * 24) + .5);
      } else {
        dataService.setData({
          'installDate': today,
        });
      }
      var url = 'http://pd75.github.io/#/ps-uninstall';
      url += '?usageTime=' + usageTime;
      chrome.runtime.setUninstallURL(url);
    }

    function checkVersion(newVersion, oldVersion) {

      return dataService.setData({
        'version': newVersion,
      }).then(function() {
        var promise = $q.all([]);
        // var p = 0;
        if (angular.isDefined(dataService.data.bookmarkid)) { // compensating for not deleting bokmarkid previously
          if (olderVersion('2.0.0', oldVersion)) {
            var data = {};
            data.quicklinks = [dataService.data.bookmarkid];
            promise = promise.then(function() {
              return dataService.setData(data);
            });
          }
          promise = promise.then(function() {
            return dataService.clearData('bookmarkid', 'local');
          });
        }
        //to v2.1.0
        if (olderVersion('2.1.0', oldVersion)) {
          promise = promise.then(function() {
            return dataService.clearData('layout', 'local');
          });
        }
        if (olderVersion('2.5.0', oldVersion)) {
          if (angular.isDefined(dataService.data.rssFeed) && angular.isArray(dataService.data.rssFeed)) {
            dataService.data.rssFeed = {
              feeds: dataService.data.rssFeed,
            };
            promise = promise.then(function() {
              return dataService.setData({
                rssFeed: dataService.data.rssFeed,
              });
            });
          }
        }
        if (olderVersion('2.7.0', oldVersion)) {
          promise = promise.then(function() {
            return SyncStorageUpgrade();
          });
        }

        return promise;
      });

    }

    function olderVersion(newVersion, oldVersion) {
      if (angular.isUndefined(oldVersion)) {
        return false;
      } else {
        var nv = newVersion.split('.');
        var ov = oldVersion.split('.');
        if ((+ov[0] < +nv[0]) || (+ov[0] === +nv[0] && +ov[1] < +nv[1]) || (+ov[0] === +nv[0] && +ov[1] === +nv[1] && +ov[2] < +nv[2])) {
          return true;
        } else {
          return false;
        }
      }
    }
    // v2.6.0
    function SyncStorageUpgrade() {
      return dataService.getStorageData()
        .then(function(data) {
          var localStorage = dataService.data.localStorage;
          var keys = ['installDate'];
          var k = 1;
          var installDate = data.installDate.local;
          angular.forEach(data, function(value, key) {
            if (angular.isDefined(value.title) && angular.isUndefined(localStorage[key])) {
              localStorage[key] = true;
              keys[k++] = key;
            }
          });

          var promises = [];
          promises[0] = storageService.setData({
            localStorage: localStorage,
          }, 'local');
          promises[1] = storageService.setData({
            installDate: installDate,
          }, 'sync');
          promises[2] = storageService.clearData(['installDate'], 'local');

          return $q.all(promises);
        })
        .then(function() {
          return dataService.getData();
        });

    }
  }

})();
