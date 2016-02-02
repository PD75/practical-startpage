(function(angular) {
  'use strict';

  angular.module('PracticalStartpage')
    .controller('LayoutCtrl', LayoutCtrl)
    .directive('psLayout', layoutDirective);

  function LayoutCtrl($scope, $timeout, dataService) {
    var vm = this;
    vm.onClickTab = onClickTab;
    vm.activateEditor = activateEditor;

    vm.layout = [];
    vm.popup = {};
    vm.showModal = false;
    vm.bottomMenu = [];

    activate();

    function activate() {
      dataService.getData()
        .then(function() {
          getLayout();
          setMenuClasses();
          setTabClasses();
          setHelpPopup();
          checkVersion();
        });
    }

    function activateEditor(col, colIndex) {
      vm.modalUrl = 'app/components/bookmarkTree/editBookmarks.html';
      vm.modalData = {
        onHide: function() {
          vm.layout[colIndex].tabRefreshed++;
        },
        closable: false,
      };
      vm.showModal = true;
    }
    //Tab functions
    function onClickTab(tab, colIndex) {
      var data = {};
      vm.layout[colIndex].activeTab = tab.title;
      vm.layout[colIndex].tabRefreshed++;
      if (tab.delegate) {
        vm.layout[colIndex].cover = true;
        vm.layout[colIndex + 1].activeTab = tab.title;
        vm.layout[colIndex + 1].tabRefreshed++;
      } else {
        vm.layout[colIndex].cover = false;
      }

      data.layout = vm.layout;
      setTabClasses();
      setHelpPopup();
      dataService.setData(data);
    }

    function setTabClasses() {
      var i = 0;
      var j = 0;
      for (i = 0; i < vm.layout.length; i++) {
        for (j = 0; j < vm.layout[i].tabs.length; j++) {
          vm.layout[i].tabs[j].classes = [];
          if (vm.layout[i].activeTab === vm.layout[i].tabs[j].title) {
            vm.layout[i].tabs[j].classes.push('active');
            if (angular.isDefined(vm.layout[i].tabs[j].edit)) {
              vm.layout[i].edit = true;
            } else {
              vm.layout[i].edit = false;
            }
          }
          if (angular.isDefined(vm.layout[i].tabs[j].delegate) && vm.layout[i].tabs[j].delegate) {
            vm.layout[i].tabs[j].classes.push('delegate');
          }
        }
        //Cover Tabs
        if (vm.layout[i].cover) {
          vm.layout[i].coverClasses.push('active');
        } else {
          vm.layout[i].coverClasses = [];
        }

      }
    }

    function setMenuClasses() {
      vm.priMenuClasses = [dataService.data.styles.primaryCol];
      if (dataService.data.styles.primaryInv) {
        vm.priMenuClasses[1] = "inverted";
      }
      vm.secMenuClasses = [dataService.data.styles.secondaryCol];
      if (dataService.data.styles.secondaryInv) {
        vm.secMenuClasses[1] = "inverted";
      }
    }

    //Data functions
    function getLayout() {
      vm.layout = dataService.data.layout;
      vm.styles = dataService.data.styles;
      vm.bottomMenu = dataService.data.bottomMenu;
    }

    function setHelpPopup() {
      var popup = {};
      for (var i = 0; i < vm.layout.length; i++) {
        var actTab = vm.layout[i].activeTab;
        var tabs = vm.layout[i].tabs;
        for (var j = 0; j < tabs.length; j++) {
          if (tabs[j].title === actTab) {
            popup = {
              'html': '<div class="header">' + actTab + '</div><div class="description">' + tabs[j].help + '</div>',
              'position': 'bottom right',
              'title': actTab,
              'variation': 'basic tiny',
            };
          }
        }
        vm.layout[i].helpPopup = popup;
      }
    }

    function checkVersion() {
      var manifest = dataService.getManifest();
      if (angular.isUndefined(dataService.data.version) || dataService.data.version !== manifest.version) {
        $timeout(function() {
          vm.modalUrl = 'app/components/revision.html';
          vm.modalData = {};
          vm.showModal = true;
        });
        dataService.setData({
          'version': manifest.version,
        });
        if (angular.isDefined(dataService.data.bookmarkid)) {
          var data = {};
          data.quicklinks = [dataService.data.bookmarkid];
          dataService.setData(data);
        }
      }
    }
  }

  function layoutDirective() {
    return {
      restrict: 'E',
      templateUrl: 'app/components/layout/layout.html',
      controller: 'LayoutCtrl',
      controllerAs: 'Layout',
    };
  }
})(angular);
