// Used to check and load data sets into chrome storage for various versions of Practical startpage
(function() {
  "use strict";

  angular.module('ps')
    .constant('dataModelConst', {
      local: {
        activeTabs: ["string"],
        badgeLayout: ["string"],
        history: {
          days: "number",
          listType: "string",
          max: "number",
          showDelete: "boolean",
        },
        layout: [{
          items: "number",
          label: "string",
          tabs: ["string"],
          title: "string",
        }],
        localStorage: {
          activeTabs: "boolean",
          badgeLayout: "boolean",
          history: "boolean",
          installDate: "boolean",
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
        badgeLayout: ["string"],
        history: {
          days: "number",
          listType: "string",
          max: "number",
          showDelete: "boolean",
        },
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
      },
    })
    .constant('testData', {
      local: {
        activeTabs: ["string"],
        badgeLayout: ["string"],
        history: {
          days: "number",
          listType: "string",
          max: "number",
          showDelete: "boolean",
        },
        layout: [{
          items: "number",
          label: "string",
          tabs: ["string"],
          title: "string",
        }],
        localStorage: {
          badgeLayout: "boolean",
          history: "boolean",
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
        history: {
          days: "number",
          listType: "string",
          max: "number",
          showDelete: "boolean",
        },
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
      },
    }).constant('testDataPrevious', {
      local: {
        "activeTabs": ["rssFeed", "history", "history"],
        "badgeLayout": ["gmail"],
        "history": {
          "days": 100,
          "listType": "GL",
          "max": 100,
          "showDelete": false,
        },
        "installDate": 1464964970526,
        "layout": [{
          "items": 2,
          "label": "left",
          "tabs": ["bookmarkTree", "rssFeed"],
          "title": "Left column",
        }, {
          "items": 4,
          "label": "middle",
          "tabs": ["quicklinks", "closedTabs", "topSites"],
          "title": "Middle column",
        }, {
          "items": 2,
          "label": "right",
          "tabs": ["history", "chromeApps"],
          "title": "Right column",
        }],
        "quicklinks": ["396"],
        "rssFeed": {
          "allowDelete": true,
          "deletedItems": [{
            "link": "https://github.com/PD75/practical-startpage/compare/07bac7f08d...8094a2c88a",
          }, {
            "link": "https://github.com/PD75/practical-startpage/compare/f3c9810c00...07bac7f08d",
          }],
          "feeds": [{
            "$$hashKey": "object:1292",
            "url": "https://github.com/PD75.atom",
          }],
          "hideVisited": true,
        },
        "version": "2.5.3",
      },
    });
})();
