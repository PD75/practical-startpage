(function() {
  "use strict";

  angular.module('ps.widgets')
    .service('rssFeedService', rssFeedService);

  function rssFeedService($sce, $http, $q, dataService, historyService, bookmarkService) {
    var s = this;
    s.getFeeds = getFeeds;
    s.getFeed = getFeed;
    s.consolidateFeed = consolidateFeed;
    s.deleteItem = deleteItem;
    s.restoreDeletedItem = restoreDeletedItem;
    s.saveDeletedItems = saveDeletedItems;
    s.consolidateDeleted = consolidateDeleted;

    s.data = {};
    s.syncFolders = [];
    s.rssFeed = {
      numEntries: 50,
    };

    function getFeeds() {
      s.data = angular.copy(dataService.data.rssFeed);
      var feeds = [];
      if (angular.isDefined(s.data)) {
        if (angular.isDefined(s.data.feeds)) {
          feeds = angular.copy(s.data.feeds);
        }
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

          return getDeletedItems();
        })
        .then(function() {
          return consolidateFeed();
        })
        .then(function(feed) {
          return {
            feed: feed,
            allowDelete: s.data.allowDelete,
          };
        });
    }

    function getDeletedItems() {
      var deletedItems = [];
      if (angular.isDefined(s.data.deletedItems)) {
        deletedItems = angular.copy(s.data.deletedItems);
      }
      if (angular.isDefined(s.data.sync) && s.data.sync.delItemsSync && angular.isDefined(s.data.sync.delItemsFolder)) {
        return bookmarkService.getSubTree(s.data.sync.delItemsFolder)
          .then(function(delItems) {
            if (delItems[0]) {
              for (var i = 0; i < delItems[0].children.length; i++) {
                var dateFolder = delItems[0].children[i];
                for (var j = 0; j < dateFolder.children.length; j++) {
                  var findId = ['link', dateFolder.children[j].url];
                  var index = deletedItems.findIndex(findCB, findId);
                  var date = delItems[0].children[i].title;
                  if (index > -1) {
                    deletedItems[index].dateStamp =
                      (date > deletedItems[index].dateStamp ? date : deletedItems[index].dateStamp);
                  } else {
                    deletedItems[deletedItems.length] = {
                      link: dateFolder.children[j].url,
                      dateStamp: date,
                    };
                  }
                }
              }
            }
            s.data.deletedItems = deletedItems;
            return 0;
          });
      } else {
        s.data.deletedItems = deletedItems;
        return 0;
      }
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
            if ((!s.data.hideVisited || !feed[f].visited) && (!checkDuplicate(feed[f], rss)) && (!checkDeleted(feed[f]) || !s.data.allowDelete)) {
              rss[r++] = feed[f];
            } else if (checkDeleted(feed[f]) && s.data.allowDelete) {
              s.deletedFeed[d++] = feed[f];
            }
          }
          return rss
            .sort(function(a, b) {
              return b.timeStamp - a.timeStamp;
            })
            .slice(0, s.rssFeed.numEntries); //Limit to avoid Performance problems in DOM
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

    function checkDeleted(entry) {
      var d = false;
      for (var f = 0; f < s.data.deletedItems.length; f++) {
        if (entry.link === s.data.deletedItems[f].link) {
          s.data.deletedItems[f].dateStamp = new Date().toISOString().slice(0, 10);
          d = true;
          break;
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
            result.feed = alignFeedData(data.data.responseData.feed);

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

    function alignFeedData(feed) {
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
        if (angular.isDefined(value.contentSnippet)) {
          value.contentSnippet = $sce.trustAsHtml(value.contentSnippet);
        }
      });
      return feed;
    }

    function consolidateDeleted() {
      var dateStamp = new Date();
      dateStamp.setUTCMonth(dateStamp.getUTCMonth() - 1);
      var limit = dateStamp.toISOString().slice(0, 10);

      var promise = getFeeds();

      promise = promise.then(function() {
        return saveDeletedItems();
      });

      if (angular.isDefined(s.data.sync) && s.data.sync.delItemsSync) {
        promise = promise.then(function() {
          var promises = [];
          var p = 0;
          var folders = s.delItemsFolders[0].children;
          for (var f = 0; f < folders.length; f++) {
            if (folders[f].title <= limit) {
              promises[p++] = bookmarkService.removeBookmarkTree(folders[f]);
            }
          }
          return promises;
        });
      }

      promise = promise.then(function() {
        var deletedItems = [];
        var i = 0;
        for (var d = 0; d < s.data.deletedItems.length; d++) {
          if (s.data.deletedItems[d].dateStamp > limit) {
            deletedItems[i++] = s.data.deletedItems[d];
          }
        }
        s.data.deletedItems = deletedItems;
        s.data.lastConsolidated = new Date().toISOString().slice(0, 10);
        return dataService.setData({
          rssFeed: s.data,
        });
      });

      return promise;
    }

    function deleteItem(item) {
      s.data.deletedItems.push({
        link: item.link,
        dateStamp: new Date().toJSON(),
      });
      // dataService.data.rssFeed = s.data;

      return saveDeletedItems();
    }

    function restoreDeletedItem(item) {
      // s.data = angular.copy(dataService.data.rssFeed);

      for (var i = 0; i < s.data.deletedItems.length; i++) {
        if (item.link === s.data.deletedItems[i].link) {
          s.data.deletedItems.splice(i, 1);
          i--; //move back one step and continue  
        }
      }

      if (angular.isDefined(s.data.sync) && s.data.sync.delItemsSync) {
        var search = {
          url: item.link,
        };
        return bookmarkService.getSubTree(s.data.sync.delItemsFolder)
          .then(function(delItemsFolders) {
            s.delItemsFolders = delItemsFolders;
            return bookmarkService.searchBookmarks(search);
          })
          .then(function(result) {
            var promises = [];
            var p = 0;
            for (var r = 0; r < result.length; r++) {
              if (result[r].url === search.url && s.delItemsFolders[0].children.findIndex(findCB, ['id', result[r].parentId]) > -1) {
                promises[p++] = bookmarkService.removeBookmarkTree(result[r]);
              }
            }
            return $q.all(promises);
          })
          .then(function() {
            return dataService.setData({
              rssFeed: s.data,
            });
          });

      } else {
        return dataService.setData({
          rssFeed: s.data,
        });
      }
    }

    function saveDeletedItems() {
      if (angular.isDefined(s.data.sync) && s.data.sync.delItemsSync) {
        return saveDeletedToSync()
          .then(function() {
            return dataService.setData({
              rssFeed: s.data,
            });
          });
      } else {
        return dataService.setData({
          rssFeed: s.data,
        });
      }
    }

    function saveDeletedToSync() {
      return createSyncDateFolders()
        .then(function() {
          return bookmarkService.getSubTree(s.data.sync.delItemsFolder);
        })
        .then(function(delItemsFolders) {
          var promises = [];
          s.delItemsFolders = delItemsFolders;
          for (var d = 0; d < s.data.deletedItems.length; d++) {
            promises[d] = saveToSync(s.data.deletedItems[d]);
          }
          return $q.all(promises);
        });

    }

    function createSyncDateFolders() {
      var folders = [];
      var promises = [];
      var f = 0;
      for (var d = 0; d < s.data.deletedItems.length; d++) {
        var folder = new Date(s.data.deletedItems[d].dateStamp).toISOString().slice(0, 10);
        if (folders.indexOf(folder) === -1) {
          promises[f] = createSyncDateFolder(folder);
          folders[f++] = folder;
        }
      }
      return $q.all(promises);
    }

    function createSyncDateFolder(folder) {
      var search = {
        title: folder,
      };
      return bookmarkService.searchBookmarks(search)
        .then(function(result) {
          var exists = false;
          for (var r = 0; r < result.length; r++) {
            if (result[r].title === folder && result[r].parentId === s.data.sync.delItemsFolder) {
              exists = true;
              break;
            }
          }
          if (!exists) {
            var newFolder = {
              title: folder,
              parentId: s.data.sync.delItemsFolder,
            };
            return bookmarkService.createBookmark(newFolder);
          } else {
            return 0;
          }
        });
    }

    function saveToSync(item) {
      var search = {
        url: item.link,
      };
      var folder = new Date(item.dateStamp).toISOString().slice(0, 10);

      return bookmarkService.searchBookmarks(search)
        .then(function(result) {
          var bkmrk = {
            parentId: s.delItemsFolders[0].children.find(findCB, ['title', folder]).id,
          };

          var existingFolder;
          var exist = false;
          for (var r = 0; r < result.length; r++) {
            if (result[r].url === search.url && s.delItemsFolders[0].children.findIndex(findCB, ['id', result[r].parentId]) > -1) {
              exist = true;
              existingFolder = s.delItemsFolders[0].children.find(findCB, ['id', result[r].parentId]).title;
              bkmrk.id = result[r].id;
              break;
            }
          }

          if (!exist) {
            var feedItem = s.feed.find(findCB, ['link', item.link]);
            bkmrk.url = item.link;
            if (feedItem) {
              bkmrk.title = feedItem.title;
            }
            return bookmarkService.createBookmark(bkmrk);
          } else {
            if (folder > existingFolder) {
              return bookmarkService.moveBookmark(bkmrk);
            } else {
              return 0;
            }
          }
        });
    }

    function findCB(element) {
      return element[this[0]] === this[1];
    }
  }
})();
