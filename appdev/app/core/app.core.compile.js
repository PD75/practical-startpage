
angular.module('ps.core')
  .config(function($compileProvider) {
    'use strict';
    $compileProvider.debugInfoEnabled(false);
  });
