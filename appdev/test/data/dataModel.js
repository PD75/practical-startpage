// Used to check and load data sets into chrome storage for various versions of Practical startpage
(function() {
  "use strict";

  angular.module('ps')
    .constant('dataModelConst', {
      local: {
        activeTabs: ["string"],
        badgeLayout: ["string"],
        installDate: "number",
        layout: [{
          items: "number",
          label: "string",
          tabs: ["string"],
          title: "string",
        }],
        localStorage: {
          badgeLayout: "boolean",
          layout: "boolean",
          localStorage: "boolean",
          quicklinks: "boolean",
          rssFeed: "boolean",
          version: "boolean",
        },
        quicklinks: ["string"],
        rssFeed: {
          allowDelete: "boolean",
          deletedItems: [{
            dateStamp: "string",
            link: "string",
          }],
          feeds: [{
            title: "string",
            url: "string",
          }],
          hideVisited: "boolean",
          lastConsolidated: "string",
          sync: {
            delItemsFolder: "string",
            delItemsSync: "boolean",
          },
        },
        version: "string",
      },
      sync: {
        activeTabs: ["string"],
        badgeLayout: ["string"],
        installDate: "number",
        layout: [{
          items: "number",
          label: "string",
          tabs: ["string"],
          title: "string",
        }],
        quicklinks: ["string"],
        rssFeed: {
          allowDelete: "boolean",
          feeds: [{
            title: "string",
            url: "string",
          }],
          hideVisited: "boolean",
          sync: {
            delItemsFolder: "string",
            delItemsSync: "boolean",
          },
        },
        version: "string",
      },
    });
})();
