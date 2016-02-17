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
    vm.typeUrl = typeUrl;
    vm.closeForm = closeForm;
    activate();
    vm.modalInstance.modal('refresh');
    vm.modalEvents = {
      "onShow": activate(),
    };

    function activate() {
      vm.feed = {};
      vm.addButtonDisabled = true;
      vm.feeds = angular.copy(dataService.data.rssFeed);
      vm.saveButtonDisabled = true;
      vm.feedSample = [];
      vm.errorShow = false;
    }

    function checkFeedUrl(disabled) {
      if (!disabled) {
        rssFeedService.getFeed(vm.feed.url, 3)
          .then(function(data) {
            if (angular.isUndefined(data.message)) {
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
            } else {
              vm.errorMsg = data.message;
              vm.errorShow = true;
              vm.addButtonDisabled = false;
            }
            var duplicate = vm.feeds.filter(function(feed) {
              return feed.url === vm.feed.url;
            });
            if (angular.isDefined(duplicate) && duplicate.length > 0) {
              vm.addButtonDisabled = true;
            }
          });
      }
    }

    function typeUrl() {
      vm.errorShow = false;
      vm.feedSample = [];
      vm.addButtonDisabled = true;
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
      vm.modalInstance.modal('hide');
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
