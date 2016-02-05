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
      vm.columns[colIndex].activeTab = tab.label;
      vm.columns[colIndex].tabRefreshed++;
      if (tab.delegate) {
        vm.columns[colIndex].cover = true;
        vm.columns[colIndex + 1].activeTab = tab.label;
        vm.columns[colIndex + 1].tabRefreshed++;
      } else {
        vm.columns[colIndex].cover = false;
      }
      vm.layout[colIndex].activeTab = tab.label;

      data.layout = vm.layout;
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
          if (vm.columns[i].activeTab === vm.columns[i].tabs[j].label) {
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
      // vm.columns = dataService.data.columns;
      vm.layout = dataService.data.layout;
      vm.styles = dataService.data.styles;
      vm.widgets = dataService.data.widgets;
      vm.bottomMenu = dataService.data.bottomMenu;
      // var widgets = dataService.data.widgets;
      var c, t;
      for (c = 0; c < vm.layout.length; c++) {
        vm.columns[c] = {
          title: vm.layout[c].title,
          label: vm.layout[c].label,
          tabs: [],
          refreshed: 0,
          colTitle: vm.layout[c].title, //to be removed
          tabRefreshed: 0, //to be removed
        };
        if (angular.isDefined(vm.layout[c].activeTab)) {
          vm.columns[c].activeTab = vm.layout[c].activeTab;
        } else {
          vm.columns[c].activeTab = vm.layout[c].tabs[0];
        }
        for (t = 0; t < vm.layout[c].tabs.length; t++) {
          var y = vm.layout[c].tabs[t];
          vm.columns[c].tabs[t] = vm.widgets[vm.layout[c].tabs[t]];
          vm.columns[c].tabs[t].label = vm.layout[c].tabs[t];
        }
      }
    }

    function setHelpPopup() {
      for (var i = 0; i < vm.columns.length; i++) {
        var activeTab = vm.columns[i].activeTab;
        var tabs = vm.columns[i].tabs;
        vm.columns[i].helpPopup = {
          'html': '<div class="header">' + vm.widgets[activeTab].title + '</div><div class="description">' + vm.widgets[activeTab].help + '</div>',
          'position': 'bottom right',
          'variation': 'basic tiny',
        };
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
