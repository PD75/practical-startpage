(function(angular) {
  'use strict';

  angular.module('ps.core')
    .controller('LayoutCtrl', LayoutCtrl)
    .directive('psLayout', layoutDirective);

  function LayoutCtrl($scope, $timeout, dataService, layoutService) {
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
          checkVersion();
          getStyles();
          getLayout();
          setTabClasses();
          setHelpPopup();
        });
      //set watch if layout changes
      dataService.setOnChangeData('layout', function() {
        getLayout();
        setTabClasses();
        setHelpPopup();
        $timeout(function() {
          $scope.$apply();
        });
      });
    }

    function activateEditor() {
      vm.modalUrl = 'app/widgets/bookmarkTree/editBookmarks.html';
      vm.modalData = {
        onHide: function() {
          layoutService.runOnTabClick('bookmarkTree');
        },
        closable: false,
      };
      vm.showModal = true;
    }
    //Tab functions
    function onClickTab(tab, colIndex) {
      var data = {};
      vm.activeTabs[colIndex] = tab.label;
      if (tab.delegate) {
        vm.activeTabs[colIndex + 1] = tab.label;
        vm.columns[colIndex].cover = true;
      } else {
        vm.columns[colIndex].cover = false;
      }

      data.activeTabs = vm.activeTabs;
      setTabClasses();
      setHelpPopup();
      dataService.setData(data);
      layoutService.runOnTabClick(tab.label);
    }


    function setTabClasses() {
      var c = 0;
      var t = 0;
      for (c = 0; c < vm.columns.length; c++) {
        for (t = 0; t < vm.columns[c].tabs.length; t++) {
          vm.columns[c].tabs[t].classes = [];
          if (vm.activeTabs[c] === vm.columns[c].tabs[t].label) {
            vm.columns[c].tabs[t].active = true;
            vm.columns[c].tabs[t].classes.push('active');
            if (angular.isDefined(vm.columns[c].tabs[t].edit)) {
              vm.columns[c].edit = true;
            } else {
              vm.columns[c].edit = false;
            }
          } else {
            vm.columns[c].tabs[t].active = false;
          }
          if (angular.isDefined(vm.columns[c].tabs[t].delegate) && vm.columns[c].tabs[t].delegate) {
            vm.columns[c].tabs[t].classes.push('delegate');
          }
        }
        //Cover Tabs
        if (vm.columns[c].cover) {
          vm.columns[c].coverClasses.push('active');
        } else {
          vm.columns[c].coverClasses = [];
        }

      }
    }

    function getStyles() {
      vm.styles = dataService.data.styles;
      vm.priMenuClasses = [vm.styles.primaryCol];
      if (vm.styles.primaryInv) {
        vm.priMenuClasses[1] = "inverted";
      }
      vm.secMenuClasses = [vm.styles.secondaryCol];
      if (vm.styles.secondaryInv) {
        vm.secMenuClasses[1] = "inverted";
      }
    }

    //Data functions
    function getLayout() {
      vm.layout = dataService.data.layout;
      vm.widgets = dataService.data.widgets;
      vm.bottomMenu = dataService.data.bottomMenu;
      var c, t;
      if (angular.isDefined(dataService.data.activeTabs)) {
        vm.activeTabs = dataService.data.activeTabs;
      } else {
        vm.activeTabs = [];
        for (c = 0; c < vm.layout.length; c++) {
          vm.activeTabs[c] = vm.layout[c].tabs[0];
        }
      }
      for (c = 0; c < vm.layout.length; c++) {
        vm.columns[c] = {
          title: vm.layout[c].title,
          label: vm.layout[c].label,
          tabs: [],
        };
        for (t = 0; t < vm.layout[c].tabs.length; t++) {
          vm.columns[c].tabs[t] = vm.widgets[vm.layout[c].tabs[t]];
          vm.columns[c].tabs[t].label = vm.layout[c].tabs[t];
        }
      }
    }

    function setHelpPopup() {
      for (var i = 0; i < vm.columns.length; i++) {
        vm.columns[i].helpPopup = {
          'html': '<div class="header">' + vm.widgets[vm.activeTabs[i]].title + '</div><div class="description">' + vm.widgets[vm.activeTabs[i]].help + '</div>',
          'position': 'bottom right',
          'variation': 'basic tiny',
        };
      }
    }

    function checkVersion() {
      var manifest = dataService.getManifest();
      if (angular.isUndefined(dataService.data.version) || dataService.data.version !== manifest.version) {
        vm.layout = dataService.getDefaultData('layout').layout;
        dataService.clearData('layout');
        $timeout(function() {
          vm.modalUrl = 'app/core/whatsNew.html';
          vm.modalData = {};
          vm.showModal = true;
        });
        dataService.setData({
          'version': manifest.version,
        });
      }
    }
  }

  function layoutDirective() {
    return {
      restrict: 'E',
      templateUrl: 'app/core/layout/layout.html',
      controller: 'LayoutCtrl',
      controllerAs: 'Layout',
    };
  }
})(angular);
