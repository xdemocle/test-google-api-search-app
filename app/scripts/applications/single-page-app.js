/*global define */
(function() {
  'use strict';

  define([
    'libs/fakejQuery',
    'applications/base/application',
    'views/site-view',
    'views/header-view',
    'views/main-view'
  ], function($, Application, SiteView, HeadView, MainView) {

    /**
     * Single Page App main class
     */
    var SinglePageApp = function() {

      // Call parent application class
      Application.apply(this, arguments);
    };

    /**
     * Extend prototype class
     */
    SinglePageApp.prototype = Object.create(Application.prototype);

    /**
     * Set the main view of the app
     */
    SinglePageApp.prototype.main = SiteView;

    /**
     * Set the list of regions view of the main view
     */
    SinglePageApp.prototype.regions = [HeadView, MainView];

    return SinglePageApp;
  });

}).call(this);
