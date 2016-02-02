angular.module('chromeModule')
  .config(function($compileProvider) {
    'use strict';
    $compileProvider.debugInfoEnabled(false);
  });
