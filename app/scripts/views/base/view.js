/*global define */
(function() {
  'use strict';

  define(['libs/fakejQuery'], function($) {

    var View = function(options) {

      // Stop if options is not passed or neither the options.id
      if (!options || (options && !options.id)) { return; }

      // Register name of View
      this.id = options.id;

      // Set optional template
      if (options.template) {
        this.template = options.template;
      }

      // Autorun
      this.initialize(options);
    }

    View.prototype = {

      $el: null,

      autoRender: false,

      container: null,

      el: null,

      template: null,

      initialize: function(options) {

        // Set the model istantiated in the view and passed as parameter
        if (options && options.model) {
          this.model = options.model;
        }

        // Set HTML elements
        this.setHTML();

        // Check if autoRender is set
        if (this.autoRender) {
          this.render();
        }
      },

      setHTML: function() {

        var element;

        if (this.template) {
          element = $('div', {'id':this.id, 'class':this.id}).html(this.template);
        }

        // Create in cache $el, el elements
        this.$el = element || $('div', {'id': this.id});
        this.el = this.$el.el;
      },

      model: function(model) {

        // Set the model
        this.model = model;
      },

      render: function() {

        return this;
      }
    };

    return View;
  });

}).call(this);
