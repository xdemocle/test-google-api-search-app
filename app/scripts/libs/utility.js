/**
 * Utility functions collection
 */
(function() {
  'use strict';

  // Shortcut to window public object
  var win = this;

  // Object container for utility functions
  var u = {

    openLink: function(url) {

      // Switch for isPhonegap
      if (win.isPhonegap) {

        win.navigator.app.loadUrl('https://google.com/', { openExternal:true });

      } else {

        win.open(url, '_blank');
      }
    }

  };

  // Copy in public object
  win.u = u;

}).call(window);
