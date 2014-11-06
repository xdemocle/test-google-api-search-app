/*global define */
(function() {
  'use strict';

  define(['libs/fakejQuery', 'applications/base/application'], function($, Application) {

    var SinglePageApp = function() {

      // Call parent application class
      Application.apply(this, arguments);
    };

    // Extend prototype
    SinglePageApp.prototype = Object.create(Application.prototype);

    return SinglePageApp;
  });

}).call(this);
