# Practical Startpage
Chrome Extension that replaces the default newtab. Install from [Practical Startpage in chrome store](https://chrome.google.com/webstore/detail/ikjalccfdoghanieehppljppanjlmkcf)

## About
Startpage focuses on making you existing data available to you simple way.

Practical Startpage is for those that want a functional startpage, allowing easy access to chrome data, such as bookmarks and history.

for the future there will be more widgets added that the users can have on their Practical Startpage.

Up now and on the next few months the intention is to improve the customization of the page, allowing changes to layout and styles.


The application is build flexibly, allowing anyone to contribute with a widget for the tabs.

## Contributions

The application is written in [AngularJS](https://angularjs.org/) with [Semantic UI](http://semantic-ui.com/) as the layout framework. For the build gulp is used.

### Widgets

Adding widgets should be fairly easy. Any self contained directive will run. All formatting etc. is available from Services if needed, allowing consistent colors throughout.

### Folder Structure

````
appdev/       - development Folder
  app/        - scripts
    core/     - core application
    services/ - services connecting to external
    widgets/  - widgets, directives, controller, and services
  dist/       - third party distributions
  img/        - images that are not specific to any part
dist/         - distribution that need adaptation

````
