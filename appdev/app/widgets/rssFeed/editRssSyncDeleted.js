(function() {
  "use strict";

  angular
    .module('ps.widgets')
    .controller('EditRssSyncCtrl', EditRssSyncCtrl)
    .directive('psEditRssSync', EditRssSyncDirective);

  function EditRssSyncCtrl($timeout, $sce, dataService, bookmarkTreeService, rssFeedService, bookmarkService, i18n) {
    var vm = this;

    vm.locale = locale;
    vm.closeForm = closeForm;
    vm.createSync = createSync;
    vm.removeSync = removeSync;
    vm.moveSync = moveSync;
    vm.syncDeleted = syncDeleted;

    vm.treeData = [];
    vm.treeEvents = {
      "ready": showSyncFolderCB,
    };
    vm.treeConfig = {
      core: {
        multiple: false,
      },
      version: 1,
    };

    activate();

    function activate() {
      if (angular.isDefined(dataService.data.rssFeed)) {
        vm.data = angular.copy(dataService.data.rssFeed);
      } else {
        vm.data = {};
      }
      getTreeData();
    }

    function getTreeData() {
      bookmarkTreeService.getTreeData()
        .then(function(treeData) {
          vm.treeData = consolidateTreeData(treeData);
          vm.treeConfig.version++;

        });
    }

    function showSyncFolderCB() {
      var node = vm.treeInstance.jstree(true).get_node(vm.data.sync.delItemsFolder);
      if (node) {
        vm.treeInstance.jstree(true).open_node(node.parent);
        vm.treeInstance.jstree(true).select_node(node.parent);
      } else {
        vm.treeInstance.jstree(true).select_node(2);
      }
    }

    function consolidateTreeData(treeData) {
      var nodes = [];
      var n = 0;
      for (var t = 0; t < treeData.length; t++) {
        if (treeData[t].type !== 'link') {
          nodes[n] = {
            icon: treeData[t].icon,
            id: treeData[t].id,
            text: treeData[t].text,
            type: treeData[t].type,
          };
          if (angular.isDefined(treeData[t].children) && treeData[t].children.length > 0) {
            var children = consolidateTreeData(treeData[t].children);
            if (children.length > 0) {
              nodes[n].children = children;
            }
          }
          n++;
        }

      }
      return nodes;
    }

    function closeForm() {
      vm.modalInstance.modal('hide');
    }

    function syncDeleted() {
      if (!syncFolderExists()) {
        vm.data.sync = {
          delItemsSync: false,
        };
      }
      var promise = dataService.setData({
        rssFeed: vm.data,
      });
      if (vm.data.sync.delItemsSync) {
        promise.then(function() {
          rssFeedService.saveDeletedToSync();
        });
      }
    }

    function createSync() {
      if (!syncFolderExists()) {
        var parents = vm.treeInstance.jstree(true).get_selected();
        if (parents.length === 1) {
          var folder = {
            parentId: parents[0],
            title: 'RSSDeletedItemsSyncFolder',
          };
          bookmarkService.createBookmark(folder)
            .then(function(newFolder) {
              vm.data.sync = {
                delItemsFolder: newFolder.newId,
                delItemsSync: true,
              };
              return dataService.setData({
                rssFeed: vm.data,
              });
            })
            .then(function() {
              getTreeData();
            })
            .then(function() {
              rssFeedService.saveDeletedToSync();
            });

        }
      }
    }

    function removeSync() {
      var data = angular.copy(vm.data);
      var folder = {
        id: data.sync.delItemsFolder,
      };
      data.sync = {
        delItemsSync: false,
      };
      var promise = dataService.setData({
        rssFeed: data,
      });
      if (syncFolderExists()) {
        promise = promise.then(function() {
          return bookmarkService.removeBookmarkTree(folder);
        });
        vm.data = data;

        promise = promise.then(function() {
          return getTreeData();
        });
      }
    }

    function moveSync() {
      if (syncFolderExists()) {
        var newParent = vm.treeInstance.jstree(true).get_selected();
        var folder = vm.treeInstance.jstree(true).get_node(vm.data.sync.delItemsFolder);
        var oldParent = folder.parent;
        if (newParent) {
          if (oldParent !== newParent) {
            var node = {
              parentId: newParent[0],
              id: folder.id,
            };
            bookmarkService.moveBookmark(node)
              .then(function() {
                return dataService.setData({
                  rssFeed: vm.data,
                });
              })
              .then(function() {
                getTreeData();
              });
          }
        }
      }
    }

    function syncFolderExists() {
      var exists = false;
      if (angular.isDefined(vm.data.sync) && angular.isDefined(vm.data.sync.delItemsFolder)) {
        var node = vm.treeInstance.jstree(true).get_node(vm.data.sync.delItemsFolder);

        if (node && !angular.isArray(node)) {
          exists = true;
        }
      }
      return exists;
    }

    function locale(text, placeholders) {
      return $sce.trustAsHtml(i18n.get(text, placeholders));
    }
  }

  function EditRssSyncDirective() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/rssFeed/editRssSyncDeleted.html',
      controller: 'EditRssSyncCtrl',
      controllerAs: 'vm',
      scope: {
        modalData: '=psData',
        modalInstance: '=psInstance',
      },
      bindToController: true,
    };
  }
})();
