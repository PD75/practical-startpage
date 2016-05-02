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

    function getBookmarksTree() {
      return getBookmarks()
        .then(function(bookmarkTreeNodes) {
          return mapTreeNodes(bookmarkTreeNodes[0].children, 1);
        });
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
    function getBookmarks() {
      var deferred = $q.defer();
      chrome.bookmarks.getTree(function(response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    }

    function mapTreeNodes(bookmarkNodes, level) {
      var jsTreeNodes = [];
      for (var i = 0; i < bookmarkNodes.length; i++) {
        jsTreeNodes[i] = {};
        jsTreeNodes[i].id = bookmarkNodes[i].id;
        jsTreeNodes[i].text = bookmarkNodes[i].title;
        if (bookmarkNodes[i].children) {
          jsTreeNodes[i].children = mapTreeNodes(bookmarkNodes[i].children, level + 1);
          if (level > 1) {
            jsTreeNodes[i].type = 'folder';
            jsTreeNodes[i].icon = 'folder icon';
          } else {
            jsTreeNodes[i].type = 'root';
            jsTreeNodes[i].icon = 'folder icon';
          }
        } else {
          jsTreeNodes[i].icon = 'chrome://favicon/' + bookmarkNodes[i].url;
          jsTreeNodes[i].a_attr = {
            'href': bookmarkNodes[i].url,
          };
          jsTreeNodes[i].type = 'link';
        }
        //
      }
      return jsTreeNodes;
    }

  }
})(angular);
