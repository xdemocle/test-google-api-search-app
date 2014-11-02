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

            console.log(wrapper)

        // Check if container not exist
        if (wrapper.length <= 0) {

          // Make a container onfly
          wrapper = $('div', {'id':'app','class':'app'});

          // Prepend on body
          $('body').prepend(wrapper);
        }

        // Load main view for base layout
        require([filepath], function(MainView) {

          // Append the site view rendered
          $(that.container).append(MainView.el);
        });
      }
    };

    return Application;
  });

}).call(this);
