(function() {
  "use strict";

  angular
    .module('ps.widgets')
    .controller('EditRssSyncCtrl', EditRssSyncCtrl)
    .directive('psEditRssSync', EditRssSyncDirective);

  function EditRssSyncCtrl($sce, bookmarkTreeService, i18n) {
    var vm = this;

    vm.locale = locale;
    vm.closeForm = closeForm;

    vm.treeData = [];
    vm.treeConfig = {
      core: {
        multiple: false,
      },

      version: 1,
    };

    activate();

    function activate() {
      bookmarkTreeService.getTreeData()
        .then(function(treeData) {
          vm.treeData = consolidateTreeData(treeData);
          vm.treeConfig.version++;
        });
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
          if (angular.isDefined(treeData[t].children && treeData[t].children.length < 0)) {
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
