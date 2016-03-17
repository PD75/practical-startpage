(function(angular) {
  'use strict';

  angular.module('chrome')
    .factory('sharedService', sharedService);

  function sharedService() {
    return {
      populateList: populateList,
    };

    function populateList(list) {
      var j = 0;
      var newList = [];
      for (var i = 0; i < list.length; i++) {
        if (angular.isDefined(list[i]) && angular.isDefined(list[i].url)) {
          newList[j] = {
            id: list[i].id,
            title: getTitle(list[i]),
            altTitle: getAltTitle(list[i]),
            icon: getIcon(list[i]),
          };
          if (angular.isDefined(list[i].lastVisitTime)) {
            newList[j].timeStamp = new Date();
            newList[j].timeStamp.setTime(list[i].lastVisitTime);
          }
          if (angular.isDefined(list[i].url)) {
            newList[j].url = list[i].url;
          }
          if (angular.isDefined(list[i].id)) {
            newList[j].id = list[i].id;
          }
          j++;
        }
      }
      return newList;
    }

    function getTitle(item) {
      var title;
      if (angular.isUndefined(item.title) || item.title === '') {
        title = '(No title)';
      } else {
        title = item.title;
      }
      return title;
    }

    function getAltTitle(item) {
      var title;
      if (angular.isUndefined(item.title) || item.title === '') {
        title = item.url;
      } else {
        title = item.title;
      }
      return title;
    }

    function getIcon(item) {
      var icon;
      if (angular.isUndefined(item.icon)) {
        icon = 'chrome://favicon/' + item.url;
      } else {
        icon = item.icon;
      }
      return icon;
    }
  }
})(angular);
