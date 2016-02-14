(function(angular) {
  "use strict";

  angular.module('ps.widgets')
    .controller("rssFeedCtrl", rssFeedCtrl)
    .directive('psRssFeed', RssFeedDirective);

  function rssFeedCtrl($http, historyService, layoutService) {
    var vm = this;
    activate();

    function activate() {
      getFeed();
      layoutService.setOnTabClick('rssFeed', getFeed);
    }

    function getFeed() {
      var url = 'http://rss.cnn.com/rss/cnn_topstories.rss';
      var url = 'http://feeds.feedburner.com/TechCrunch';
      var url = 'http://www.dn.se/rss/nyheter/';
      $http.get('http:' + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=30&q=' + encodeURIComponent(url))
        .then(function(data) {
          vm.feed = data.data.responseData.feed;
          angular.forEach(vm.feed.entries, function(value) {
            var s = value.link.split('/');
            value.icon = s[0]+'//'+s[2]+'/favicon.ico';
          });
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
