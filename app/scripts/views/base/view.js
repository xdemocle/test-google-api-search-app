/*global define */
(function() {
  'use strict';

  define(['libs/fakejQuery'], function($) {

    var View = function(opts) {

      // Stop if options is not passed or neither the opts.id
      if (!opts || (opts && !opts.id)) { return; }

      // Register name of View
      this.id = opts.id;
      this.container = opts.container;

      // Set optional template
      if (opts.template) { this.template = opts.template; }

      // Set optional item collection template and container
      if (opts.itemTpl && opts.itemsContainer) {
        this.itemTpl = opts.itemTpl;
        this.itemsContainer = opts.itemsContainer;
      }

      // Set classes from opts.classes
      if (opts.classes) { this.classes = opts.classes; }

      // Set model from opts.model
      if (opts.model) { this.model = opts.model; }

      // Autorun
      this.initialize(opts);
    };

    View.prototype = {

      $el: null,

      autoRender: true,

      classes: null,

      container: null,

      el: null,

      model: null,

      subviews: null,

      subviewsByName: null,

      template: null,

      initialize: function() {

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

        // If model and attributes is present, parse also the data
        if (this.model && this.model.attributes) { this.parseData(); }
      },

      parseData: function() {

        // Check if we have Model attributes
        if (this.model && this.model.attributes) {
          console.log(this.$el, this.model);
        }
      },

      renderItems: function(callback) {

        var that = this,

            // Check if tpl exist in parameter or in this
            tpl = this.itemTpl;

        // If no tpl stop execution
        if (!tpl || !this.model.collection) { return; }

        // Grab the HTML for this tpl present in main tpl view
        tpl = $(this.el).find(tpl).el.innerHTML;

        // Empty
        $(that.el).find(that.itemsContainer).el.innerHTML = '';

        // Iterate the array collection
        this.model.collection.forEach(function(item, index, collection){

          // Initialize the output element
          var output = tpl,
              newItem = document.createElement('div');

          // Find all placeholders for template {{}}
          tpl.replace(/\{\{(.*?)\}\}/g, function(match, token) {

            // Replace all istances in output
            output = output.replace(match, item[token]);
          });

          // Set html of the newItem
          newItem.innerHTML = output;

          // Append the current item
          $(that.el).find(that.itemsContainer).append(newItem);

          // Hide the loader
          if (index >= collection.length-1) {
            if (callback) { callback(); }
          }
        });

        return $(that.itemsContainer);
      },

      render: function() {

        var that = this;

        // Append the view rendered
        setTimeout(function(){
          $(that.container).append(that.el);
        }, 1);

        // Run the renderItems if itemTpl exist
        if (this.itemTpl) { this.renderItems(); }

        return this;
      },

      subview: function(name, options) {

        if (!options ) { return; }

        // Initiate the subviews as array
        if (!this.subviews && !this.subviewsByName) {
          this.subviews = [];
          this.subviewsByName = {};
        }

        // Set the proper container taken from the parent view
        options.container = '#'+this.id;

        var that = this,
            filepath = 'views/' + name.toLowerCase() + '-view';

        // Load the specific view
        require([filepath], function(SubView){

          // Initiate the new View
          var view = new SubView(options);

          if (name && view) {

            that.subviews.push(view);
            that.subviewsByName[name] = view;

            return view;
          } else if (name) {
            return that.subviewsByName[name];
          }
        });
      },

      listenTo: function(evt, element, callback) {

        // Local function to listen on delegated event
        var on = function(evt, element, callback) {

          // Add the listener on specific element
          element.addEventListener(evt, callback);
        };

        var eventDelegation = function(event) {

          // var tagName = event.target.tagName.toLowerCase(),
          var type = event.target.type,
              form = event.target.form;

          // console.log(event, tagName, type, form);

          if (evt === 'submit' && form && type === 'submit') {
            on(evt, form, callback);
          }
        };

        // Event delegation on body clicks
        document.querySelector('body').addEventListener('keydown', eventDelegation);
        document.querySelector('body').addEventListener('click', eventDelegation);
      },

      hideLoader: function() {

        // Hide loader
        $('#loader').hide(arguments);
      },

      showLoader: function() {

        // Show loader
        $('#loader').show(false, 'table', arguments[2]);
      }
    };

    return View;
  });

}).call(this);
