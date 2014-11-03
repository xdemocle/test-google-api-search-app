/*global define */
(function() {
  'use strict';

  define(['libs/fakejQuery'], function($) {

    function Application(options) {

      if (options && typeof options === 'object') {
        this.main = options.main && options.main || false;
        this.container = options.container && options.container || false;
        this.regions = options.regions && options.regions || false;
      }

      // Auto initialize
      this.initialize(options);
    }

    Application.prototype = {

      main: null,

      container: null,

      regions: null,

      initialize: function(options) {

        // Auto-init the layout of the app
        this.layout();
      },

      layout: function() {

        var that = this,
            wrapper = $(this.container),
            fileName = that.main.replace('#',''),
            filepath = 'views/'+fileName;

        // Check if container not exist
        if (wrapper.length < 1) {

          // Make a container onfly
          wrapper = $('div', {'id':'app','class':'app'});

          // Prepend on body
          $('body').prepend(wrapper);
        }

        // Load main view for base layout
        require([filepath], function(){

          // Create other views for regions
          that.makeRegions();
        });
      },

      makeRegions: function(callback) {

        var that = this,
            total = this.regions.length,
            last = total-1;

        this.regions.forEach(function(region, index, regions){

          // Local vars
          var id = '#'+region,
              wrapper = $(id),
              filepath = 'views/' + region + '-view';

          // Load main view for base layout
          require([filepath], function() {

            // Do stuff in the end of regions making
            if (last === index) {

              // Run the end method
              setTimeout(function(){
                that.end();
              }, 0);
            }
          });
        });
      },

      end: function(argument) {

        // Hide loader if exist
        this.hideLoader();
      },

      hideLoader: function(argument) {

        // Hide loader
        $('#loader').hide();
      },

      showLoader: function(argument) {

        // Show loader
        $('#loader').show();
      },

    };

    return Application;
  });

}).call(this);
