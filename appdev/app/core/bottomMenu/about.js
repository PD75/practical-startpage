(function(angular) {
  "use strict";

  angular.module('ps.core')
    .controller('AboutCtrl', AboutCtrl)
    .directive('psAbout', aboutDirective);

  function AboutCtrl(i18n) {
    var vm = this;

    activate();

    function activate() {
      vm.data = {
        title: i18n.get('About'),
        slogan: i18n.get('c_ps_slogan'),
        libraries:i18n.get('c_about_libraries'),
        links: {
          title: i18n.get('Links'),
          data: [{
            url: 'https:/' + '/chrome.google.com/webstore/detail/ikjalccfdoghanieehppljppanjlmkcf',
            icon: 'bookmark',
          }, {
            url: 'mailto:' + '?to=&subject=Check%20out%20this%20Practical%20chrome%20browser%20Startpage&body=https:/' + '/chrome.google.com/webstore/detail/ikjalccfdoghanieehppljppanjlmkcf',
            icon: 'mail',
          }, {
            url: 'https:/' + '/github.com/PD75/practical-startpage',
            icon: 'github',
          }, {
            url: 'https:/' + '/groups.google.com/forum/#!forum/practical-startpage',
            icon: 'bug',
          }, {
            url: 'https:/' + '/waffle.io/PD75/practical-startpage',
            icon: 'line chart',
          }],
        },
      };
      for (var i = 0; i < 5; i++) {
        vm.data.links.data[i].title = i18n.get('c_about_title_' + i);
        vm.data.links.data[i].text = i18n.get('c_about_text_' + i);
      }
    }
  }

  function aboutDirective() {
    return {
      restrict: 'A',
      controller: 'AboutCtrl',
      controllerAs: 'vm',
    };
  }
})(angular);
