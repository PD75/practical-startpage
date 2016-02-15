(function(angular) {
  "use strict";

  angular.module('ps.widgets')
    .service('rssFeedService', rssFeedService);

  function rssFeedService($http, $q) {
    var s = this;
    s.getFeeds = getFeeds;
    s.getFeed = getFeed;

    function getFeeds() {
      var urls = [
        'http://rss.cnn.com/rss/cnn_topstories.rss',
        'http://feeds.feedburner.com/TechCrunch',
        'http://www.dn.se/rss/nyheter/',
      ];
      var promises = [];
      for (var u = 0; u < urls.length; u++) {
        promises[u] = getFeed(urls[u], 30);
      }
      return $q
        .all(promises)
        .then(function(data) {
          var rss = [];
          var i, j,
            k = 0;
          for (i = 0; i < data.length; i++) {
            for (j = 0; j < data[i].entries.length; j++) {
              rss[k] = data[i].entries[j];
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
          var feed = data.data.responseData.feed;
          angular.forEach(feed.entries, function(value) {
            var s = value.link.split('/');
            value.icon = s[0] + '//' + s[2] + '/favicon.ico';
            value.timeStamp = new Date(value.publishedDate);
          });
          return feed;
        });


    }
  }
})(angular);
