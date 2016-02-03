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
          angular.merge(s.data, response[0]);
        });
    }

    function setData(newData) {
      return storageService.setLocalData(newData)
        .then(function() {
          angular.merge(s.data, newData);
        });
    }

    function getDefaultData() {
      return $http.get('app/shared/defaultData.json');
    }


    function getManifest() {
      return storageService.getManifest();
    }
  });
