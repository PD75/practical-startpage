(function(angular) {
  "use strict";

  angular.module('ps.widgets')
    .controller('EditRssFeedCtrl', EditRssFeedCtrl)
    .directive('psEditRssFeed', EditRssFeedDirective);

  function EditRssFeedCtrl(rssFeedService, layoutService) {
    var vm = this;
    vm.checkFeedUrl = checkFeedUrl;
    acctivate();

    function activate() {
      vm.feed = {};
      vm.addButtonClass = 'disabled';
      vm.feeds = [];
      vm.saveButtonClass = 'disabled';


    }

    function checkFeedUrl(disabled) {
      if (!disabled) {
        rssFeedService.getFeed(vm.feed.url, 3)
          .then(function(data) {
            vm.feed.entries = data.entries;
            vm.addButtonClass = '';
          });
      }
    }

    function addFeed(disabled) {
      var x = 1;
    }

    function saveFeeds(disabled) {
      var x = 1;

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
