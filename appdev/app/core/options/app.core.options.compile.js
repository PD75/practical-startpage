
angular.module('ps.core.options')
  .config(function($compileProvider) {
    'use strict';
    $compileProvider.debugInfoEnabled(false);
  });
