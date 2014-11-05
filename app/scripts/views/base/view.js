/*global define */
(function() {
  'use strict';

  var win = this;

  define(['libs/fakejQuery'], function($) {

    var View = function(opts) {

      // Stop if options is not passed or neither the opts.id
      if (!opts || (opts && !opts.id)) { return; }

      // Register name of View
      this.id = opts.id;
      this.container = opts.container;

      // Set autorender
      this.autoRender = opts.autoRender === false ? false : true;

      // Set optional template
      if (opts.template) { this.template = opts.template; }

      // Set optional item collection template and container
      if (opts.itemTpl && opts.itemsContainer) {
        this.itemTpl = opts.itemTpl;
        this.itemsContainer = opts.itemsContainer;
      }

      // Set classes from opts.classes
      if (opts.classes) { this.classes = opts.classes; }

      // Set pager values
      if (opts.pager) {
        this.pagerTotal = opts.pager.total;
        this.pagerNum = opts.pager.num;
      }

      // Set model from opts.model
      if (opts.model) { this.model = opts.model; }

      // Autorun
      this.initialize(opts);
    };

    View.prototype = {

      $el: null,

      autoRender: null,

      classes: null,

      container: null,

      el: null,

      loader: false,

      loaderTimeoutID: false,

      model: null,

      pagernum: null,

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

        // If no tpl stop execution
        if (!this.itemTpl || !this.model.collection) { return; }

        // Local variables
        var that = this,

            // Check if tpl exist in parameter or in this
            tpl = this.itemTpl,

            // Collection length
            end = this.model.collection.length-1;

        if (this.pagerTotal && this.pagerNum) {

          var tot = this.pagerNum,
              num = this.pagerNum,
              pages = Math.ceil(tot / num),
              loc = location.hash,
              limit = (loc === '#text1' || loc === '') ? num :
                        (loc.replace('#text','') * num),
              offset = limit - num;
        }

        // Grab the HTML for this tpl present in main tpl view
        tpl = $(this.el).find(tpl).el.innerHTML;

        // Empty
        $(that.el).find(that.itemsContainer).html('');

        // Iterate the array collection
        this.model.collection.forEach(function(item, index){

          if (typeof limit !== 'undefined' && typeof offset !== 'undefined') {

            if (!(index < limit && index >= offset)) { return; }
          }

          // Initialize the output element
          var output = tpl,
              newItem = document.createElement('div');

          // Find all placeholders for template {{}}
          tpl.replace(/\{\{(.*?)\}\}/g, function(match, token) {

            var token = token.indexOf('.') !== -1 ? token.split('.') : token;

            var deep = Array.isArray(token) && item[token[0]][token[1]] || false;

            // console.log(match, token, deep);

            var value = deep || item[token];

            // Replace all istances in output
            output = output.replace(match, value);
          });

          // Set html of the newItem
          newItem.innerHTML = output;

          // Append the current item
          $(that.el).find(that.itemsContainer).append(newItem);

          // Run the callback
          if (index >= end) {
            if (callback) { callback(); }
          }
        });

        // Create pager
        if (this.pagerTotal && this.pagerNum) { this.makePager(); }
      },

      makePager: function() {

        // Empty the pager
        $(this.el).find('#pager').html('');

        var that = this,
            // tot = this.pagerTotal,
            tot = this.model.collection.length || this.pagerTotal,
            num = this.pagerNum,
            pages = Math.ceil(tot / num),
            loc = location.hash;

        var ul = document.createElement('ul');

        for(var page=1; page<=pages; page++) {

          var li = document.createElement('li'),
              active = (loc === '#text'+page || (loc === '' && page === 1))
                        && 'active' || '';

          li.innerHTML = '<a href="#text' + page + '" class="' + active +
                         '">' + page + '</a>';

          ul.appendChild(li);
        }

        // Create listening onhashchange
        window.onpopstate = this.hashChangePager.bind(this);

        // Append the pager
        $(this.el).find('#pager').append(ul);
      },

      render: function(callback) {

        var that = this;

        this.resetPager();

        // Append the view rendered
        setTimeout(function(){

          // Append
          $(that.container).append(that.el);

          // setTimeout(function() {
          //   // Run the renderItems if itemTpl exist
          //   if (that.itemTpl) { that.renderItems(); }
          // }, 100);

        }, 1);

        // Run callback standalone
        if (callback) { callback(); }

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

      hashChangePager: function(evt) {

        var newPage = evt.target.location.hash;

        this.renderItems();
      },

      resetPager: function() {

        // Reset hash
        location.hash = '';

        // Reset the pager
        // this.makePager();
      },

      hideLoader: function(timing) {

        var target = this.loader || '#loader';

        // Clear previous setTimeout
        win.clearTimeout(this.loaderTimeoutID);

        // Hide loader
        $(target).hide(timing);
      },

      showLoader: function(timing, display, opacity, target) {

        var target = target === 'nested' ? this.createLoader() : '#loader',
            display = target === '#loader' ? 'table': 'block';

        // Show the loader with timeout
        this.loaderTimeoutID = setTimeout(function(){

          // Show loader
          $(target).show(false, display, opacity);

        }, 300);
      },

      createLoader: function(){

        var loader = $(this.el).find('.nested-loader').el;

        if (loader.length === 0) {
          loader = document.createElement('div');

          loader.className = 'nested-loader';
          loader.setAttribute('style', 'transition: 0.2s linear all; opacity: 0; display: none;');

          var span = document.createElement('div');
          span.innerHTML = 'Loading...';

          loader.appendChild(span);

          this.$el.append(loader);
        }

        this.loader = loader;

        return loader;
      }
    };

    return View;
  });

}).call(this);
