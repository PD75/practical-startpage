angular.module('ps.widgets.constants', [])
  .constant('widgetConstants', {
    urlList: 'app/widgets/widgets/widgetUrlList.html',
    widgets: {
      bookmarkTree: {
        icon: "star",
        directive: "browser-bookmark-tree",
        edit: {
          type: "directive",
          directive: "edit-bookmarks",
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
        edit: {
          type: "directive",
          directive: "edit-history",
        },
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
    },
  });
