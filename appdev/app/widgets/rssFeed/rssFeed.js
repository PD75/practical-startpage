(function(angular) {
  "use strict";

  angular.module('ps.widgets')
    .controller("rssFeedCtrl", rssFeedCtrl)
    .directive('psRssFeed', RssFeedDirective);

  function rssFeedCtrl($http, rssFeedService, layoutService, dataService) {
    var vm = this;
    activate();

    function activate() {
      if (layoutService.isActive('rssFeed')) {
        getFeeds();
      }
      dataService.setOnChangeData('rssFeed', getFeeds);
      layoutService.setOnTabClick('rssFeed', getFeeds);
    }

    function getFeeds() {
      rssFeedService.getFeeds(false,50)
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
