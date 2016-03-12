(function(angular) {
  "use strict";

  angular.module('ps.widgets')
    .controller('EditRssFeedCtrl', EditRssFeedCtrl)
    .directive('psEditRssFeed', EditRssFeedDirective);

  function EditRssFeedCtrl($sce, rssFeedService, dataService, permissionService, i18n) {
    var vm = this;
    vm.checkFeedUrl = checkFeedUrl;
    vm.addFeed = addFeed;
    vm.removeFeed = removeFeed;
    vm.checkFeed = checkFeed;
    vm.typeUrl = typeUrl;
    vm.closeForm = closeForm;
    vm.authorizePermissions = authorizePermissions;
    vm.locale = locale;

    activate();

    function activate() {
      vm.modalInstance.modal('refresh');
      vm.modalEvents = {
        "onShow": initiate(),
      };
      initiate();
    }

    function initiate() {
      vm.feed = {};
      vm.addButtonDisabled = true;
      vm.feeds = [];
      if (angular.isDefined(dataService.data.rssFeed) && angular.isDefined(dataService.data.rssFeed.feeds)) {
        vm.feeds = angular.copy(dataService.data.rssFeed.feeds);
      }
      vm.feedSample = [];
      vm.errorShow = false;
      permissionService
        .checkPermissions(['http://ajax.googleapis.com/'])
        .then(function(result) {
          vm.permission = result;
        });
    }

    function authorizePermissions() {
      permissionService
        .requestPermissions(['http://ajax.googleapis.com/'])
        .then(function(result) {
          vm.permission = result;
        });
    }

    function checkFeedUrl(disabled) {
      if (!disabled) {
        rssFeedService.getFeed(vm.feed.url, 3)
          .then(function(data) {
            if (angular.isUndefined(data.message)) {
              vm.feedSample = data.feed.entries;
              vm.addButtonDisabled = false;
            } else {
              vm.errorMsg = data.message;
              vm.errorShow = true;
              vm.addButtonDisabled = true;
              vm.feedSample = [];
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
      var rssFeed = dataService.data.rssFeed;
      if (!vm.addButtonDisabled) {
        vm.feeds.push(vm.feed);
        rssFeed.feeds = vm.feeds;
        dataService.setData({
          rssFeed: rssFeed,
        });
        vm.feed = {};
        vm.addButtonDisabled = true;
      }
    }

    function removeFeed(index) {
      vm.feeds.splice(index, 1);
      dataService.setData({
        rssFeed: vm.feeds,
      });
    }

    function closeForm() {
      vm.modalInstance.modal('hide');
    }

    function locale(text, placeholders) {
      return $sce.trustAsHtml(i18n.get(text, placeholders));
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
    };
  }
})(angular);
