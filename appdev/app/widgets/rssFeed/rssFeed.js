(function(angular) {
  "use strict";

  angular.module('ps.widgets')
    .controller("rssFeedCtrl", rssFeedCtrl)
    .directive('psRssFeed', RssFeedDirective);

  function rssFeedCtrl($http, $timeout, rssFeedService, layoutService, dataService) {
    var vm = this;
    vm.clickCB = clickCB;
    vm.deleteItem = deleteItem;
    activate();

    function activate() {
      if (layoutService.isActive('rssFeed')) {
        getFeeds();
      }
      dataService.setOnChangeData('rssFeed', getFeeds);
      layoutService.setOnTabClick('rssFeed', getFeeds);
    }

    function getFeeds() {
      rssFeedService.getFeeds()
        .then(function(data) {
          vm.rss = data.feed;
          vm.allowDelete = data.allowDelete;
        });
    }

    function clickCB() {
      $timeout(function() {
        rssFeedService.consolidateFeed()
          .then(function(data) {
            vm.rss = data;
          });
      }, 1000);
    }
    function deleteItem(e, item) {
      e.preventDefault();
      rssFeedService.deleteItem(item);
      rssFeedService.consolidateFeed()
        .then(function(data) {
          vm.rss = data;
        });
    }
  }

  function RssFeedDirective() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/rssFeed/rssFeed.html',
      controller: 'rssFeedCtrl',
      controllerAs: 'vm',
      scope: {
        tab: '=psTab',
        col: '=psCol',
        style: '=psStyle',
      },
      bindToController: true,
    };
  }
})(angular);
