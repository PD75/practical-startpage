(function(angular) {
  "use strict";

  angular.module('ps.widgets')
    .controller('EditRssFeedCtrl', EditRssFeedCtrl)
    .directive('psEditRssFeed', EditRssFeedDirective);

  function EditRssFeedCtrl(rssFeedService, dataService) {
    var vm = this;
    vm.checkFeedUrl = checkFeedUrl;
    vm.addFeed = addFeed;
    activate();

    function activate() {
      vm.feed = {};
      vm.addButtonDisabled = true;
      vm.feeds = [];
      vm.saveButtonDisabled = true;
    }

    function checkFeedUrl(disabled) {
      if (!disabled) {
        rssFeedService.getFeed(vm.feed.url, 3)
          .then(function(data) {
            vm.feed.entries = data.entries;
            vm.addButtonDisabled = false;
          });
      }
    }

    function addFeed(disabled) {
      var ico = vm.feed.url.split('/');
      vm.feed.icon = ico[0] + '//' + ico[2] + '/favicon.ico';
      vm.feeds.push(vm.feed);
      vm.feed = {};
      vm.addButtonDisabled = true;
      vm.saveButtonDisabled = false;
    }

    function saveFeeds(disabled) {
      dataService.setData({
        rssFeed: vm.feeds,
      });
      vm.saveButtonDisabled = true;

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
