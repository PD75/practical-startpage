angular.module('ps.widgets.constants', [])
  .constant('widgetConstants', function() {
    'use strict';
    return {
      bookmarkTree: {
        icon: "star",
        directive: "browser-bookmark-tree",
        edit: {
          type: "url",
          url: "app/widgets/bookmarkTree/editBookmarks.html",
        },
      },
      chromeApps: {
        icon: "grid layout ",
        directive: "browser-apps",
      },
      closedTabs: {
        icon: "undo",
        directive: "browser-closed-tabs",
      },
      history: {
        icon: "history",
        directive: "browser-history",
      },
      quicklinks: {
        icon: "external link",
        directive: "browser-quicklinks",
      },
      rssFeed: {
        icon: "rss",
        directive: "rss-feed",
        edit: {
          type: "directive",
          directive: "edit-rss-feed",
        },
      },
      topSites: {
        icon: "heart",
        directive: "browser-top-sites",
      },

    };
  });
