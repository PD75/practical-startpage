angular.module('PracticalStartpage')
  .factory('dataServiceWidgets', function() {
    'use strict';
    return {
      getWidgets: getWidgets,
    };

    function getWidgets() {
      return {
        bookmarkTree: {
          title: "Bookmarks",
          icon: "star",
          directive: "browser-bookmark-tree",
          help: "A Treeview of all the bookmarks, with full text search.<br /><b>Note:</b> You select the Quicklinks from here by right clicking the folder you want to get your quicklinks from.<br /> Click edit button to get bookmark editor.",
          edit: {
            type: "modal",
            url: "app/widgets/bookmarkTree/editBookmarkTree.html",
          },
        },
        quicklinks: {
          title: "Quicklinks",
          icon: "external link",
          directive: "browser-quicklinks",
          help: "A list of links chosen by the user. The links are chosen by right clicking a folder in the bookmark tree. <br /> <b>Note:</b> You can only select one folder and only the bookmarks directly in that folder are shown, not in sub folders.",
        },
        history: {
          title: "History",
          icon: "history",
          directive: "browser-history",
          help: "Last 200 visited sites.",
        },
        topSites: {
          title: "Top Sites",
          icon: "heart",
          directive: "browser-top-sites",
          help: "Most visited sites.",
        },
        closedTabs: {
          title: "Closed",
          icon: "undo",
          directive: "browser-closed-tabs",
          help: "Recently closed tabs.<br /><b>Note</b>: Is cleared by chrome each time browser is closed.",
        },
        chromeApps: {
          title: "Apps",
          icon: "grid layout",
          directive: "browser-apps",
          help: "A list of chrome apps presently installed in the browser.<br /> <b>Note:</b> only apps with a page are listed.",
        },
      };
    }
  });
