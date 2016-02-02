/*eslint camelcase: 0*/
(function(angular) {
  "use strict";

  angular.module('PracticalStartpage')
    .controller('editBookmarkUrlCtrl', editBookmarkUrlCtrl)
    .directive('psEditBookmarkUrl', editBookmarkUrlDirective);

  function editBookmarkUrlCtrl() {
    var vm = this;
    vm.closeNoSave = closeNoSave;
    vm.saveClose = saveClose;
    vm.keydownCB = keydownCB;
    vm.clickCB = clickCB;
    vm.keypressCB = keypressCB;

    vm.urlValue = vm.urlData.node.a_attr.href;
    setStyle();

    function setStyle() {
      var pos = vm.urlData.tree.find('#' + vm.urlData.node.id + '_anchor').position();
      pos.top = pos.top + vm.urlData.tree.find('#' + vm.urlData.node.id).outerHeight();
      var width = vm.urlData.tree.width() - pos.left;
      vm.style = {
        top: pos.top + 'px',
        left: pos.left + 'px',
        right: 'auto',
        bottom: 'auto',
        width: width,
      };
    }

    function saveChanges() {
      if (vm.urlValue !== vm.urlData.node.a_attr.href) {
        var nodeChange = {
          id: vm.urlData.node.id,
          operation: 'update',
          url: vm.urlValue,
        };
        vm.urlData.tree.jstree(true).get_node(nodeChange.id).a_attr.href = nodeChange.url;
        vm.urlData.tree.jstree(true).get_node(nodeChange.id, true).children('.jstree-anchor').attr('href', nodeChange.url);
        vm.log.push(nodeChange);
      }
    }

    function closeNoSave(e) {
      vm.urlData.newUrl = vm.urlData.node.a_attr.href;
      e.stopImmediatePropagation();
      e.preventDefault();
    }

    function saveClose(e) {
      saveChanges();
      vm.urlData.newUrl = vm.urlValue;
      e.stopImmediatePropagation();
      e.preventDefault();
    }

    function keydownCB(e) {
      var key = e.which;
      if (key === 27) {
        closeNoSave(e);
      }
      if (key === 13) {
        saveClose(e);
      }
      if (key === 37 || key === 38 || key === 39 || key === 40 || key === 46 || key === 32) {
        e.stopImmediatePropagation();
      }

    }

    function clickCB(e) {
      e.stopImmediatePropagation();
    }

    function keypressCB(e) {
      if (e.which === 13) {
        return false;
      }
    }
  }

  function editBookmarkUrlDirective($timeout) {
    return {
      restrict: 'E',
      scope: {
        urlData: '=psData',
        log: '=psLog',
      },
      templateUrl: 'app/components/bookmarkTree/editBookmarkUrl.html',
      controller: 'editBookmarkUrlCtrl',
      controllerAs: 'url',
      bindToController: true,
      link: function(s, e) {
        $timeout(function() {
          e[0].children[0].focus();
        });
      },
    };
  }

})(angular);
