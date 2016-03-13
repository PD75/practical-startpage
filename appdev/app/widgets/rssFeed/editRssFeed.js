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
    vm.save = save;

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
      if (angular.isDefined(dataService.data.rssFeed)) {
        vm.data = angular.copy(dataService.data.rssFeed);
      } else {
        vm.data = {};
      }
      if (angular.isUndefined(vm.data.feeds)) {
        vm.data.feeds = [];
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
            var duplicate = vm.data.feeds.filter(function(feed) {
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
        vm.data.feeds.push(vm.feed);
        save();
        vm.feed = {};
        vm.addButtonDisabled = true;
      }
    }

    function save() {
      var rssFeed = vm.data;
      if (angular.isDefined(dataService.data.rssFeed)) {
        rssFeed.deletedItems = dataService.data.rssFeed.deletedItems;
      }
      if (angular.isUndefined(vm.data.hideVisited)) {
        rssFeed.hideVisited = false;
      }
      if (angular.isUndefined(vm.data.allowDelete)) {
        rssFeed.allowDelete = false;
      }
      dataService.setData({
        rssFeed: rssFeed,
      });
    }

    function removeFeed(index) {
      vm.data.feeds.splice(index, 1);
      save();
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
