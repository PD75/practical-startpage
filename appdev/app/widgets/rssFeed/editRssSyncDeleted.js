(function() {
  "use strict";

  angular
    .module('ps.widgets')
    .controller('EditRssSyncCtrl', EditRssSyncCtrl)
    .directive('psEditRssSync', EditRssSyncDirective);

  function EditRssSyncCtrl($timeout, $sce, bookmarkTreeService, dataService, rssFeedService, bookmarkService, i18n) {
    var vm = this;

    vm.locale = locale;
    vm.closeForm = closeForm;
    vm.createSync = createSync;
    vm.removeSync = removeSync;
    vm.moveSync = moveSync;
    vm.syncDeleted = syncDeleted;

    vm.treeData = [];
    vm.treeEvents = {
      "ready": showTreeReadyCB,
      "open_node": bookmarkTreeService.openNodeCB,
      "close_node": bookmarkTreeService.closeNodeCB,
    };
    vm.treeConfig = {
      core: {
        multiple: false,
      },
      types: {
        '#': {
          'valid_children': ['root'],
        },
        'root': {
          'valid_children': ['folder', 'link'],
        },
        'folder': {
          'valid_children': ['folder', 'link'],
        },
        'link': {
          'valid_children': [],
        },
      },
      plugins: ["types"],
      version: 1,
    };

    activate();

    function activate() {
      if (angular.isDefined(rssFeedService.data)) {
        vm.data = angular.copy(rssFeedService.data);
      } else {
        vm.data = {};
      }
      getTreeData();
    }

    function getTreeData() {
      bookmarkTreeService.getTreeData('rssDeleteSync')
        .then(function(treeData) {
          vm.treeData = treeData;
          vm.treeConfig.version++;
        });
    }

    function showTreeReadyCB() {
      var node = vm.treeInstance.jstree(true).get_node(vm.data.sync.delItemsFolder);
      if (node) {
        vm.treeInstance.jstree(true).open_node(node.parent);
        vm.treeInstance.jstree(true).select_node(node.parent);
      } else {
        vm.treeInstance.jstree(true).select_node(2);
      }
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
      dataService.data.rssFeed = vm.data;
      rssFeedService.consolidateDeleted();
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
              dataService.data.rssFeed = vm.data;
            })
            .then(function() {
              rssFeedService.consolidateDeleted();
            })
            .then(function() {
              getTreeData();
            });

        }
      }
    }

    function removeSync() {
      var promise = rssFeedService.consolidateDeleted();
      
      if (syncFolderExists()) {
        promise = promise.then(function() {
          return bookmarkService.removeBookmarkTree({
            id: vm.data.sync.delItemsFolder,
          });
        });
      }
      
      promise = promise.then(function() {
          vm.data.sync = {
            delItemsSync: false,
          };
          return dataService.setData({
            rssFeed: vm.data,
          });
        })
        .then(function() {
          return getTreeData();
        });
      return promise;
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
