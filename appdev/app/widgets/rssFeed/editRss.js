(function(angular) {
  "use strict";

  angular.module('ps.widgets')
    .controller('EditRssCtrl', EditRssCtrl)
    .directive('psEditRss', EditRssDirective);

  function EditRssCtrl($sce, $timeout, rssFeedService, dataService, permissionService, i18n) {
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
    vm.tabClick = tabClick;
    vm.deleteItem = restoreDeleted;

    activate();

    function activate() {
      vm.tab = 'rssSyncDeleted';
      vm.feedTemplate = 'app/widgets/rssFeed/rssFeed.html';
      vm.settingsForm = 'app/widgets/rssFeed/editRssSyncDeleted.html';
      vm.manageFeedForm = 'app/widgets/rssFeed/editRssManageFeeds.html';
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
      vm.rss = [];
      vm.errorShow = false;
      permissionService
        .checkPermissions(['http://ajax.googleapis.com/'])
        .then(function(result) {
          vm.permission = result;
        });
      tabClick(vm.tab);
    }

    function tabClick(tab) {
      vm.tab = tab;
      if (tab === 'deletedItems') {
        vm.rss = rssFeedService.deletedFeed
          .sort(function(a, b) {
            return b.timeStamp - a.timeStamp;
          })
          .slice(0, 100); //Limit to avoid Performance problems in DOM
        vm.allowDelete = vm.data.allowDelete;
      } else {
        vm.allowDelete = false;
        vm.rss = [];
      }
      $timeout(function() {
        vm.modalInstance.modal('refresh');
      });
    }

    function restoreDeleted(e, item) {
      e.preventDefault();
      rssFeedService.restoreDeletedItem(item);
      rssFeedService.consolidateFeed()
        .then(function() {
          vm.rss = rssFeedService.deletedFeed
            .sort(function(a, b) {
              return b.timeStamp - a.timeStamp;
            })
            .slice(0, 100); //Limit to avoid Performance problems in DOM
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
              vm.rss = data.feed.entries;
              vm.addButtonDisabled = false;
            } else {
              vm.errorMsg = data.message;
              vm.errorShow = true;
              vm.addButtonDisabled = true;
              vm.rss = [];
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
      vm.rss = [];
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

  function EditRssDirective() {
    return {
      restrict: 'E',
      templateUrl: 'app/widgets/rssFeed/editRss.html',
      controller: 'EditRssCtrl',
      controllerAs: 'vm',
      scope: {
        modalData: '=psData',
        modalInstance: '=psInstance',
      },
      bindToController: true,
    };
  }
})(angular);
