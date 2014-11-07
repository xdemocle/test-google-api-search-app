/*global define */
(function() {
  'use strict';

  define(['libs/fakejQuery'], function($) {

    /**
     * Base class with basic features to run an application
     * @param Object options
     */
    function Application(options) {

      if (options && typeof options === 'object') {
        this.container = options.container && options.container || false;
      }

      // Auto initialize
      this.initialize();
    }

    Application.prototype = {

      container: null,

      main: null,

      regions: null,

      initialize: function() {

        // Auto-init the layout of the app
        this.layout();
      },

      layout: function() {

        var that = this,
            SiteView = this.main,
            wrapper = $(this.container);

        // Check if container not exist
        if (wrapper.length < 1) {

          // Make a container onfly
          wrapper = $('div', {'id':'app','class':'app'});

          // Prepend on body
          $('body').prepend(wrapper);
        }

        // Run main SiteView and make regions as callback
        this.main = new SiteView({
          'callback': function(){

            // Istance other views for regions
            that.makeRegions();
          }
        });
      },

      makeRegions: function() {

        var that = this,
            total = this.regions.length,
            last = total-1;

        this.regions.forEach(function(View, index){

          // Load the single view
          new View();

          // Do stuff in the end of regions making
          if (last === index) {

            // Run the end method
            setTimeout(function(){
              that.end();
            }, 0);
          }
        });
      },

      end: function() {

        // Hide loader if exist
        this.main.hideLoader();
      }
    };

    return Application;
  });

}).call(this);
