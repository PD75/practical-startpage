
angular.module('ps')
  .config(function($compileProvider) {
    'use strict';
    $compileProvider.debugInfoEnabled(false);
  });
