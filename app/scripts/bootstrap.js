/*global window, requirejs */

// Configure loading modules from the lib directory, except for 'app' ones,
// which are in a sibling directory.
requirejs.config({
    baseUrl: 'scripts',
    paths: {
      app: '../scripts',
      text: '../../bower_components/requirejs-text/text'
    }
});


(function(window) {
  'use strict';

  // Set a public element to reuse in the app as flag for PhoneGap/Cordova app
  // recognition
  window.isPhonegap = false;

  var document = window.document;

  // Starting the app when the DOM is ready/loaded
  document.addEventListener('DOMContentLoaded', function() {

    requirejs(['applications/single-page-app'], function(SingleAppPage) {

      // Some console output
      console.info('DOM Loaded,', 'Cordova: ' + ('cordova' in window));

      // onDeviceReady function to start the application
      var onDeviceReady = function() {

        new SingleAppPage({
          'container': '#app',
          'main': '#site-view',
          'regions': ['header', 'footer', 'pager']
        });
      };

      // If is Cordova/PhoneGap app, listen the deviceready event for start.
      // Otherwise just run the onDeviceReady fucntion
      if ('cordova' in window) {

        document.addEventListener('deviceready', onDeviceReady, false);

        // Update this public value for PhoneGap/Cordova app recognition
        window.isPhonegap = true;

      } else {
        onDeviceReady();
      }
    });

  }, false);

})(window);
