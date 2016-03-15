(function(angular) {
  "use strict";

  angular.module('ps.widgets')
    .service('rssFeedService', rssFeedService);

  function rssFeedService($http, $q, dataService, historyService) {
    var s = this;
    s.getFeeds = getFeeds;
    s.getFeed = getFeed;
    s.consolidateFeed = consolidateFeed;
    s.deleteItem = deleteItem;
    s.restoreDeletedItem = restoreDeletedItem;

    function getFeeds() {
      var feeds = [];
      s.deletedItems = [];
      if (angular.isDefined(dataService.data.rssFeed)) {
        if (angular.isDefined(dataService.data.rssFeed.feeds)) {
          feeds = angular.copy(dataService.data.rssFeed.feeds);
        }
        if (angular.isDefined(dataService.data.rssFeed.deletedItems)) {
          s.deletedItems = angular.copy(dataService.data.rssFeed.deletedItems);
        }
        s.rssFeed = {
          hideVisited: dataService.data.rssFeed.hideVisited,
          allowDelete: dataService.data.rssFeed.allowDelete,
      numEntries: 50,
        };
      }
      var promises = [];
      for (var p = 0; p < feeds.length; p++) {
        promises[p] = getFeed(feeds[p].url, s.rssFeed.numEntries);
      }
      return $q
        .all(promises)
        .then(function(data) {
          var k = 0;
          s.feed = [];
          for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].feed.entries.length; j++) {
              s.feed[k++] = data[i].feed.entries[j];
            }
          }
          return consolidateFeed()
            .then(function(feed) {
              return {
                feed: feed,
                allowDelete: s.rssFeed.allowDelete,
              };
            });
        });
    }

    function consolidateFeed() {
      var checkedVisits = [];
      var f;
      for (f = 0; f < s.feed.length; f++) {
        checkedVisits[f] = checkVisited(s.feed[f]);
      }
      return $q.all(checkedVisits)
        .then(function(feed) {
          var rss = [];
          var r = 0;
          s.deletedFeed = [];
          var d = 0;
          for (f = 0; f < feed.length; f++) {
            if ((!s.rssFeed.hideVisited || !feed[f].visited)
              && (!checkDuplicate(feed[f], rss))
              && (!checkDeleted(feed[f]) || !s.rssFeed.allowDelete)) {
              rss[r++] = feed[f];
            } else if (checkDeleted(feed[f]) && s.rssFeed.allowDelete) {
              s.deletedFeed[d++] = feed[f];
            }
          }
          return rss
            .sort(function(a, b) {
              return b.timeStamp - a.timeStamp;
            })
            .slice(0, s.rssFeed.numEntries);//Limit to avoid Performance problems in DOM
        });
    }

    function checkVisited(entry) {
      return historyService.getVisits(entry.link)
        .then(function(visits) {
          if (visits.length > 0) {
            entry.visited = true;
          }
          return entry;
        });
    }

    function checkDuplicate(entry, feed) {
      var d = false;
      for (var f = 0; f < feed.length; f++) {
        if (entry.link === feed[f].link) {
          d = true;
        }
      }
      return d;
    }
    function deleteItem(item) {
      var rssFeed = dataService.data.rssFeed;
      if (angular.isDefined(rssFeed.deletedItems)) {
        s.deletedItems = rssFeed.deletedItems;
      }
      s.deletedItems.push({
        link: item.link,
        dateStamp: item.dateStamp,
      });
      rssFeed.deletedItems = s.deletedItems;

      dataService.setData({
        rssFeed: rssFeed,
      });
    }

    function restoreDeletedItem(item) {
      var rssFeed = dataService.data.rssFeed;
      s.deletedItems = rssFeed.deletedItems;
      for (var i = 0; i < s.deletedItems.length; i++) {
        if (item.link === s.deletedItems[i].link) {
          s.deletedItems.splice(i, 1);
          i--; //move back one step and continue  
        }
      }
      rssFeed.deletedItems = s.deletedItems;

      dataService.setData({
        rssFeed: rssFeed,
      });


    }

    function checkDeleted(entry) {
      var d = false;
      for (var f = 0; f < s.deletedItems.length; f++) {
        if (entry.link === s.deletedItems[f].link) {
          d = true;
        }
      }
      return d;
    }

    function getFeed(url, num) {
      var queryUrl = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0';
      queryUrl += '&num=' + num;
      queryUrl += '&q=' + encodeURIComponent(url);
      return $http.get(queryUrl)
        .then(function(data) {
          var result = {};
          if (data.data.responseStatus === 200) {
            result.feed = addIcons(data.data.responseData.feed);

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
    function addIcons(feed) {
      var ico, icon;
      if (angular.isDefined(feed.link)) {
        ico = feed.link.split('/');
      } else {
        ico = feed.feedUrl.split('/');
      }
      icon = ico[0] + '//' + ico[2] + '/favicon.ico';
      angular.forEach(feed.entries, function(value) {
        value.icon = icon;
        value.timeStamp = new Date(value.publishedDate);
      });
      return feed;
    }

  }
})(angular);
