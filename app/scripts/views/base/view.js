/*global define */
(function() {
  'use strict';

  define(['libs/fakejQuery'], function($) {

    var View = function(options) {

      // Stop if options is not passed or neither the options.id
      if (!options || (options && !options.id)) { return; }

      // Register name of View
      this.id = options.id;
      this.container = options.container;

      // Set optional template
      if (options.template) {
        this.template = options.template;
      }

      // Set classes from options.classes
      if (options.classes) {
        this.classes = options.classes;
      }

      // Initiate the subviews as array
      this.subviews = [];
      this.subviewsByName = {};



      // Autorun
      this.initialize(options);
    }

    View.prototype = {

      $el: null,

      autoRender: true,

      classes: null,

      container: null,

      el: null,

      subviews: null,

      subviewsByName: null,

      template: null,

      initialize: function(options) {

        // Set HTML elements
        this.setHTML();

        // Set the model istantiated in the view and passed as parameter
        if (options && options.model) {
          this.model = options.model;
        }

        // Check if autoRender is set
        if (this.autoRender) {
          this.render();
        }
      },

      setHTML: function() {

        var element;

        if (this.template) {
          element = $('div', {'id': this.id}).html(this.template);
        } else {
          element = $('div', {'id':this.id});
        }

        // Create in cache $el, el elements
        this.$el = element;
        this.$el.length = 1;
        this.el = this.$el && this.$el.el;

        // Add classes to the wrapper
        if (this.classes && this.$el.length > 0) {
          this.$el.addClass(this.classes);
        }
      },

      model: function(model) {

        // Set the model
        this.model = model;
      },

      render: function() {

        var that = this;

        // console.log("this.id", this.id, this.container, this.el);

        // Append the site view rendered
        setTimeout(function(){

          $(that.container).append(that.el);

        }, 1);

        return this;
      },

      subview: function(name, options) {

        // Use view as options parameters
        if (options) {

          // Set the proper container taken from the parent view
          options.container = '#'+this.id;

          // Initiate the new View
          var view = new View(options);
        }

        var subviews = this.subviews,
            byName = this.subviewsByName;

        if (name && view) {

          subviews.push(view);
          byName[name] = view;

          return view;
        } else if (name) {
          return byName[name];
        }
      },

      listenTo: function(evt, element, callback) {

        // Local function to listen on delegated event
        var on = function(evt, element, callback) {

          // Add the listener on specific element
          element.addEventListener(evt, callback);
        };

        var eventDelegation = function(event) {

          var tagName = event.target.tagName.toLowerCase(),
              type = event.target.type,
              form = event.target.form;

          // console.log(event, tagName, type, form);

          if (evt === 'submit' && form && type === 'submit') {
            on(evt, form, callback);
          }
        };

        // Event delegation on body clicks
        document.querySelector('body').addEventListener('keydown', eventDelegation);
        document.querySelector('body').addEventListener('click', eventDelegation);
      }
    };

    return View;
  });

}).call(this);
