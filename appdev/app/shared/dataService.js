angular.module('PracticalStartpage')
  .service('dataService', function($http, $q, storageService) {
    'use strict';

    var s = this;

    s.getData = getData;
    s.setData = setData;
    s.getManifest = getManifest;
    s.data = {};

    function getData(objName) {
      return $q
        .all([
          storageService.getLocalData(),
          getDefaultData(),
        ])
        .then(function(response) {
          s.data = response[1].data;
          s.data.styles = getDefaultStyles();
          s.data.layout = getDefaultLayout();
          angular.merge(s.data, response[0]);
        });
    }

    function setData(newData) {
      return storageService.setLocalData(newData)
        .then(function() {
          angular.merge(s.data, newData);
        });
    }

    function getManifest() {
      return storageService.getManifest();
    }

    function getDefaultData() {
      return $http.get('app/shared/defaultData.json');
    }

    function getDefaultStyles() {
      return {
        primaryCol: "purple",
        primaryInv: true,
        secondaryCol: "black",
        secondaryInv: true,
      };
    }

    function getDefaultLayout() {
      return [{
        colTitle: "left",
        tabs: ['bookmarkTree'],
      }, {
        colTitle: "middle",
        tabs: ['quicklinks', 'history', 'topSites'],
      }, {
        colTitle: "right",
        tabs: ['closedTabs', 'chromeApps'],
      }];
    }
  });
