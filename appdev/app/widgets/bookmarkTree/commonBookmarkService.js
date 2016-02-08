/*eslint camelcase: 0*/
angular.module('PracticalStartpage')
  .factory('commonBookmarkService', function() {
    "use strict";

    return {
      getTreeConfig: getTreeConfig,
    };

    function getTreeConfig() {
      return {
        'core': {
          'animation': 100,
        },
        version: 1,
        "search": {
          "show_only_matches": true,
        },
        'types': {
          '#': {
            valid_children: ['root'],
          },
          'root': {
            valid_children: ['folder', 'link'],
          },
          'folder': {
            valid_children: ['folder', 'link'],
          },
          'link': {
            valid_children: [],
          },
        },
      };
    }

  });
