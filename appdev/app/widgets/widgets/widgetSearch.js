(function(angular) {
  'use strict';

  angular.module('ps.core')
    .controller('WidgetSearchCtrl', WidgetSearchCtrl)
    .directive('psWidgetSearch', SearchDirective);

  function WidgetSearchCtrl($timeout, dataService, i18n) {
    var vm = this;
    vm.searching = searching;
    vm.resetSearch = resetSearch;
    vm.activateSearch = activateSearch;
    vm.popupData = {
      on: 'click',
      closable: false,
      exclusive: true,
      position: 'top right',
      inline: true,
      duration: 50,
      onHidden: function() {
        $timeout(function() {
          vm.searchString = '';
          searching();
        });
      },
      onVisible: function() {
        vm.inputField.focus();
      },
    };
    vm.searchReset = 'hidden';
    vm.searchString = '';
    vm.searchColor = dataService.data.styles.primaryCol;
    vm.searchText = i18n.get('Search') + '...';

    function searching() {
      if (vm.searchString.length === 0) {
        vm.searchReset = 'hidden';
      } else {
        vm.searchReset = '';
      }
      if (angular.isDefined(vm.cb)) {
        $timeout(function() {
          vm.cb();
        });
      }
    }

    function activateSearch() {
      $timeout(function() {
        vm.inputField.focus();
      });
    }

    function resetSearch() {
      vm.searchString = '';
      searching();
    }
  }

  function SearchDirective() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/widgets/widgetSearch.html',
      controller: 'WidgetSearchCtrl',
      controllerAs: 'vm',
      scope: {
        cb: '&psSearchCb',
        searchString: '=?psSearchString',
      },
      bindToController: true,
      link: link,
    };

    function link(scope, el, attr, ctrl) {
      ctrl.inputField = el.find('input');
    }
  }
})(angular);
