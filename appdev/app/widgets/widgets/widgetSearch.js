(function(angular) {
  'use strict';

  angular.module('ps.core')
    .controller('WidgetSearchCtrl', WidgetSearchCtrl)
    .directive('psWidgetSearch', SearchDirective);

  function WidgetSearchCtrl() {
    var vm = this;
    vm.popupData = {
      on: 'click',
      position: 'top right',
      html: '<div class="ui fluid icon input" ng-keyup="vm.searchTree()" style="width:100px">    <input placeholder="Search..." type="text" ng-model="vm.searchString">    <i class="remove link icon transition" ng-class="{hidden:vm.searchString.length===0}" ng-click="vm.resetSearch()"></i> </div>',
    };


  }

  function SearchDirective() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/widgets/widgetSearch.html',
      controller: 'WidgetSearchCtrl',
      controllerAs: 'searchCtrl',
    };
  }
})(angular);
