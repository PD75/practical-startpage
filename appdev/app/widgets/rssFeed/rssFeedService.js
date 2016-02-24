(function(angular) {
  "use strict";

  angular.module('ps.widgets')
    .service('rssFeedService', rssFeedService);

  function rssFeedService($http, $q, dataService) {
    var s = this;
    s.getFeeds = getFeeds;
    s.getFeed = getFeed;

    function getFeeds() {
      if (angular.isUndefined(dataService.data.rssFeed)) {
        dataService.data.rssFeed = [];
      }
      var feeds = dataService.data.rssFeed;
      var promises = [];
      for (var u = 0; u < feeds.length; u++) {
        promises[u] = getFeed(feeds[u].url, 30);
      }
      return $q
        .all(promises)
        .then(function(data) {
          var rss = [];
          var i, j,
            k = 0;
          for (i = 0; i < data.length; i++) {
            for (j = 0; j < data[i].feed.entries.length; j++) {
              rss[k] = data[i].feed.entries[j];
              k++;
            }
          }
          rss.sort(function(a, b) {
            return b.timeStamp - a.timeStamp;
          });
          return rss;
        });
    }

    function getFeed(url, num) {
      var queryUrl = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0';
      queryUrl += '&num=' + num;
      queryUrl += '&q=' + encodeURIComponent(url);
      return $http.get(queryUrl)
        .then(function(data) {
          var result = {};
          if (data.data.responseStatus === 200) {
            result.feed = data.data.responseData.feed;
            var ico, icon;
            if (angular.isDefined(data.data.responseData.feed.link)) {
              ico = data.data.responseData.feed.link.split('/');
            } else {
              ico = data.data.responseData.feed.feedUrl.split('/');
            }
            icon = ico[0] + '//' + ico[2] + '/favicon.ico';
            angular.forEach(result.feed.entries, function(value) {
              value.icon = icon;
              value.timeStamp = new Date(value.publishedDate);
            });
          } else { // Error from googleapis
            result.message = data.data.responseDetails;
            result.feed = []; // Avoid crash if error
          }
          return result;
        })
        .catch(function() {
          return {
            message: 'Unable to connect to google api Service, check network. If this persists please report the issue to practical startpage.',
            feed: [],
          };
        });
    }
  }
})(angular);
