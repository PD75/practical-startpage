angular.module('ps.widgets', ['chrome', 'ngJsTree', 'ngSemanticUi', 'dndLists']);

angular.module('ps.widgets')
  .config(function($compileProvider) {
    'use strict';
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file):|data:image\/|chrome:/);
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
  });
