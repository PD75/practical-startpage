angular.module('ps.core', ['ps.core.options', 'ps.core.data', 'chrome', 'ngSemanticUi', 'dndLists']);

angular.module('ps.core')
  .config(function($compileProvider) {
    'use strict';
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file):|data:image\/|chrome:/);
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
  });
