/*eslint camelcase: 0*/
angular.module('ps.widgets')
  .factory('editBookmarksService', function($q, dataService, bookmarkService, bookmarkConstant) {
    "use strict";

    return {
      getTreeConfig: getTreeConfig,
      deleteNodes: deleteNodes,
      editNode: editNode,
      newFolder: newFolder,
      getTreeData: getTreeData,
      saveAllBookmarkChanges: saveAllBookmarkChanges,
    };

    function editNode(bookmarkTree) {
      var tree = bookmarkTree.jstree(true);
      var nodes = tree.get_selected(true);
      if (nodes.length === 1) {
        tree.edit(nodes[0]);
      }
    }

    function getTreeConfig(getTree, editUrl) {
      var treeConfig = editBookmarkConfig(getTree, editUrl);
      angular.merge(treeConfig, bookmarkConstant.treeConfig);
      return treeConfig;
    }

    function newFolder(parent, bookmarkTree) {
      var tree = bookmarkTree.jstree(true);
      var nodeData = {
        text: 'New Folder',
        icon: 'folder icon',
        type: 'folder',
      };
      var newNode = tree.create_node(parent, nodeData, 0);
      tree.edit(newNode);
    }

    function deleteNodes(bookmarkTree) {
      var tree = bookmarkTree.jstree(true);
      var selNodes = tree.get_selected(true);
      tree.delete_node(selNodes);
      // bookmarkTree.search($('#editbmrkSearch').val());
    }

    function getTreeData() {
      return bookmarkService.getBookmarksTree()
        .then(function(treeData) {
          return treeData;
        });
    }

    function editBookmarkConfig(getTree, editUrl) {
      return {
        'core': {
          'check_callback': true,
        },
        'dnd': {
          'copy': false,
          'is_draggable': function(nodes) {
            var draggable = true;
            for (var i = 0; i < nodes.length; i++) {
              if (nodes[i].type === 'root') {
                draggable = false;
              }
            }
            return draggable;
          },
          'open_timeout': 250,
        },
        "contextmenu": {
          items: function(node) {
            return getBookmarkMenu(node, getTree, editUrl);
          },
        },
        'plugins': ["search", "state", "dnd", "types", "contextmenu"],

      };
    }

    function getBookmarkMenu(node, getTree, editUrl) {
      var menu = {};
      var nodes = getTree().jstree(true).get_selected(true);
      if (nodes.length === 1) {
        if ((node.type === 'link' || node.type === 'folder')) {
          menu.editTitle = {
            "separator_before": false,
            "label": "Edit",
            "action": function() {
              editNode(getTree());
            },
            "icon": "edit icon",
          };
        }
        if (node.type === 'link') {
          menu.editUrl = {
            "separator_before": false,
            "label": "Edit url",
            "action": function() {
              editUrl();
            },
            "icon": "world icon",
          };
        }
        if (node.type !== 'link') {
          menu.new = {
            "separator_before": false,
            "label": "New folder",
            "action": function() {
              newFolder(node, getTree());
            },
            "icon": "folder outline icon",
          };
        }
      }
      if (node.type === 'link' || node.type === 'folder') {
        menu.delete = {
          "separator_before": false,
          "label": "Delete",
          "action": function() {
            deleteNodes(getTree());
          },
          "icon": "remove icon",
        };
      }
      return menu;
    }

    function saveAllBookmarkChanges(log) {
      // Creating an empty initial promise that always resolves itself.
      var promise = $q.all([]);

      // Iterating list of items.
      angular.forEach(log, function(item, key) {
        promise = promise.then(function(response) {
          var treeLog = response;
          if (key === 0) {
            treeLog = log;
          }
          return saveBookmarkChange(treeLog, key);
        });
      });
      //resolve final promise
      return promise.then(function() {
        return 1;
      });
    }

    function saveBookmarkChange(log, index) {
      switch (log[index].operation) {
        case 'update':
          return bookmarkService.updateBookmark(log[index])
            .then(function() {
              return log;
            });
        case 'move':
          return bookmarkService.moveBookmark(log[index])
            .then(function() {
              return log;
            });
        case 'create':
          return bookmarkService.createBookmark(log[index])
            .then(function(node) {
              //Loop through all the rest of the entries and update the id to the new id.
              for (var i = index + 1; i < log.length; i++) {
                if (angular.isDefined(log[i].id) && log[i].id === node.oldId) {
                  log[i].id = node.newId;
                }
                if (angular.isDefined(log[i].parentId) && log[i].parentId === node.oldId) {
                  log[i].parentId = node.newId;
                }
              }
              return log;
            });
        case 'removeTree':
          return bookmarkService.removeBookmarkTree(log[index])
            .then(function() {
              return log;
            });
        default:
          return log;
      }
    }
  });
