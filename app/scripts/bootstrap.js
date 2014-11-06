/*global window, requirejs */
/**
 * Bootstrap file
 */

// Configure loading modules from the lib directory, except for 'app' ones,
// which are in a sibling directory.
requirejs.config({
    baseUrl: 'scripts',
    paths: {
      app: '../scripts',
      text: '../../bower_components/requirejs-text/text'
    }
});

/**
 * Wrapped function for real bootstrap of the app
 */
(function() {
  'use strict';

  // Copy the window object in win
  var win = this;

  // Initialize the mediator
  win.mediator = {};

  // Set a public element to reuse in the app as flag for PhoneGap/Cordova app
  // recognition
  win.isPhonegap = false;

  // Starting the app when the DOM is ready/loaded
  document.addEventListener('DOMContentLoaded', function() {

    requirejs(['applications/single-page-app'], function(SingleAppPage) {

      // Some console output
      console.info('DOM Loaded,', 'Cordova: ' + ('cordova' in win));

      // onDeviceReady function to start the application
      var onDeviceReady = function() {

        new SingleAppPage({
          'container': '#app',
          'main': '#site-view',
          'regions': ['header', 'main']
        });
      };

      // If is Cordova/PhoneGap app, listen the deviceready event for start.
      // Otherwise just run the onDeviceReady fucntion
      if ('cordova' in win) {

        document.addEventListener('deviceready', onDeviceReady, false);

        // Update this public value for PhoneGap/Cordova app recognition
        win.isPhonegap = true;

      } else {
        onDeviceReady();
      }
    });

  }, false);

}).call(window);
