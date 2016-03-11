/*global X2JS */

(function() {
  "use strict";

  angular.module('ps.badges')
    .controller("gmailBadgeCtrl", gmailBadgeCtrl)
    .directive('psbGmail', gmailDirective);

  function gmailBadgeCtrl($http, $interval, $scope, $timeout, $sce, i18n, permissionService) {
    var vm = this;
    vm.locale = locale;
    vm.authorizePermissions = authorizePermissions;
    vm.popup = {
      popup: 'psb-gmail .ui.popup',
      hoverable: true,
      variation: 'basic',
    };
    vm.connection = true;
    activate();

    function activate() {
      permissionService
        .checkPermissions(['https://mail.google.com/'])
        .then(function(result) {
          vm.permission = result;
          if (result) {
            vm.unRead = '0';
            getMail();
            var stop = $interval(getMail, 300000); //Check every 5 min
            $scope.$on('$destroy', function() {
              $interval.cancel(stop);
            });
            // chrome.permissions.remove({ origins: ['https://mail.google.com/'] });
          } else {
            vm.unRead = '-1';
          }
        });

    }

    function getMail() {
      var conf = {
        method: 'GET',
        url: 'https://mail.google.com/mail/feed/atom',
        timeout: 5000,
        transformResponse: function(data) {
          var x2js = new X2JS();
          return x2js.xml_str2json(data);
        },
      };
      $http(conf)
        .then(function(result) {
          vm.connection = true;
          vm.unRead = result.data.feed.fullcount;

          vm.mail = result.data.feed;
          if (vm.unRead === "1") {
            vm.mail.entry = [result.data.feed.entry];
          }
          $timeout(function() {
            $scope.$apply();
          });
        }, function() {
          vm.connection = false;
          vm.unRead = '-1';
        });
    }

    function authorizePermissions() {
      permissionService
        .requestPermissions(['https://mail.google.com/'])
        .then(function() {
          activate();
        });
    }

    function locale(text, placeholders) {
      return $sce.trustAsHtml(i18n.get(text, placeholders));
    }
  }

  function gmailDirective() {
    return {
      restrict: 'E',
      templateUrl: 'app/badges/gmail/gmail.html',
      controller: 'gmailBadgeCtrl',
      controllerAs: 'vm',
      scope: {},
      bindToController: true,
    };
  }
})();
