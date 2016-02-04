angular.module('PracticalStartpage', ['ngJsTree', 'chromeModule', 'ngSemanticUi', 'dndLists', 'PracticalStartpage.options']);

angular.module('PracticalStartpage')
  .config(function($compileProvider) {
    'use strict';
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file):|data:image\/|chrome:/);
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
  });
