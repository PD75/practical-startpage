(function() {
  "use strict";

  angular.module('ps.badges')
    .controller("gmailBadgeCtrl", gmailBadgeCtrl)
    .directive('psbGmail', gmailDirective);

  function gmailBadgeCtrl($http) {
    var vm = this;
    activate();

    function activate() {
      vm.unRead = 0;
      getMail();
    }

    function getMail() {
      var conf = {
        method: 'GET',
        url: 'https://mail.google.com/mail/feed/atom',
        transformResponse: function(data) {
          var x2js = new X2JS();
          return x2js.xml_str2json(data);
        },
      };
      $http(conf)
        .then(function(result) {
          var x = result.data;

          vm.unRead = x.feed.fullcount;
        });
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
