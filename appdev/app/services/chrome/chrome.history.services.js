(function(angular) {
  'use strict';

  angular.module('chrome')
    .factory('historyService', historyService);

  function historyService($q, sharedService) {
    return {
      historyList: historyList,
      getVisits: getVisits,
      monitorHistory: monitorHistory,
    };

    function historyList(param) {
      var chromeParam = {};
      chromeParam.text = param.searchText;
      chromeParam.startTime = param.startDate;
      chromeParam.maxResults = param.maxResults;
      var deferred = $q.defer();
      chrome.history.search(chromeParam,
        function(response) {
          var list = sharedService.populateList(response);
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

    function monitorHistory(addHistoryCB) {
      chrome.history.onVisited.addListener(function(historyItem) {
        addHistoryCB(historyItem);
      });
    }
  }

})(angular);
