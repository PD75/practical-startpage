/*eslint camelcase: 0*/
(function(angular) {
  "use strict";

  angular.module('PracticalStartpage')
    .controller('bookmarkTreeCtrl', bookmarkTreeCtrl)
    .directive('psBrowserBookmarkTree', browserBookmarkTreeDirective);

  function bookmarkTreeCtrl($window, $document, $timeout, bookmarkTreeService) {
    var vm = this;
    vm.getTreeData = getTreeData;
    vm.getTreeConfig = getTreeConfig;
    vm.searchTree = searchTree;
    vm.resetSearch = resetSearch;

    vm.mouseDownCB = mouseDownCB;
    vm.clickCB = clickCB;

    vm.treeEvents = {
      "ready": readyCB,
      "activate_node": activateNodeCB,
      "open_node": openNodeCB,
      "close_node": closeNodeCB,
    };
    //Intialize
    vm.treeData = [];
    vm.treeConfig = {
      version: 1,
    };
    vm.searchString = '';
    activate();

    function activate() {
      vm.getTreeData();
      vm.treeConfig = getTreeConfig();
    }

    function getTreeData() {
      bookmarkTreeService.getTreeData()
        .then(function(treeData) {
          angular.copy(treeData, vm.treeData);
          vm.treeConfig.version++;
        });
    }

    function getTreeConfig() {
      return bookmarkTreeService.getTreeConfig();
    }

    function searchTree() {
      vm.treeInstance.jstree().search(vm.searchString);
    }

    function resetSearch() {
      vm.searchString = '';
      vm.treeInstance.jstree().clear_search();
    }

    function readyCB() {
      vm.treeInstance.jstree(true).deselect_all();
    }

    function activateNodeCB(e, data) {
      vm.treeInstance.jstree().deselect_node(data.node);
      if (data.node.type !== 'link') {
        if (vm.treeInstance.jstree().is_closed(data.node)) {
          vm.treeInstance.jstree().open_node(data.node);
        } else {
          vm.treeInstance.jstree().close_node(data.node);
        }
      }
    }

    function openNodeCB(e, data) {
      vm.treeInstance.jstree().set_icon(data.node, 'open folder icon');
    }

    function closeNodeCB(e, data) {
      vm.treeInstance.jstree().set_icon(data.node, 'folder icon');
    }

    function mouseDownCB(e) {
      var node = {};
      node.id = e.target.parentNode.id;
      node = vm.treeInstance.jstree().get_node(node.id);
      if (node.type === 'link') {
        if (e.which === 1 && e.ctrlKey === false) {
          $window.location.href = node.a_attr.href;
        }
        if ((e.which === 1 && e.ctrlKey === true) || (e.which === 2)) {
          bookmarkTreeService.openInNewTab(node.a_attr.href);
        }
      }
    }

    function clickCB(e) {
      var node = {};
      node.tagName = e.target.tagName;
      if (e.which === 2 && node.tagName === 'A') {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }

  function browserBookmarkTreeDirective() {
    return {
      restrict: 'E',
      scope: {
        tab: '=psTab',
        col: '=psCol',
        style: '=psStyle',
      },
      templateUrl: 'app/components/bookmarkTree/bookmarkTree.html',
      controller: 'bookmarkTreeCtrl',
      controllerAs: 'vm',
      bindToController: true,
      link: link,
    };

    function link(scope, el, attr, ctrl) {
      scope.$watch(function() {
        return ctrl.col.refreshed;
      }, function() {
        if (ctrl.col.activeTab === ctrl.tab.label) {
          ctrl.getTreeData();
        }
      });
    }
  }

})(angular);
