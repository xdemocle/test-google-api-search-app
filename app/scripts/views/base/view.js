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

      // Set events
      if (opts.events) {
        this.events = opts.events;
      }

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

      events: null,

      eventsReady: false,

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

        // Check if autoRender is set
        if (this.autoRender) {
          this.render();
        }
      },

      parseData: function() {

        // Check if we have Model attributes
        if (this.model && this.model.attributes) {
          console.log(this.$el, this.model);
        }
      },

      renderItems: function(callback) {

        if (!this.model.collection) {

          // console.log( $(this.el).find(this.itemsContainer).find('ul') )

          //
          $(this.el).find(this.itemsContainer).el.innerHTML = '';

          var noResultsMessage = document.createElement('p');

          noResultsMessage.innerHTML = 'No search results';

          $(this.el).find(this.itemsContainer).append(noResultsMessage);

          // Launch callback
          callback();
        }

        // If no tpl stop execution
        if (this.itemTpl && this.model.collection) {

          // Local variables
          var that = this,

              // Check if tpl exist in parameter or in this
              tpl = this.itemTpl,

              // Collection length
              end = this.model.collection.length-1;

          // Check if we have all values to make a pager
          if (this.pagerTotal && this.pagerNum) {

            var num = this.pagerNum,
                // pages = Math.ceil(tot / num),
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

            // If we have limit and offset
            if (typeof limit !== 'undefined' && typeof offset !== 'undefined') {

              // Stop execution respecting limit/offset parameters
              if (!(index < limit && index >= offset)) { return; }
            }

            // Initialize the output element
            var output = tpl,
                newItem = document.createElement('div');

            // Find all placeholders for template {{}}
            tpl.replace(/\{\{(.*?)\}\}/g, function(match, token) {

              // Check if the token as an object subvalue item
              var tok = token.indexOf('.') !== -1 ? token.split('.') : token;

              // If token is splitted and become a valid array
              var deep = Array.isArray(tok) && item[tok[0]][tok[1]] || false;

              // Switch between normal token and deep token
              var value = deep || item[tok];

              // Replace all istances in output
              output = output.replace(match, value);
            });

            // Set html of the newItem
            newItem.innerHTML = output;

            // Append the current item
            $(that.el).find(that.itemsContainer).append(newItem);

            // Run the callback
            if (index >= (limit-1) || index >= end) {
              if (callback) { callback(); }
            }
          });

          // Create pager
          if (this.pagerTotal && this.pagerNum) { this.makePager(); }
        }

        return this;
      },

      makePager: function() {

        // Empty the pager
        $(this.el).find('#pager').html('');

        var tot = this.model.collection.length || this.pagerTotal,
            num = this.pagerNum,
            pages = Math.ceil(tot / num),
            loc = location.hash;

        var ul = document.createElement('ul');

        for(var page=1; page<=pages; page++) {

          var li = document.createElement('li'),
              active = (loc === '#text'+page || (loc === '' && page === 1)) &&
                       'active' || '';

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

        // Reset the flag eventsReady
        this.eventsReady = false;

        this.resetPager();

        var onDomChange = function(){

          // Run callback standalone
          if (callback) { callback(); }

          // Load events for this view
          if (!that.eventsReady) { that.loadEvents(); }

          // Remove event listener
          $(that.container).el
            .removeEventListener('DOMSubtreeModified', onDomChange);
        };

        // Append the view rendered
        setTimeout(function(){

          //
          $(that.container).el
            .addEventListener('DOMSubtreeModified', onDomChange, false);

          // Attach to the DOM
          $(that.container).append(that.el);

        }, 0);

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

      loadEvents: function() {

        var that = this;

        // Stop if events are already loaded
        if (this.eventsReady) { return; }

        // Update flag eventsReady
        this.eventsReady = true;

        // Stop if no events to load
        if (this.events && Array.isArray(this.events)) {

          // Iterate all events
          this.events.forEach(function(singleEvent){

            // Load event
            singleEvent(that);
          });
        }

        return this;
      },

      listenTo: function(evt, element, callback) {

        var elClone;

        // Check if element is still a string
        if (typeof element === 'string') {

          element = $(this.el).find(element).el;

          // console.log(evt, element);

          // Check if results are more than one
          if (Array.isArray(element)) {

            element.forEach(function(el){

              // Add the listener on specific element
              el.removeEventListener(evt, callback, false);
              el.addEventListener(evt, callback, false);
            });

            return;
          }
        }

        // Clone the element to remove any listener
        elClone = element.cloneNode(true);
        element.parentNode.replaceChild(elClone, element);

        // Add the listener on cloned element
        elClone.addEventListener(evt, callback, false);

        return this;
      },

      hashChangePager: function() {

        // var newPage = evt.target.location.hash;

        this.renderItems();
      },

      resetPager: function() {

        // Reset hash
        location.hash = '';

        // Reset the pager
        // this.makePager();

        return this;
      },

      hideLoader: function(timing) {

        var target = this.loader || '#loader';

        // Clear previous setTimeout
        win.clearTimeout(this.loaderTimeoutID);

        // Hide loader
        $(target).hide(timing);

        return this;
      },

      showLoader: function(timing, display, opacity, target) {

        // Clear previous setTimeout
        win.clearTimeout(this.loaderTimeoutID);

        target = target === 'nested' ? this.createLoader() : '#loader';
        display = target === '#loader' ? 'table': 'block';

        // Show the loader with timeout
        this.loaderTimeoutID = setTimeout(function(){

          // Show loader
          $(target).show(false, display, opacity);

        }, 300);

        return this;
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
