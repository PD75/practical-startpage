(function(angular) {
  "use strict";

  angular.module('ps.widgets')
    .controller("rssFeedCtrl", rssFeedCtrl)
    .directive('psRssFeed', RssFeedDirective);

  function rssFeedCtrl($http, rssFeedService, layoutService, dataService) {
    var vm = this;
    activate();

    function activate() {
      getFeeds();
      dataService.setOnChangeData('rssFeed', getFeeds);
      layoutService.setOnTabClick('rssFeed', getFeeds);
    }

    function getFeeds() {
      rssFeedService.getFeeds()
        .then(function(data) {
          vm.rss = data.slice(0,50); //Limit to avoid Perforamnce problems in DOM
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
