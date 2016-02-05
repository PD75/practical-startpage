angular.module('PracticalStartpage')
  .service('dataService', function($http, $q, storageService, dataServiceWidgets) {
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
          s.data = response[1];
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
      return {
        styles: getDefaultStyles(),
        layout: getDefaultLayout(),
        widgets: dataServiceWidgets.getWidgets(),
      };
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
        title: "Left",
        label: "left",
        tabs: ['bookmarkTree'],
        items: 2,
      }, {
        title: "Middle",
        label: "middle",
        tabs: ['quicklinks', 'history', 'topSites'],
        items: 4,
      }, {
        title: "Right",
        label: "right",
        tabs: ['closedTabs', 'chromeApps'],
        items: 2,
      }];
    }
  });
