/*eslint camelcase: 0*/
angular.module('ps.widgets')
  .constant('bookmarkConstant', {
    treeConfig: {
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
    },

    editButtons: [{
      label: 'edit',
      icon: 'edit',
    }, {
      label: 'editUrl',
      icon: 'world',
    }, {
      label: 'newFolder',
      icon: 'folder outline',
    }, {
      label: 'delete',
      icon: 'erase',
    }, {
      label: 'undoAll',
      icon: 'undo',
    }, {
      label: 'save',
      icon: 'inverse save',
    }, {
      label: 'saveClose',
      icon: 'save',
    }, {
      label: 'close',
      icon: 'remove',
    }],
  });
