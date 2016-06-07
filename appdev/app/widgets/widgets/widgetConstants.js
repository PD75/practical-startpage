angular.module('ps.widgets.constants', [])
  .constant('widgetConstants', {
    urlList: 'app/widgets/widgets/widgetUrlList.html',
    defaultWidgets: [{
      title: "Left",
      label: "left",
      tabs: ['bookmarkTree'],
      items: 2,
    }, {
      title: "Middle",
      label: "middle",
      tabs: ['quicklinks', 'closedTabs', 'topSites'],
      items: 4,
    }, {
      title: "Right",
      label: "right",
      tabs: ['history', 'chromeApps'],
      items: 2,
    }],
    widgets: {
      bookmarkTree: {
        icon: "star",
        directive: "browser-bookmark-tree",
        edit: {
          type: "directive",
          directive: "edit-bookmarks",
        },
        permissions: [
          "bookmarks: read bookmarks, save changes for bookmark editor",
          "storage: save quicklings to storage",
        ],
      },
      chromeApps: {
        icon: "grid layout ",
        directive: "browser-apps",
        permissions: [
          "management: retrieve list of apps",
        ],
      },
      closedTabs: {
        icon: "undo",
        directive: "browser-closed-tabs",
        permissions: [
          "session: retrieve list of recently closed tabs, and get refresh list when closing new",
        ],
      },
      history: {
        icon: "history",
        directive: "browser-history",
        edit: {
          type: "directive",
          directive: "edit-history",
        },
        permissions: [
          "history: retrieve browser history",
        ],
      },
      quicklinks: {
        icon: "external link",
        directive: "browser-quicklinks",
        permissions: [
          "bookmarks: read bookmarks",
          "storage: retrieve quicklink folder",
        ],
      },
      rssFeed: {
        icon: "rss",
        directive: "rss-feed",
        noSyncData: ['deletedItems','lastConsolidated'],
        edit: {
          type: "directive",
          directive: "edit-rss",
        },
        permissions: [
          "hitory: check if feed items have been visited",
          "storage: save rss feed url, and deleted feed items",
          "additional permission: uses google-apis to retrieve RSS feeds",
        ],
      },
      topSites: {
        icon: "heart",
        directive: "browser-top-sites",
        permissions: [
          "topSites: retrieve top-sites",
        ],
      },
    },
  });
