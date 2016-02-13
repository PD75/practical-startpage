(function(angular) {
  'use strict';

  angular.module('chrome')
    .factory('appService', appService)
    .factory('historyService', historyService)
    .factory('closedTabsService', closedTabsService)
    .factory('quickLinksService', quickLinksService)
    .factory('topSitesService', topSitesService);

  function appService($q) {
    return {
      appList: appList,
    };

    function appList() {
      var deferred = $q.defer();
      chrome.management.getAll(
        function(appList) {
          var c = 0;
          var response = [];
          for (var i = 0; i < appList.length; i++) {
            if (angular.isDefined(appList[i].name) && angular.isDefined(appList[i].icons) && angular.isDefined(appList[i].appLaunchUrl)) {
              response[c] = {};
              response[c].title = appList[i].name;
              response[c].icon = appList[i].icons[0].url;
              response[c].url = appList[i].appLaunchUrl;
              c = c + 1;
            }
          }
          deferred.resolve(response);
        });
      return deferred.promise;
    }
  }

  function historyService($q) {
    return {
      historyList: historyList,
    };

    function historyList(historyParam) {
      var chromeParam = {};
      chromeParam.text = historyParam.searchText;
      chromeParam.startTime = historyParam.startDate;
      chromeParam.maxResults = historyParam.maxResults;
      var deferred = $q.defer();
      chrome.history.search(chromeParam,
        function(response) {
          var list = populateList(response);
          deferred.resolve(list);
        });
      return deferred.promise;
    }
  }

  function closedTabsService($q) {
    return {
      closedTabsList: closedTabsList,
      monitorClosedTabs: monitorClosedTabs,
    };

    function monitorClosedTabs(getClosedTabs) {
      chrome.sessions.onChanged.addListener(function() {
        getClosedTabs();
      });
    }

    function closedTabsList() {
      var deferred = $q.defer();
      chrome.sessions.getRecentlyClosed(
        function(response) {
          var tabsList = [];
          var j = 0;
          for (var i = 0; i < response.length; i++) {
            if (angular.isDefined(response[i].tab)) {
              tabsList[j] = response[i].tab;
              j++;
            } else if (angular.isDefined(response[i].window)) {
              for (var k = 0; k < response[i].window.tabs.length; k++) {
                tabsList[j] = response[i].window.tabs[k];
                j++;
              }
            }
          }
          var list = populateList(tabsList);
          deferred.resolve(list);
        });
      return deferred.promise;
    }
  }

  function quickLinksService($q) {
    return {
      quickLinksList: quickLinksList,
    };

    function quickLinksList(bookmarkid) {
      if (!bookmarkid) {
        bookmarkid = '1';
      }
      var deferred = $q.defer();
      chrome.bookmarks.getChildren(bookmarkid,
        function(response) {
          var list = populateList(response);
          deferred.resolve(list);
        });
      return deferred.promise;
    }
  }

  function topSitesService($q) {
    return {
      topSitesList: topSitesList,
    };

    function topSitesList() {
      var deferred = $q.defer();
      chrome.topSites.get(
        function(response) {
          var list = populateList(response);
          deferred.resolve(list);
        });
      return deferred.promise;
    }
  }

  function populateList(list) {
    var j = 0;
    var newList = [];
    for (var i = 0; i < list.length; i++) {
      if (angular.isDefined(list[i])) {
        newList[j] = list[i];
        if (angular.isUndefined(list[i].title) || list[i].title === '') {
          newList[j].title = list[i].url;
        }
        if (angular.isUndefined(list[i].icon)) {
          newList[j].icon = 'chrome://favicon/' + list[i].url;
        }
        j++;
      }
    }
    return list;
  }
})(angular);
