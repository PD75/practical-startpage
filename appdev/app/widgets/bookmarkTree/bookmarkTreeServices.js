/*eslint camelcase: 0*/
angular.module('ps.widgets')
  .factory('bookmarkTreeService', function(dataService, bookmarkService, bookmarkConstant, urlService) {
    "use strict";

    return {
      getTreeConfig: getTreeConfig,
      getTreeData: getTreeData,
      openInNewTab: openInNewTab,
      openNodeCB: openNodeCB,
      closeNodeCB: closeNodeCB,
    };

    function openNodeCB(e, data) {
      if (data.node.type === 'folder') {
        angular.element(e.target).jstree().set_icon(data.node, 'open folder icon');
      } else {
        angular.element(e.target).jstree().set_icon(data.node, 'open folder outline icon');
      }
    }

    function closeNodeCB(e, data) {
      if (data.node.type === 'folder') {
        angular.element(e.target).jstree().set_icon(data.node, 'folder icon');
      } else {
        angular.element(e.target).jstree().set_icon(data.node, 'folder outline icon');
      }
    }

    function getTreeConfig() {
      var treeConfig = bookmarkTreeConfig();
      angular.merge(treeConfig, bookmarkConstant.treeConfig);
      return treeConfig;
    }

    function getTreeData(treeType) {
      return bookmarkService.getBookmarksTree(treeType)
        .then(function(treeData) {
          return treeData;
        });
    }

    function openInNewTab(url) {
      urlService.openInNewTab(url);
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
              urlService.openInNewTab(node.a_attr.href);
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
            urlService.openInNewTab(children[i].url);
          }
        }
      });
    }
  });
