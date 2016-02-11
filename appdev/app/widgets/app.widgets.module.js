angular.module('ps.widgets', ['ps.widgets.constants', 'chrome', 'ngJsTree', 'ngSemanticUi']);

angular.module('ps.widgets')
  .config(function($compileProvider) {
    'use strict';
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file):|data:image\/|chrome:/);
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
  });
