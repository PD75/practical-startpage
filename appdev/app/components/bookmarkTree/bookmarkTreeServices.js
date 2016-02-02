/*eslint camelcase: 0*/
angular.module('PracticalStartpage')
  .factory('bookmarkTreeService', function(dataService, bookmarkService, commonBookmarkService) {
    "use strict";

    return {
      getTreeConfig: getTreeConfig,
      getTreeData: getTreeData,
      openInNewTab: openInNewTab,
    };

    function getTreeConfig() {
      var treeConfig = bookmarkTreeConfig();
      angular.merge(treeConfig, commonBookmarkService.getTreeConfig());
      return treeConfig;
    }

    function getTreeData() {
      return bookmarkService.getBookmarksTree()
        .then(function(treeData) {
          return treeData;
        });
    }

    function openInNewTab(url) {
      bookmarkService.openInNewTab(url);
    }

    function bookmarkTreeConfig() {
      return {
        'plugins': ["search", "state", "contextmenu", "types"],
        "contextmenu": {
          items: function(node) {
            return getBookmarkMenu(node);
          },
          select_node: false,
        },
      };
    }

    function getBookmarkMenu(node) {
      if (node.type !== 'link') {
        return {
          "openall": {
            "separator_before": false,
            "label": "Open all links",
            "action": function() {
              openAllLinks(node.id);
            },
            "icon": "mail forward icon",
          },
          "quicklinks": {
            "separator_before": false,
            "label": "Use for Quick Links",
            "action": function() {
              quickLinkNode(node.id);
            },
            "icon": "external link icon",
          },
        };
      } else {
        return {
          "newtab": {
            "separator_before": false,
            "label": "Open in new tab",
            "action": function() {
              bookmarkService.openInNewTab(node.a_attr.href);
            },
            "icon": "mail forward icon",
          },
        };
      }
    }

    function quickLinkNode(id) {
      var data = {};
      data.quicklinks = [id];
      dataService.setData(data);
    }

    // Bookmark tree code
    function openAllLinks(nodeId) {
      chrome.bookmarks.getChildren(nodeId, function(children) {
        for (var i = 0; i < children.length; i++) {
          if (angular.isDefined(children[i].url)) {
            bookmarkService.openInNewTab(children[i].url);
          }
        }
      });
    }
  });
