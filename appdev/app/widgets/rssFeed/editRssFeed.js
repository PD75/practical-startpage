(function(angular) {
  "use strict";

  angular.module('ps.widgets')
    .controller('EditRssFeedCtrl', EditRssFeedCtrl)
    .directive('psEditRssFeed', EditRssFeedDirective);

  function EditRssFeedCtrl(rssFeedService, dataService) {
    var vm = this;
    vm.checkFeedUrl = checkFeedUrl;
    vm.addFeed = addFeed;
    vm.saveFeeds = saveFeeds;
    vm.checkFeed = checkFeed;
    activate();

    function activate() {
      vm.feed = {};
      vm.addButtonDisabled = true;
      vm.feeds = [];
      vm.feeds = dataService.data.rssFeed;
      vm.saveButtonDisabled = true;
    }

    function checkFeedUrl(disabled) {
      if (!disabled) {
        vm.feedSample = [];
        rssFeedService.getFeed(vm.feed.url, 3)
          .then(function(data) {
            vm.feedSample = data.feed.entries;
            vm.addButtonDisabled = false;
            var ico;
            if (angular.isDefined(data.feed.link)) {
              ico = data.feed.link.split('/');
              vm.feed.icon = ico[0] + '//' + ico[2] + '/favicon.ico';
            } else {
              ico = data.feed.feedUrl.split('/');
              vm.feed.icon = ico[0] + '//' + ico[2] + '/favicon.ico';
            }
          });
      }
    }

    function checkFeed(feed) {
      angular.copy(feed, vm.feed);
      checkFeedUrl(false);
    }

    function addFeed() {
      if (!vm.addButtonDisabled) {

        vm.feeds.push(vm.feed);
        vm.feed = {};
        vm.addButtonDisabled = true;
        vm.saveButtonDisabled = false;
      }
    }

    function saveFeeds() {
      if (!vm.saveButtonDisabled) {
        dataService.setData({
          rssFeed: vm.feeds,
        });
        vm.saveButtonDisabled = true;
      }

    }

    function closeForm() {
      var x = 1;

    }
  }

  function EditRssFeedDirective() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/rssFeed/editRssFeed.html',
      controller: 'EditRssFeedCtrl',
      controllerAs: 'vm',
      scope: {
        modalData: '=psData',
        modalInstance: '=psInstance',
        modalEvents: '=psEvents',
      },
      bindToController: true,
      link: function(s, e, a, c) {
        var x = 1;
      },
    };
  }
})(angular);
