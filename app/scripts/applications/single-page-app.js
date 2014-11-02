/*global define */
(function() {
  'use strict';

  define(['libs/library', 'applications/base/application'], function($, Application) {

    var SinglePageApp = function() {

      // Call parent
      Application.apply(this, arguments);
    };

    // Extend prototype
    SinglePageApp.prototype = Object.create(Application.prototype);

    return SinglePageApp;
  });

}).call(this);
