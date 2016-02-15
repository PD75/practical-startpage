(function(angular) {
  "use strict";

  angular.module('ps.widgets')
    .controller("rssFeedCtrl", rssFeedCtrl)
    .directive('psRssFeed', RssFeedDirective);

  function rssFeedCtrl($http, rssFeedService, layoutService) {
    var vm = this;
    activate();

    function activate() {
      getFeed();
      layoutService.setOnTabClick('rssFeed', getFeed);
    }

    function getFeed() {
      rssFeedService.getFeeds()
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
