![logo]

# Practical Startpage
Chrome Extension that replaces the default newtab. Install from [Practical Startpage in chrome store]

---

[![License MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://raw.githubusercontent.com/PD75/practical-startpage/master/LICENSE)
[![GitHub version](https://badge.fury.io/gh/PD75%2Fpractical-startpage.svg)](https://badge.fury.io/gh/PD75%2Fpractical-startpage)
[![Dependencies](https://david-dm.org/pd75/practical-startpage.svg)](https://david-dm.org)

[![Stories in Ready](https://badge.waffle.io/PD75/practical-startpage.svg?label=-to-be-started&title=To%20be%20Started)](http://waffle.io/PD75/practical-startpage)
[![Stories in Progress](https://badge.waffle.io/PD75/practical-startpage.svg?label=-in-progress&title=In%20Progress)](http://waffle.io/PD75/practical-startpage)
[![Stories in Ready](https://badge.waffle.io/PD75/practical-startpage.svg?label=-implemented&title=Implemented)](http://waffle.io/PD75/practical-startpage)

[![Issue Stats](http://issuestats.com/github/PD75/practical-startpage/badge/pr)](http://issuestats.com/github/PD75/practical-startpage)
[![Issue Stats](http://issuestats.com/github/PD75/practical-startpage/badge/issue)](http://issuestats.com/github/PD75/practical-startpage)

---

## About
Startpage focuses on making your existing data available to you simple way.

Practical Startpage is for those that want a functional startpage, allowing easy access to chrome data, such as bookmarks and history.

Up now and on the next few months the intention is to improve the customization of the page, allowing changes to layout and styles. In the future there will be more widgets added that the users can have on their Practical Startpage.

The application is build flexibly, allowing anyone to contribute with a widget for the tabs.

## Contributions
The application is written in [AngularJS] with [Semantic UI] as the layout framework. For the build [Gulp] is used. Please review [Angular Style Guide] and try to adhere where it makes sense. Further there are [ESLint] rules available in the project.

### Widgets
Adding widgets should be fairly easy. Any self contained directive will run. All formatting variables are available from Services if needed, allowing consistent colors throughout.

### Folder Structure
To keep each component easily identified, all files used by that component  must be grouped together with the same name or at least same prefix. In the case where components share parts with other components, such as services and templates these can be in a different location or have a different naming convention.

```
appdev/       - development Folder
  app/        - scripts
    core/     - core application
    services/ - services connecting to external
    widgets/  - widgets, directives, controller, and services
  dist/       - third party distributions
  img/        - images that are not specific to any part
dist/         - distribution that need adaptation
```

E.g. a mail checker would have the base logic and rendering code in _widgets/_ while the interfaces to outlook, Gmail and yahoo api would be under _services/_

### Configuration data
For the startpage to notice the widget it needs to be registered in _widgetConstants.js_

```javascript
[label of widget]: {
  title: "Title of Widget",
  icon: "icon classes from",
  directive: "widget directive without ps- prefix",
  help: "Help text",
  edit: {
    type: "type of edit widget, only support modal right now",
    url: "url to the html file",
  },
},
```

### Callback functions
In order to allow a simple trigger on various events, there are some simple callbacks available. Alternative is to use `$scope.$watch` however this is resource consuming, and also often requires exact variable comparison, which is even heavier.

The approach chosen is to rely on the native chrome event functions, as well as services to trigger events.

#### Set local data callbacks
Since all settings are persisted in chrome storage, the call is triggered by changes to the stored variable. To bind a function to a change to an object:

```javascript
//To bind functions to data changes
dataService.setOnChangeData(objectLabel, function callback)

objectLabel //name of object (string)
callback    //the callback function
```

#### Tab click callbacks
The widgets need to be refreshed when the tab is shown and for some also when clicked. This callback is also very useful to trigger when you need data to refresh with saving data.

```javascript
//to bind functions to tab click
layoutService.setOnTabClick(tabLabel, function callback)

//to trigger a refresh of a specific tab
layoutService.runOnTabClick(tabLabel)

tabLabel    //the label of the tab = label of widget on that tab (string)
callback    //the callback function
```

### Permissions
New widgets will need additional permissions, however to avoid bloating the default permissions, optional permissions will be used for new widgets.
```json
"optional_permissions": [
  "http://ajax.googleapis.com/*"
],
"permissions": [
  "topSites",
  "chrome://favicon/",
  "tabs",
  "bookmarks",
  "management",
  "history",
  "sessions",
  "storage"
],
```
In this example ```"optional_permissions": ["http://ajax.googleapis.com/*"]``` are the permission for the RSS feed widget. To check and approve permissions there are two new services.

```javascript
//check if the permission is authorized, returns boolean
permissionService.checkPermissions(permissionsList)

//request additional permissions returns boolean
permissionService.requestPermissions(permissionsList)

permissionsList    //list of oermissions needed
```

## Set-up development
### Clone
- branch code and clone locally
- load the development folder to continuously monitor
  - in chrome to to Extensions ( _More toole -> Extensions_ )
  - tick _Developer mode_
  - _Load unpacked extensions_ and select _appdev/_

### Build
Install all dependencies

```
> npm install
```

Build code to _build/_

```
> gulp build
```

[practical startpage in chrome store]: https://chrome.google.com/webstore/detail/ikjalccfdoghanieehppljppanjlmkcf
[angularjs]: https://angularjs.org/
[gulp]: http://gulpjs.com/
[angular style guide]: https://github.com/johnpapa/angular-styleguide
[eslint]: https://github.com/eslint/eslint
[logo]: ./appdev/img/icon48.png
