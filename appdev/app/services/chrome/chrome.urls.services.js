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
              response[c].altTitle = appList[i].name;
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
      getVisits: getVisits,
    };

    function historyList(param) {
      var chromeParam = {};
      chromeParam.text = param.searchText;
      chromeParam.startTime = param.startDate;
      chromeParam.maxResults = param.maxResults;
      var deferred = $q.defer();
      chrome.history.search(chromeParam,
        function(response) {
          var list = populateList(response);
          deferred.resolve(list);
        });
      return deferred.promise;
    }

    function getVisits(url) {
      var deferred = $q.defer();
      chrome.history.getVisits({ url: url }, function(visits) {
        deferred.resolve(visits);
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
      if (angular.isDefined(list[i]) && angular.isDefined(list[i].url)) {
        newList[j] = {
          id: list[i].id,
          title: getTitle(list[i]),
          altTitle: getAltTitle(list[i]),
          icon: getIcon(list[i]),
        };
        if (angular.isDefined(list[i].lastVisitTime)) {
          newList[j].timeStamp = new Date();
          newList[j].timeStamp.setTime(list[i].lastVisitTime);
        }
        if (angular.isDefined(list[i].url)) {
          newList[j].url = list[i].url;
        }
        if (angular.isDefined(list[i].id)) {
          newList[j].id = list[i].id;
        }
        j++;
      }
    }
    return newList;
  }

  function getTitle(item) {
    var title;
    if (angular.isUndefined(item.title) || item.title === '') {
      title = '(No title)';
    } else {
      title = item.title;
    }
    return title;
  }

  function getAltTitle(item) {
    var title;
    if (angular.isUndefined(item.title) || item.title === '') {
      title = item.url;
    } else {
      title = item.title;
    }
    return title;
  }

  function getIcon(item) {
    var icon;
    if (angular.isUndefined(item.icon)) {
      icon = 'chrome://favicon/' + item.url;
    } else {
      icon = item.icon;
    }
    return icon;
  }
})(angular);
