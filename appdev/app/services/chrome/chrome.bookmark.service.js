(function(angular) {
  'use strict';
  /*eslint camelcase: 0*/
  angular.module('chrome').factory('bookmarkService', bookmarkService);

  function bookmarkService($q) {

    return {
      getBookmarksTree: getBookmarksTree,
      updateBookmark: updateBookmark,
      moveBookmark: moveBookmark,
      createBookmark: createBookmark,
      removeBookmarkTree: removeBookmarkTree,
      searchBookmarks: searchBookmarks,
      getSubTree: getSubTree,
    };

    function searchBookmarks(searchObject) {
      var deferred = $q.defer();
      chrome.bookmarks.search(searchObject, function(response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    }

    function getBookmarksTree(treeType) {
      var deferred = $q.defer();
      chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
        deferred.resolve(mapTreeNodes(bookmarkTreeNodes[0].children, 1, treeType));
      });
      return deferred.promise;
    }

    function getSubTree(folderId) {
      var deferred = $q.defer();
      chrome.bookmarks.getSubTree(folderId, function(response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    }

    function updateBookmark(bookmark) {
      var deferred = $q.defer();
      var node = {};
      node.title = bookmark.title;
      node.url = bookmark.url;
      chrome.bookmarks.update(bookmark.id, node, function(response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    }

    function moveBookmark(bookmark) {
      var deferred = $q.defer();
      var node = {};
      node.parentId = bookmark.parentId;
      if (angular.isDefined(bookmark.index)) {
        if (bookmark.oldParentId === bookmark.parentId && bookmark.index > bookmark.oldIndex) {
          node.index = bookmark.index + 1; //Chrome needs higher index for insert then jstree
        } else {
          node.index = bookmark.index;
        }
      }
      chrome.bookmarks.move(bookmark.id, node, function(response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    }

    function createBookmark(bookmark) {
      var deferred = $q.defer();
      delete bookmark.operation;
      var node = {
        'oldId': bookmark.id,
      };
      delete bookmark.id;
      chrome.bookmarks.create(bookmark, function(response) {
        node.newId = response.id;
        deferred.resolve(node);
      });
      return deferred.promise;
    }

    function removeBookmarkTree(bookmark) {
      var deferred = $q.defer();
      chrome.bookmarks.removeTree(bookmark.id, function(response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    }

    //Internal Functions
    function mapTreeNodes(bookmarkNodes, level, treeType) {
      var jsTreeNodes = [];
      var j = 0;
      for (var i = 0; i < bookmarkNodes.length; i++) {
        if (bookmarkNodes[i].children) {
          jsTreeNodes[j] = {
            id: bookmarkNodes[i].id,
            text: bookmarkNodes[i].title,
            children: mapTreeNodes(bookmarkNodes[i].children, level + 1, treeType),
          };
          if (level > 1) {
            jsTreeNodes[j].type = 'folder';
            jsTreeNodes[j].icon = 'folder icon';
          } else {
            jsTreeNodes[j].type = 'root';
            jsTreeNodes[j].icon = 'folder outline icon';
          }
          j++;
        } else if (treeType !== 'rssDeleteSync') {
          jsTreeNodes[j] = {
            id: bookmarkNodes[i].id,
            text: bookmarkNodes[i].title,
            icon: 'chrome://favicon/' + bookmarkNodes[i].url,
            a_attr: {
              'href': bookmarkNodes[i].url,
            },
            type: 'link',
          };
          j++;
        }
        //
      }
      return jsTreeNodes;
    }

  }
})(angular);
