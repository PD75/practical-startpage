(function(angular) {
  'use strict';

  angular.module('ps.widgets')
    .controller('editBookmarksCtrl', editBookmarksCtrl)
    .directive('psEditBookmarks', editBookmarksDirective);

  function editBookmarksCtrl($window, $timeout, $compile, $scope, editBookmarksService, bookmarkTreeService, i18n, bookmarkConstant) {
    var vm = this;
    vm.searchTree = searchTree;
    vm.resetSearch = resetSearch;
    vm.keydownCB = keydownCB;
    vm.locale = locale;

    vm.treeEvents = {
      "ready": readyCB,
      "activate_node": activateNodeCB,
      "open_node": bookmarkTreeService.openNodeCB,
      "close_node": bookmarkTreeService.closeNodeCB,
      "deselect_all": setEditButtons,
      "changed": setEditButtons,
      "move_node": moveNodeCB,
      "delete_node": deleteNodeCB,
      "rename_node": renameNodeCB,
      "create_node": createNodeCB,
    };
    vm.buttonPress = {
      "edit": editNode,
      "editUrl": editUrl,
      "newFolder": newFolder,
      "delete": deleteNodes,
      "undoAll": refreshTree,
      "save": saveChanges,
      "saveClose": saveClose,
      "close": closeNoSave,
    };

    //Intialize
    vm.treeData = [];
    vm.treeConfig = {};
    vm.searchString = '';
    vm.editBookmarkLog = [];
    vm.treeInstance = {};
    vm.buttons = bookmarkConstant.editButtons;
    vm.activeButtons = {
      "edit": "disabled",
      "editUrl": "disabled",
      "newFolder": "disabled",
      "delete": "disabled",
      "undoAll": "disabled",
      "save": "disabled",
      "saveClose": "disabled",
      "close": "",
    };
    activate();

    function activate() {
      vm.segmentHeight = {
        'height': ($window.innerHeight - 200) + 'px',
      };
      vm.treeConfig = editBookmarksService.getTreeConfig(getTree, editUrl);
      getTreeData();
      $timeout(function() {
        vm.modalInstance.modal('refresh');
      });
    }

    function getTreeData() {
      editBookmarksService.getTreeData()
        .then(function(treeData) {
          vm.treeData = treeData;
          vm.treeConfig.version++;
        });
    }

    function getTree() {
      return vm.treeInstance;
    }

    function searchTree() {
      vm.treeInstance.jstree().search(vm.searchString);
    }

    function resetSearch() {
      vm.searchString = '';
      vm.treeInstance.jstree().clear_search();
    }

    // CallBacks from JSTree
    function readyCB() {
      vm.treeInstance.jstree(true).deselect_all();
      resetSearch();
      vm.editBookmarkLog = [];
      setEditButtons();
    }

    function activateNodeCB() {
      var nodes = vm.treeInstance.jstree().get_selected(true);
      if (nodes.length > 1) {
        angular.forEach(nodes, function(node) {
          if (node.type === 'root') {
            vm.treeInstance.jstree().deselect_node(node); //prevent any changes to root by blockng selection
          }
        });
      }
    }

    function moveNodeCB(e, data) {
      var node = {};
      node.operation = 'move';
      node.id = data.node.id;
      node.parentId = data.parent;
      node.oldParentId = data.old_parent;
      node.index = data.position;
      node.oldIndex = data.old_position;
      vm.editBookmarkLog[vm.editBookmarkLog.length] = node;
      setEditButtons();
    }

    function deleteNodeCB(e, data) {
      var node = {};
      node.operation = 'removeTree';
      node.id = data.node.id;
      vm.editBookmarkLog[vm.editBookmarkLog.length] = node;
    }

    function renameNodeCB(obj, text) {
      if (text.text !== text.old) {
        var node = {};
        node.id = text.node.id;
        node.title = text.node.text;
        node.operation = 'update';
        vm.editBookmarkLog[vm.editBookmarkLog.length] = node;
      }
      setEditButtons();
    }

    function createNodeCB(e, obj) {
      var node = {};
      node.operation = 'create';
      node.parentId = obj.parent;
      node.index = 0;
      node.title = obj.node.text;
      node.id = obj.node.id;
      vm.editBookmarkLog[vm.editBookmarkLog.length] = node;
      setEditButtons();
    }

    function setEditButtons() {
      angular.forEach(vm.activeButtons, function(value, key) {
        vm.activeButtons[key] = "disabled";
      });
      vm.activeButtons.close = "";
      var nodes = vm.treeInstance.jstree().get_selected(true);
      if (nodes.length === 1) {
        var node = nodes[0];
        if (nodes.length === 1) {
          if ((node.type === 'link' || node.type === 'folder')) {
            vm.activeButtons.edit = "";
          }
          if (node.type === 'link') {
            vm.activeButtons.editUrl = "";
          }
          if (node.type !== 'link') {
            vm.activeButtons.newFolder = "";
          }
        }
      }
      if (nodes.length > 0 && (nodes[0].type === 'link' || nodes[0].type === 'folder')) {
        vm.activeButtons.delete = "";
      }
      if (vm.editBookmarkLog.length > 0) {
        vm.activeButtons.undoAll = "";
        vm.activeButtons.save = "";
        vm.activeButtons.saveClose = "";
      }
      $timeout(function() {
        $scope.$digest();
      });
    }

    //Buttons
    function editNode() {
      editBookmarksService.editNode(vm.treeInstance);
    }

    function editUrl() {
      var tree = vm.treeInstance.jstree(true);
      var nodes = tree.get_selected(true);

      if (nodes.length === 1) {
        vm.editUrlData = {
          "tree": vm.treeInstance,
          "node": nodes[0],
        };
        var nodeElement = vm.treeInstance.find('#' + nodes[0].id);
        var newScope = $scope.$new();
        var drctv = $compile('<ps-edit-bookmark-url ps-data="vm.editUrlData" ps-log="vm.editBookmarkLog"> </ps-edit-bookmark-url>')(newScope);
        nodeElement.append(drctv);
        var listener = $scope.$watch(function() {
          return vm.editUrlData.newUrl;
        }, function(newVal) {
          if (angular.isDefined(newVal)) {
            newScope.$destroy();
            drctv.remove();
            listener();
            setEditButtons();
          }

        });
      }
    }

    function newFolder() {
      var nodes = vm.treeInstance.jstree(true).get_selected(true);
      editBookmarksService.newFolder(nodes[0], vm.treeInstance);
    }

    function deleteNodes() {
      editBookmarksService.deleteNodes(vm.treeInstance);
    }

    function refreshTree() {
      vm.treeConfig.version++;
    }

    function saveChanges() {
      editBookmarksService.saveAllBookmarkChanges(vm.editBookmarkLog)
        .then(function() {
          getTreeData();
        });
    }

    function saveClose() {
      saveChanges();
      closeNoSave();
    }

    function closeNoSave() {
      vm.modalInstance.modal('hide');
    }

    function keydownCB(e) {
      //F2 - Edit
      if (e.which === 113) {
        var tree = vm.treeInstance.jstree(true);
        var selNodes = tree.get_selected(true);
        if (selNodes.length === 1) {
          if (e.shiftKey) {
            editUrl();
          } else {
            tree.edit(selNodes[0]);
          }
        }
        e.preventDefault();
      }
      //Del - Delete
      if (e.which === 46) {
        if (e.target.classList[0] !== 'jstree-rename-input') {
          deleteNodes();
          e.preventDefault();
        }
      }
      //Ctrl+S - Save
      if (e.ctrlKey && e.shiftKey === false && e.which === 83) {
        if (vm.editBookmarkLog.length > 0) {
          saveChanges();
          e.preventDefault();
        }
      }
      //Ctrl+Shift+S - Save and Close
      if (e.ctrlKey && e.shiftKey && e.which === 83) {
        if (vm.editBookmarkLog.length > 0) {
          saveClose();
          e.preventDefault();
        }
      }
      //Ctrl+Shift+Z - Undo all
      if (e.ctrlKey && e.shiftKey && e.which === 90) {
        refreshTree();
      }
      //Esc - Exit no save
      if (e.which === 27) {
        closeNoSave();
        e.preventDefault();
      }
    }

    function locale(text, placeholders) {
      return i18n.get(text, placeholders);
    }
  }

  function editBookmarksDirective() {
    return {
      restrict: 'E',
      scope: {
        modalData: '=psData',
        modalInstance: '=psInstance',
      },
      replace: true,
      templateUrl: 'app/widgets/bookmarkTree/editBookmarks.html',
      controller: 'editBookmarksCtrl',
      controllerAs: 'vm',
      bindToController: true,
    };
  }
})(angular);
