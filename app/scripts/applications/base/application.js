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

        this.layout();
      },

      layout: function() {

        var that = this,
            wrapper = $(this.container),
            fileName = that.main.replace('#',''),
            filepath = 'views/'+fileName;

        // Check if container not exist
        if (wrapper.length <= 0) {

          // Make a container onfly
          wrapper = $('div', {'id':'app','class':'app'});

          // Prepend on body
          $('body').prepend(wrapper);
        }

        // Load main view for base layout
        require([filepath]);

        // Create other views for regions
        this.makeRegions();
      },

      makeRegions: function() {

        this.regions.forEach(function(region, index, regions){

          // Local vars
          var id = '#'+region,
              wrapper = $(id),
              filepath = 'views/' + region + '-view';

          // Load main view for base layout
          require([filepath]);
        });
      }

    };

    return Application;
  });

}).call(this);
