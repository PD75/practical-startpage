angular.module('ps.core')
  .service('dataService', function($http, $q, storageService, widgetConstants) {
    'use strict';

    var s = this;

    s.getData = getData;
    s.setData = setData;
    s.getManifest = getManifest;
    s.getDefaultLayout = getDefaultLayout;
    s.setDataChangeCB = setDataChangeCB;
    s.data = {
      dataChangeCB: {},
      layout: [],
      styles: [],
      widgets: [],
      activeTabs: [],
    };

    activate();

    function activate() {
      s.dataCB = {};
      storageService.setDataCB(runDataChangeCB);
    }

    function getData(objName) {
      return $q
        .all([
          storageService.getLocalData(),
          getDefaultData(),
        ])
        .then(function(response) {
          s.data = response[1];
          angular.forEach(response[0], function(value, key) {
            s.data[key] = value;
          });
        });
    }

    function setData(newData) {
      angular.forEach(newData, function(value, key) {
        s.data[key] = value;
      });
      storageService.setLocalData(newData);
    }

    function getManifest() {
      return storageService.getManifest();
    }

    function getDefaultData() {
      var data = {
        styles: getDefaultStyles(),
        layout: getDefaultLayout(),
        widgets: widgetConstants(),
      };
      return data;
    }

    function setDataChangeCB(key, fnCB) {
      if (angular.isUndefined(s.dataCB[key])) {
        s.dataCB[key] = [];
      }
      s.dataCB[key].push(fnCB);
    }

    function runDataChangeCB(changes) {
      var f = 0;
      angular.forEach(changes, function(value, key) {
        s.data[key] = value.newValue;
        if (angular.isDefined(s.dataCB) && angular.isDefined(s.dataCB[key])) {
          var x = 1;
          for (f = 0; f < s.dataCB[key].length; f++) {
            s.dataCB[key][f]();
          }
        }
      });

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
