(function() {
  'use strict';
  angular.module('ps.core.service')
    .factory('versionService', versionService);

  function versionService($q, dataService) {
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
        var promises = [];
        var p = 0;
        if (angular.isDefined(dataService.data.bookmarkid)) { // compensating for not deleting bokmarkid previously
          if (olderVersion('2.0.0', oldVersion)) {
            var data = {};
            data.quicklinks = [dataService.data.bookmarkid];
            promises[p++] = dataService.setData(data);
          }
          promises[p++] = dataService.clearData('bookmarkid', 'local');
        }
        //to v2.1.0
        if (olderVersion('2.1.0', oldVersion)) {
          promises[p++] = dataService.clearData('layout', 'local');
        }
        //2.5.0 and above if rss is array
        if (angular.isDefined(dataService.data.rssFeed) && angular.isArray(dataService.data.rssFeed)) {
          dataService.data.rssFeed = {
            feeds: dataService.data.rssFeed,
          };
          promises[p++] = dataService.setData({
            rssFeed: dataService.data.rssFeed,
          });
        }

        return $q.all(promises);
      });

    }

    function olderVersion(newVersion, oldVersion) {
      if (angular.isUndefined(oldVersion)) {
        return true;
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
  }


})();
