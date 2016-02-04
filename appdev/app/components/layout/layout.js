(function(angular) {
  'use strict';

  angular.module('PracticalStartpage')
    .controller('LayoutCtrl', LayoutCtrl)
    .directive('psLayout', layoutDirective);

  function LayoutCtrl($scope, $timeout, dataService) {
    var vm = this;
    vm.onClickTab = onClickTab;
    vm.activateEditor = activateEditor;

    vm.columns = [];
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
          vm.columns[colIndex].tabRefreshed++;
        },
        closable: false,
      };
      vm.showModal = true;
    }
    //Tab functions
    function onClickTab(tab, colIndex) {
      var data = {};
      vm.columns[colIndex].activeTab = tab.title;
      vm.columns[colIndex].tabRefreshed++;
      if (tab.delegate) {
        vm.columns[colIndex].cover = true;
        vm.columns[colIndex + 1].activeTab = tab.title;
        vm.columns[colIndex + 1].tabRefreshed++;
      } else {
        vm.columns[colIndex].cover = false;
      }

      data.columns = vm.columns;
      setTabClasses();
      setHelpPopup();
      dataService.setData(data);
    }

    function setTabClasses() {
      var i = 0;
      var j = 0;
      for (i = 0; i < vm.columns.length; i++) {
        for (j = 0; j < vm.columns[i].tabs.length; j++) {
          vm.columns[i].tabs[j].classes = [];
          if (vm.columns[i].activeTab === vm.columns[i].tabs[j].title) {
            vm.columns[i].tabs[j].classes.push('active');
            if (angular.isDefined(vm.columns[i].tabs[j].edit)) {
              vm.columns[i].edit = true;
            } else {
              vm.columns[i].edit = false;
            }
          }
          if (angular.isDefined(vm.columns[i].tabs[j].delegate) && vm.columns[i].tabs[j].delegate) {
            vm.columns[i].tabs[j].classes.push('delegate');
          }
        }
        //Cover Tabs
        if (vm.columns[i].cover) {
          vm.columns[i].coverClasses.push('active');
        } else {
          vm.columns[i].coverClasses = [];
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
      vm.columns = dataService.data.columns;
      vm.styles = dataService.data.styles;
      vm.bottomMenu = dataService.data.bottomMenu;
    }

    function setHelpPopup() {
      var popup = {};
      for (var i = 0; i < vm.columns.length; i++) {
        var actTab = vm.columns[i].activeTab;
        var tabs = vm.columns[i].tabs;
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
        vm.columns[i].helpPopup = popup;
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
