/*!
 *
 *  Fake Underscore
 *
 */

/*global define */
(function() {
  

  var win = this;

  define('libs/fakeUnderscore',[],function() {

    /**
     * Create the Fake Underscore container
     * @type {Object}
     */
    var _ = {

      /**
       * Convert an array to object
       * @param  {Object} obj
       * @return {Array}
       */
      toArray: function(obj) {
        var arr = [];
        for( var i in obj ) {
          if (i !== 'length') {
            if (obj.hasOwnProperty(i)){
              arr.push(obj[i]);
            }
          }
        }
        return arr;
      }
    };

    // Copy fake Underscore in public object
    win._ = _;

    return _;
  });

}).call(this);

/*!
 *
 *  Fake jQuery
 *
 */

/*global define */
(function() {
  

  var win = this;

  define('libs/fakejQuery',['libs/fakeUnderscore'], function(_) {

    var document = win.document;

    // First declaration and protoype constructor for DOM manipulation, ajax
    // requests and other utility
    var $ = function(selector, options) {

      return new DomObject(selector, options);
    };

    // Ajax GET methods with callback and options
    $.ajax = function(url, callback, method, async) {

      // Throw an error in case of no URL passed
      if (!url) { throw 'Should pass an URL as parameter'; }

      // Set async as true by default
      if (typeof async === 'undefined') { async = true; }

      // Istantiate the new ajax object
      var xhr = new XMLHttpRequest();

      // Open the connection
      xhr.open(method, url, async);

      // If callback is passed
      if (!!callback) {
        xhr.onreadystatechange = function(){

          // request is done
          if (xhr.readyState === 4) {

            // successfully
            if (xhr.status === 200) {

              // we're calling our method
              callback(xhr.responseText);
            }
          }
        };
      }

      // Send ajax request
      xhr.send();

      return xhr;
    };

    $.get = function(url, callback, async) {

      return this.ajax(url, callback, 'GET', async);
    };

    $.post = function(url, callback, async) {

      return this.ajax(url, callback, 'POST', async);
    };

    $.getJSON = function(url, callback, async) {

      // Set defualt value
      var callbackJSON = null;

      // Hook the callback to prepare the JSON response properly
      if (!!callback) {
        callbackJSON = function(response) {

          // Parse data as JSON object
          var parsedData = JSON.parse(response);

          // Now, run the callback passed as parameter
          callback(parsedData);
        };
      }

      return this.ajax(url, callbackJSON, 'GET', async);
    };


    // Main function for DOM manipulation
    function DomObject(selector, options) {

      // Auto init
      return this.init(selector, options);
    }

    // Prototypes for DOM manipulation
    DomObject.prototype = {

      init: function(selector, options) {

        this.selector = selector;
        this.length = 0;

        // If options is passed switch to create method
        if (selector && options && typeof options === 'object') {

          return this.create(selector, options);
        }

        if (!selector) {
          return this;
        } else {
          return this.find(selector);
        }
      },

      find: function(selector) {

        var needle,
            needles,
            elements = [],
            context = this.context || document,
            Obj = Object.getPrototypeOf(context);

        // Retrieve the first char of selector to get the type below
        var type = String(selector).slice(0, 1),
            target = String(selector).slice(1, selector.length);

        // console.log(selector, context, typeof selector === 'object')

        // Define if the selector is a class or id or a complex
        // select or an object
        if (typeof selector === 'object') {

          // Set needle
          needle = selector;

          // And add to elements array list
          elements.push(needle);

        } else if (selector.split(' ').length > 1) {

          elements = context.querySelectorAll(selector);

        } else if (type === '.') {

          if (Obj && typeof Obj.item === 'function') {

            context = _.toArray(context);

            context.forEach(function(needle){

              needles = _.toArray(needle.getElementsByClassName(target));

              needles.forEach(function(el){
                elements.push(el);
              });
            });

          } else {

            // Set needle if context isn't empty
            needle = context && context.getElementsByClassName(target);

            // If needle is more than 1
            if (needle.length > 0) {

              // Overwrite the elements variable
              elements = needle;
            }
          }

        } else if (type === '#') {

          // Check if context is a specific object
          var obj = Object.getPrototypeOf(context) &&
                    Object.getPrototypeOf(context).constructor.name || false,
              objSafari = Object.getPrototypeOf(context).toString(),
              objHTML = (obj === 'HTMLDivElement') || (obj === 'HTMLScriptElement' || objSafari === '[object HTMLDivElementPrototype]');

          // console.log(objHTML, objSafari)

          // Check if context is document root or something else
          if ((obj || objSafari) && objHTML) {

            // Set only the first needle
            needle = context.querySelector(selector);

            // console.log(obj, objHTML, context, selector, needle);

          } else {

            // Set only the first needle
            needle = context.getElementById(target);
          }

          if (needle) {
            elements.push( needle );
          }

        } else {

          // Check if context is document or something else
          if (Obj && typeof Obj.item === 'function') {

            elements = context[0] && context[0].getElementsByTagName(selector);

          } else {

            elements = context.getElementsByTagName(selector);
          }
        }

        // Memorize context as first
        this.context = (elements && elements.length === 1) ? elements[0] : elements;

        // Force conversion in Array for elements
        elements = elements && _.toArray(elements);

        // Save el and length
        this.el = (elements && elements.length === 1) ? elements[0] : elements;
        this.length = (elements && elements.length > 0) ? elements.length : 0;

        return this;
      },

      first: function() {

        // If this.el is empty, block execution
        if (this._noEl()) { return null; }

        // Check is is an array
        if (typeof this.el !== 'string' && this.el.length >= 1) {

          // Return only first element
          return this.el[0];
        }

        return this.el;
      },

      last: function() {

        // If this.el is empty, block execution
        if (this._noEl()) { return null; }

        // Check is is an array
        if (typeof this.el !== 'string' && this.el.length > 1) {

          // Return only first element
          return this.el[this.el.length-1];
        }

        return this.el;
      },

      parent: function() {

        // If this.el is empty, block execution
        if (this._noEl()) { return null; }

        // Return the parent node
        return this.el.parentNode;
      },

      clone: function() {

        // If this.el is empty, block execution
        if (this._noEl()) { return null; }

        // Clone and return the current el/node
        return this.el.cloneNode(true);
      },

      is: function(value) {

        // If this.el is empty, block execution
        if (this._noEl()) { return null; }

        // Check if is empty
        if (value === ':empty') {

          // Return false if isn't empty
          return !this.el.hasChildNodes();
        }

        // Check if is a string
        if (typeof value === 'string') {

          var index = null,
              target = value.substring(0,1);

          // If target is not an id or a class, return null
          if (target !== '.' && target !== '#') { return false; }

          // Check if there is a dot or hash key as first char
          value = (value.substring(0,1) === '.' || value.substring(0,1) === '#') ?
            value.substring(1) : value;

          // If the checking is an ID, return immediately the result
          if (target === '#') {

            index = value === this.el.id ? 1 : -1;

          } else {

            var arr = _.toArray(this.el.classList);

            index = arr.indexOf(value);
          }

          return index > '-1' ? true : false;
        }

        // Empty return
        return;
      },

      attr: function(attributeName, attributeValue) {

        // If this.el is empty, block execution
        if (this._noEl()) { return null; }

        // If both paramenters are passed, set the attribute for current element
        if (attributeName && attributeValue) {

          this.el.setAttribute(attributeName, attributeValue);
        }

        // Try to return the attribute in any case
        return this.el.getAttribute(attributeName);
      },

      removeAttr: function(attributeName) {

        // If this.el is empty, block execution
        if (this._noEl()) { return null; }

        // Try to return the attribute in any case
        return this.el.removeAttribute(attributeName);
      },

      append: function(node) {

        // If this.el is empty, block execution
        if (this._noEl()) { return null; }

        // Check if is an object or an element
        node = node.el ? node.el : node;

        // Append the node
        return this.el.appendChild(node);
      },

      prepend: function(node) {

        // If this.el is empty, block execution
        if (this._noEl()) { return null; }

        // Check if is an object or an element
        node = node.el ? node.el : node;

        // Prepend the node
        return this.el.insertBefore(node, this.el.firstChild);
      },

      remove: function() {

        // If this.el is empty, block execution
        if (this._noEl()) { return null; }

        // Check is is an array
        if (typeof this.el !== 'string' && this.el.length > 1) {

          var elements = _.toArray(this.el);

          // ForeachItearte all elements
          elements.forEach(function(element){

            // Remove each elements
            element.remove();
          });

          return true;
        }

        // Remove single element
        this.el.remove();

        return true;
      },

      hasClass: function(className) {

        // If this.el is empty, block execution
        if (this._noEl()) { return null; }

        // Check the presence of className in element className string
        var indexOf = this.el.className.indexOf(className);

        // Return back the boolean value
        return indexOf !== -1 ? true : false;
      },

      addClass: function(className) {

        // If this.el is empty, block execution
        if (this._noEl()) { return null; }

        // Convert in array
        var newClasses = className.split(' ');

        // If more than one element
        if (newClasses.length > 1) {

          var that = this;

          // Append the new classes
          newClasses.forEach(function(className){

            // Append the new class
            that.el.classList.add(className);
          });

          return;
        }

        // Append the new class
        this.el.classList.add(newClasses[0]);
      },

      removeClass: function(className) {

        // If this.el is empty, block execution
        if (this._noEl()) { return null; }

        // Convert in array
        var classes = className.split(' ');

        // If more than one element
        if (classes.length > 1) {

          // Append the new classes
          classes.forEach(function(className){

            // Append the new class
            this.el.classList.remove(className);
          });

          return;
        }

        // Remove the class
        this.el.classList.remove(classes[0]);
      },

      toggleClass: function(className) {

        // If this.el is empty, block execution
        if (this._noEl()) { return null; }

        // Convert in array
        var classes = className.split(' ');

        // If more than one element
        if (classes.length > 1) {

          // Append the new classes
          classes.forEach((function(_this){
            return function(className){

              // Append the new class
              _this.el.classList.toggle(className);
            };
          })(this));

          return;
        }

        // Remove the class
        this.el.classList.toggle(classes[0]);
      },

      show: function(timing, display, opacity) {

        // Set defualt display modality
        display = display || 'block';
        opacity = opacity || 1;

        // Set default timing
        timing = timing || 200;

        // Animate with opacity
        this.attr('style', 'display: ' + display + '; transition: ' +
                  (timing / 1000) + 's linear all; opacity: ' + opacity + ';');
      },

      hide: function(timing) {

        var that = this,
            lateron;

        // Set default timing
        timing = timing || 200;

        // Set timing for setTimeout below
        lateron = (timing * 1.5);

        // Animate with opacity
        this.attr('style', 'transition: ' + (timing / 1000) +
                  's linear all; opacity: 0;');

        // Set the display none after animation
        setTimeout(function() {
          that.el.style.display = 'none';
        }, lateron);
      },

      text: function(text) {

        // If this.el is empty, block execution
        if (this._noEl()) { return null; }

        // If no arguments, return the innerText
        if (!text) { return this.el.innerText; }

        // Set the text of new node
        this.el.innerHTML = text;

        return this;
      },

      html: function(newHtml) {

        // If this.el is empty, block execution
        if (this._noEl()) { return null; }

        // If no arguments, return the innerHTML
        if (typeof newHtml === 'undefined') { return this.el.innerHTML; }

        // Set the text of new node
        this.el.innerHTML = newHtml;

        return this;
      },

      create: function(tag, options) {

        // Check if options is an object
        if (!options || typeof options !== 'object') { return; }

        // Create the new node
        var element = document.createElement(tag);

        // Set the object element
        this.el = element;

        // Memorize context
        this.context = element;

        // Set the ID
        if ('id' in options) { this.attr('id', options.id); }

        // Set the className
        if ('class' in options) { this.attr('class', options.class); }

        // Return the new node created
        return this;
      },

      _noEl: function() {

        // If this.el is empty, block execution
        if (!this.el || this.el.length < 1) {
          return true;
        } else {
          return false;
        }
      }
    };

    // Copy fake jQuery in public object
    win.$ = $;

    return $;
  });

}).call(this);

/*global define */
(function() {
  

  define('applications/base/application',['libs/fakejQuery'], function($) {

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

/*global define */
(function() {
  

  var win = this;

  define('views/base/view',['libs/fakejQuery'], function($) {

    var View = function(options) {

      // Define a master callback for main SiteView
      if (options && options.callback) { this.callback = options.callback; }
      if (options && options.container) { this.container = options.container; }

      // Autorun
      this.initialize();
    };

    View.prototype = {

      $el: null,

      autoRender: true,

      classes: null,

      container: null,

      el: null,

      events: null,

      eventsReady: false,

      id: null,

      loader: false,

      loaderTimeoutID: false,

      model: null,

      pager: null,

      subviews: {},

      subviewsByName: {},

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

        // Check if autoRender is set
        if (this.autoRender) {
          this.render();
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
          if (this.pager && this.pager.total && this.pager.num) {

            var num = this.pager.num,
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
          if (this.pager && this.pager.total && this.pager.num) {
            this.makePager();
          }
        }

        return this;
      },

      makePager: function() {

        // Empty the pager
        $(this.el).find('#pager').html('');

        var tot = this.model.collection.length || this.pager.total,
            num = this.pager.num,
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

        // Local function for DOM change event
        var onDomChange = function(){

          // Run also a class callback if exist
          if (that.callback) { that.callback(); }

          // Run parameter callback
          if (callback) { callback(); }

          // Load events for this view
          if (!that.eventsReady) { that.loadEvents(); }

          // Render also subviews
          if (that.subviews) { that.createSubViews(); }

          // Remove event listener
          $(that.container).el
            .removeEventListener('DOMSubtreeModified', onDomChange);
        };

        // Append the view rendered
        setTimeout(function(){

          // console.log(that.container, $(that.container).el);

          // Listening to DOM attach event
          $(that.container).el
            .addEventListener('DOMSubtreeModified', onDomChange, false);

          // Attach to the DOM
          $(that.container).append(that.el);

        }, 1);

        return this;
      },

      createSubViews: function() {

        // Make some checks
        if (Object.keys(this.subviewsByName).length > 0) { return; }
        else if (Object.keys(this.subviews).length === 0) { return; }

        var that = this;

        // Iterate subviews object
        for (var name in this.subviews) {

          // Instantiate subview
          that.subview(name, this.subviews[name]);
        }
      },

      subview: function(name, SubView, options) {

        // Check if options exist
        options = options || {};

        // Check if the subview is already existent
        if (this.subviewsByName[name]) {

          return this.subviewsByName[name];

        } else {

          // Set the proper container taken from the parent view
          options.container = '#'+this.id;

          // Instantiate the new SubView
          var view = new SubView(options);

          this.subviewsByName[name] = view;

          return view;
        }
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

/*global define */
(function() {
  

  define('models/base/model',['libs/fakejQuery'], function($) {

    /**
     * Model base
     */
    var Model = function() {

      // Autorun
      this.initialize();
    };

    /**
     * Set the endpoint url
     * @type string
     */
    Model.prototype.url = false;

    /**
     * Set search string
     * @type string
     */
    Model.prototype.searchTerm = null;

    /**
     * Attributes
     * @type object
     */
    Model.prototype.attributes = null;

    /**
     * Collection container
     * @type array
     */
    Model.prototype.collection = null;

    /**
     * Initialize the model
     * @return empty
     */
    Model.prototype.initialize = function() {};

    /**
     * [initialize description]
     * @return {[type]}
     */
    Model.prototype.parse = function(response) {

      // Copy response in attributes
      this.attributes = response;
    };

    /**
     * Fetch data from endpoint
     * @return Array
     */
    Model.prototype.fetch = function(callback) {

      var xhr, wrapCallback, that = this;

      // Stop execution if no url set
      if (!this.url || !this.searchTerm) { return; }

      // Wrap the original callback to do some stuff here
      wrapCallback = function(response) {

        // Parse the data and copy into attributes of model
        that.parse(response);

        // Original callback
        callback(response);
      };

      // Make the ajax call
      xhr = $.getJSON(this.url+this.searchTerm, wrapCallback, true);

      // Return the object response
      return xhr;
    };

    /**
     * Fetch data from endpoint
     * @return Array
     */
    Model.prototype.nextPage = function() {

      var data;

      // Stop execution if no url set
      if (!this.url) { return; }

      return data;
    };

    return Model;
  });

}).call(this);

/**
 * @license RequireJS text 2.0.12 Copyright (c) 2010-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */
/*jslint regexp: true */
/*global require, XMLHttpRequest, ActiveXObject,
  define, window, process, Packages,
  java, location, Components, FileUtils */

define('text',['module'], function (module) {
    

    var text, fs, Cc, Ci, xpcIsWindows,
        progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
        xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
        bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
        hasLocation = typeof location !== 'undefined' && location.href,
        defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ''),
        defaultHostName = hasLocation && location.hostname,
        defaultPort = hasLocation && (location.port || undefined),
        buildMap = {},
        masterConfig = (module.config && module.config()) || {};

    text = {
        version: '2.0.12',

        strip: function (content) {
            //Strips <?xml ...?> declarations so that external SVG and XML
            //documents can be added to a document without worry. Also, if the string
            //is an HTML document, only the part inside the body tag is returned.
            if (content) {
                content = content.replace(xmlRegExp, "");
                var matches = content.match(bodyRegExp);
                if (matches) {
                    content = matches[1];
                }
            } else {
                content = "";
            }
            return content;
        },

        jsEscape: function (content) {
            return content.replace(/(['\\])/g, '\\$1')
                .replace(/[\f]/g, "\\f")
                .replace(/[\b]/g, "\\b")
                .replace(/[\n]/g, "\\n")
                .replace(/[\t]/g, "\\t")
                .replace(/[\r]/g, "\\r")
                .replace(/[\u2028]/g, "\\u2028")
                .replace(/[\u2029]/g, "\\u2029");
        },

        createXhr: masterConfig.createXhr || function () {
            //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
            var xhr, i, progId;
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject !== "undefined") {
                for (i = 0; i < 3; i += 1) {
                    progId = progIds[i];
                    try {
                        xhr = new ActiveXObject(progId);
                    } catch (e) {}

                    if (xhr) {
                        progIds = [progId];  // so faster next time
                        break;
                    }
                }
            }

            return xhr;
        },

        /**
         * Parses a resource name into its component parts. Resource names
         * look like: module/name.ext!strip, where the !strip part is
         * optional.
         * @param {String} name the resource name
         * @returns {Object} with properties "moduleName", "ext" and "strip"
         * where strip is a boolean.
         */
        parseName: function (name) {
            var modName, ext, temp,
                strip = false,
                index = name.indexOf("."),
                isRelative = name.indexOf('./') === 0 ||
                             name.indexOf('../') === 0;

            if (index !== -1 && (!isRelative || index > 1)) {
                modName = name.substring(0, index);
                ext = name.substring(index + 1, name.length);
            } else {
                modName = name;
            }

            temp = ext || modName;
            index = temp.indexOf("!");
            if (index !== -1) {
                //Pull off the strip arg.
                strip = temp.substring(index + 1) === "strip";
                temp = temp.substring(0, index);
                if (ext) {
                    ext = temp;
                } else {
                    modName = temp;
                }
            }

            return {
                moduleName: modName,
                ext: ext,
                strip: strip
            };
        },

        xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,

        /**
         * Is an URL on another domain. Only works for browser use, returns
         * false in non-browser environments. Only used to know if an
         * optimized .js version of a text resource should be loaded
         * instead.
         * @param {String} url
         * @returns Boolean
         */
        useXhr: function (url, protocol, hostname, port) {
            var uProtocol, uHostName, uPort,
                match = text.xdRegExp.exec(url);
            if (!match) {
                return true;
            }
            uProtocol = match[2];
            uHostName = match[3];

            uHostName = uHostName.split(':');
            uPort = uHostName[1];
            uHostName = uHostName[0];

            return (!uProtocol || uProtocol === protocol) &&
                   (!uHostName || uHostName.toLowerCase() === hostname.toLowerCase()) &&
                   ((!uPort && !uHostName) || uPort === port);
        },

        finishLoad: function (name, strip, content, onLoad) {
            content = strip ? text.strip(content) : content;
            if (masterConfig.isBuild) {
                buildMap[name] = content;
            }
            onLoad(content);
        },

        load: function (name, req, onLoad, config) {
            //Name has format: some.module.filext!strip
            //The strip part is optional.
            //if strip is present, then that means only get the string contents
            //inside a body tag in an HTML string. For XML/SVG content it means
            //removing the <?xml ...?> declarations so the content can be inserted
            //into the current doc without problems.

            // Do not bother with the work if a build and text will
            // not be inlined.
            if (config && config.isBuild && !config.inlineText) {
                onLoad();
                return;
            }

            masterConfig.isBuild = config && config.isBuild;

            var parsed = text.parseName(name),
                nonStripName = parsed.moduleName +
                    (parsed.ext ? '.' + parsed.ext : ''),
                url = req.toUrl(nonStripName),
                useXhr = (masterConfig.useXhr) ||
                         text.useXhr;

            // Do not load if it is an empty: url
            if (url.indexOf('empty:') === 0) {
                onLoad();
                return;
            }

            //Load the text. Use XHR if possible and in a browser.
            if (!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort)) {
                text.get(url, function (content) {
                    text.finishLoad(name, parsed.strip, content, onLoad);
                }, function (err) {
                    if (onLoad.error) {
                        onLoad.error(err);
                    }
                });
            } else {
                //Need to fetch the resource across domains. Assume
                //the resource has been optimized into a JS module. Fetch
                //by the module name + extension, but do not include the
                //!strip part to avoid file system issues.
                req([nonStripName], function (content) {
                    text.finishLoad(parsed.moduleName + '.' + parsed.ext,
                                    parsed.strip, content, onLoad);
                });
            }
        },

        write: function (pluginName, moduleName, write, config) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var content = text.jsEscape(buildMap[moduleName]);
                write.asModule(pluginName + "!" + moduleName,
                               "define(function () { return '" +
                                   content +
                               "';});\n");
            }
        },

        writeFile: function (pluginName, moduleName, req, write, config) {
            var parsed = text.parseName(moduleName),
                extPart = parsed.ext ? '.' + parsed.ext : '',
                nonStripName = parsed.moduleName + extPart,
                //Use a '.js' file name so that it indicates it is a
                //script that can be loaded across domains.
                fileName = req.toUrl(parsed.moduleName + extPart) + '.js';

            //Leverage own load() method to load plugin value, but only
            //write out values that do not have the strip argument,
            //to avoid any potential issues with ! in file names.
            text.load(nonStripName, req, function (value) {
                //Use own write() method to construct full module value.
                //But need to create shell that translates writeFile's
                //write() to the right interface.
                var textWrite = function (contents) {
                    return write(fileName, contents);
                };
                textWrite.asModule = function (moduleName, contents) {
                    return write.asModule(moduleName, fileName, contents);
                };

                text.write(pluginName, nonStripName, textWrite, config);
            }, config);
        }
    };

    if (masterConfig.env === 'node' || (!masterConfig.env &&
            typeof process !== "undefined" &&
            process.versions &&
            !!process.versions.node &&
            !process.versions['node-webkit'])) {
        //Using special require.nodeRequire, something added by r.js.
        fs = require.nodeRequire('fs');

        text.get = function (url, callback, errback) {
            try {
                var file = fs.readFileSync(url, 'utf8');
                //Remove BOM (Byte Mark Order) from utf8 files if it is there.
                if (file.indexOf('\uFEFF') === 0) {
                    file = file.substring(1);
                }
                callback(file);
            } catch (e) {
                if (errback) {
                    errback(e);
                }
            }
        };
    } else if (masterConfig.env === 'xhr' || (!masterConfig.env &&
            text.createXhr())) {
        text.get = function (url, callback, errback, headers) {
            var xhr = text.createXhr(), header;
            xhr.open('GET', url, true);

            //Allow plugins direct access to xhr headers
            if (headers) {
                for (header in headers) {
                    if (headers.hasOwnProperty(header)) {
                        xhr.setRequestHeader(header.toLowerCase(), headers[header]);
                    }
                }
            }

            //Allow overrides specified in config
            if (masterConfig.onXhr) {
                masterConfig.onXhr(xhr, url);
            }

            xhr.onreadystatechange = function (evt) {
                var status, err;
                //Do not explicitly handle errors, those should be
                //visible via console output in the browser.
                if (xhr.readyState === 4) {
                    status = xhr.status || 0;
                    if (status > 399 && status < 600) {
                        //An http 4xx or 5xx error. Signal an error.
                        err = new Error(url + ' HTTP status: ' + status);
                        err.xhr = xhr;
                        if (errback) {
                            errback(err);
                        }
                    } else {
                        callback(xhr.responseText);
                    }

                    if (masterConfig.onXhrComplete) {
                        masterConfig.onXhrComplete(xhr, url);
                    }
                }
            };
            xhr.send(null);
        };
    } else if (masterConfig.env === 'rhino' || (!masterConfig.env &&
            typeof Packages !== 'undefined' && typeof java !== 'undefined')) {
        //Why Java, why is this so awkward?
        text.get = function (url, callback) {
            var stringBuffer, line,
                encoding = "utf-8",
                file = new java.io.File(url),
                lineSeparator = java.lang.System.getProperty("line.separator"),
                input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)),
                content = '';
            try {
                stringBuffer = new java.lang.StringBuffer();
                line = input.readLine();

                // Byte Order Mark (BOM) - The Unicode Standard, version 3.0, page 324
                // http://www.unicode.org/faq/utf_bom.html

                // Note that when we use utf-8, the BOM should appear as "EF BB BF", but it doesn't due to this bug in the JDK:
                // http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4508058
                if (line && line.length() && line.charAt(0) === 0xfeff) {
                    // Eat the BOM, since we've already found the encoding on this file,
                    // and we plan to concatenating this buffer with others; the BOM should
                    // only appear at the top of a file.
                    line = line.substring(1);
                }

                if (line !== null) {
                    stringBuffer.append(line);
                }

                while ((line = input.readLine()) !== null) {
                    stringBuffer.append(lineSeparator);
                    stringBuffer.append(line);
                }
                //Make sure we return a JavaScript string and not a Java string.
                content = String(stringBuffer.toString()); //String
            } finally {
                input.close();
            }
            callback(content);
        };
    } else if (masterConfig.env === 'xpconnect' || (!masterConfig.env &&
            typeof Components !== 'undefined' && Components.classes &&
            Components.interfaces)) {
        //Avert your gaze!
        Cc = Components.classes;
        Ci = Components.interfaces;
        Components.utils['import']('resource://gre/modules/FileUtils.jsm');
        xpcIsWindows = ('@mozilla.org/windows-registry-key;1' in Cc);

        text.get = function (url, callback) {
            var inStream, convertStream, fileObj,
                readData = {};

            if (xpcIsWindows) {
                url = url.replace(/\//g, '\\');
            }

            fileObj = new FileUtils.File(url);

            //XPCOM, you so crazy
            try {
                inStream = Cc['@mozilla.org/network/file-input-stream;1']
                           .createInstance(Ci.nsIFileInputStream);
                inStream.init(fileObj, 1, 0, false);

                convertStream = Cc['@mozilla.org/intl/converter-input-stream;1']
                                .createInstance(Ci.nsIConverterInputStream);
                convertStream.init(inStream, "utf-8", inStream.available(),
                Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);

                convertStream.readString(inStream.available(), readData);
                convertStream.close();
                inStream.close();
                callback(readData.value);
            } catch (e) {
                throw new Error((fileObj && fileObj.path || '') + ': ' + e);
            }
        };
    }
    return text;
});


define('text!templates/site-view.html',[],function () { return '<!-- Top box -->\n<header id="header"></header>\n\n<!-- Main section of the page structure -->\n<section id="main" class="main"></section>\n';});

/*global define */
(function() {
  

  define('views/site-view',[
    'views/base/view',
    'models/base/model',
    'text!templates/site-view.html'
  ], function(View, Model, Template) {

    var SiteView = function() {

      // Call parent application class
      View.apply(this, arguments);
    };

    // Extend prototype
    SiteView.prototype = Object.create(View.prototype);

    SiteView.prototype.autoRender = true;

    SiteView.prototype.classes = 'wrapper';

    SiteView.prototype.container = '#app';

    SiteView.prototype.id = 'site-view';

    SiteView.prototype.template = Template;

    return SiteView;
  });

}).call(this);


define('text!templates/header-view.html',[],function () { return '<form name="search" id="search">\n  <div class="input-groups">\n\n    <div class="input w80">\n      <input type="search" name="q" placeholder="Search..." autocapitalize="off" autocorrect="off" autocomplete="off" />\n    </div>\n\n    <div class="input w20">\n      <input type="submit" name="s" value="Search" />\n    </div>\n\n  </div>\n</form>\n';});

/*global define */
(function() {
  

  // Copy the window object in win
  var win = this;

  define('views/header-view',[
    'views/base/view',
    'text!templates/header-view.html'
  ], function(View, Template) {

    /**
     * Pre-listen to submit event
     * @param  eventType, element, function
     * @return empty
     */
    var submitSearch = function(self){

      self.listenTo('submit', '#search', function(evt){

        var input, errorMessage, q, onFocusInput, SubViews;

        // Prevent normal submission
        evt.preventDefault();

        // Error message
        errorMessage = 'Insert a term...';

        // Set input variable from event target
        input = evt.target[0];

        // Check if input is empty
        if (input.value.length < 1 || input.value === errorMessage) {

          // Cancel pending setTimeout
          clearTimeout(win.searchOnFocus);

          // Local func to reset the input original status
          onFocusInput = function() {

            // Set to empty value
            input.value = '';

            // Remove class error on parent
            $(input.parentElement).removeClass('error');

            // Cancel itself
            input.removeEventListener('focus', onFocusInput);
          };

          // Set a message in the field
          input.value = errorMessage;

          // Add class error on parent
          $(input.parentElement).addClass('error');

          // Listen the input focus
          input.addEventListener('focus', onFocusInput);

          // Forced run of input resetting status after 2.5sec
          win.searchOnFocus = setTimeout(function(){
            onFocusInput();
          }, 2500);

          // Stop the process
          return;
        }

        // Search term
        q = input.value;

        // Take Subviews from mediator
        SubViews = win.mediator.MainView.subviewsByName;

        // Making image search
        SubViews.SearchImages.model.search(q, {

          before: function() {

            // Render and show loader
            SubViews.SearchImages.render()
              .showLoader(false, false, false, 'nested');
          },

          after: function(){

            // Render items collection
            SubViews.SearchImages.renderItems(function(){

              // Hide loader in the end
              SubViews.SearchImages.hideLoader(150);
            });
          }
        });

        // Making textual search
        SubViews.SearchTexts.model.search(q, {

          before: function() {

            // Render and show loader
            SubViews.SearchTexts.render()
              .showLoader(false, false, false, 'nested');
          },

          after: function(){

            // Render items collection
            SubViews.SearchTexts.renderItems(function(){

              // Hide loader in the end
              SubViews.SearchTexts.hideLoader(150);
            });
          }
        });

        // Update page title
        var prevTitle = document.title.split('|');
        document.title = q + ' | ' + (prevTitle.length > 1 ? prevTitle[1] : prevTitle[0]);

        // Set to empty value
        input.value = '';
        input.blur();
      });
    };

    /**
     * Header view class
     */
    var HeaderView = function(){

      // Call base view
      View.apply(this, arguments);
    };

    // Extend prototype
    HeaderView.prototype = Object.create(View.prototype);

    HeaderView.prototype.id = 'header-view';

    HeaderView.prototype.classes = 'header-container';

    HeaderView.prototype.container = '#header';

    HeaderView.prototype.template = Template;

    HeaderView.prototype.events = [submitSearch];

    return HeaderView;
  });

}).call(this);


define('text!templates/main-images-view.html',[],function () { return '<!-- Image result section -->\n<section id="search-result-images" class="search-result-images">\n\n  <h2>Image result</h2>\n\n  <div class="results" id="results"></div>\n\n</section>\n\n<script type="text/template" id="serp-image-item">\n<article>\n  <a href="javascript:window.u.openLink(\'{{link}}\')" target="_blank" style="background-image:url(\'{{image.thumbnailLink}}\')" title="{{title}}"></a>\n</article>\n</script>\n';});

/*global define */
(function() {
  

  define('models/goo-serp-images-result',['libs/fakejQuery', 'models/base/model'], function($, Model) {

    var ModelImages = function() {

      // Set the endpoint url
      this.url = 'https://www.googleapis.com/customsearch/v1' +
                 '?num=9&cx=004417568209807888223%3A6slior__w8o&' +
                 'key=AIzaSyDuRaWmTk3jDfm1u4ejlHICRNYXaO2-BV8&' +
                 'searchType=image&imgSize=small&alt=json&q=';

      // this.url = '../dummy-api/dummy-image-result-q-lectures.json?';

      // Call model parent
      Model.call(this, arguments);
    };

    // Extend prototype
    ModelImages.prototype = Object.create(Model.prototype);

    /**
     * Hook of parse
     * @return {[type]}
     */
    ModelImages.prototype.parse = function(response) {

      // Reset the model in case of no result
      if (Number(response.searchInformation.totalResults) === 0) {
        this.collection = null;
      }

      // Stop execution
      if (!response || !response.items) { return; }

      // Copy response items in collection instead of attributes
      this.collection = response.items;

      return response.items;
    };

    /**
     * Fetch data from endpoint
     * @return Array
     */
    ModelImages.prototype.search = function(q, callbacks) {

      // Run before function
      if (callbacks.before) { callbacks.before(); }

      // Set the search term
      this.searchTerm = encodeURI(q);

      // Return the ajax call
      return this.fetch(callbacks && callbacks.after);
    };

    return ModelImages;
  });

}).call(this);

/*global define */
(function() {
  

  define('views/searchimages-view',[
    'views/base/view',
    'text!templates/main-images-view.html',
    'models/goo-serp-images-result',
  ], function(View, Template, Model) {

    /**
     * Pre-listen to h2 tag
     * @param  eventType, element, function
     * @return empty
     */
    var clickH2 = function(self){

      self.listenTo('click', 'h2', function(evt){

        var parent = evt.target.parentElement;

        if ($(parent).hasClass('closed')) {

          $(parent).removeClass('closed');

        } else {

          $(parent).addClass('closed');
        }
      });
    };

    /**
     * SearchImagesView class
     */
    var SearchImagesView = function(options) {

      // Call parent
      View.call(this, options);
    };

    // Extend
    SearchImagesView.prototype = Object.create(View.prototype);

    SearchImagesView.prototype.id = 'main-images-view';

    SearchImagesView.prototype.classes = 'box w50';

    SearchImagesView.prototype.autoRender = false;

    SearchImagesView.prototype.template = Template;

    SearchImagesView.prototype.model = new Model();

    SearchImagesView.prototype.itemTpl = '#serp-image-item';

    SearchImagesView.prototype.itemsContainer = '#results';

    SearchImagesView.prototype.events = [clickH2];

    return SearchImagesView;
  });

}).call(this);


define('text!templates/main-texts-view.html',[],function () { return '<!-- Textual result section -->\n<section id="search-result-texts" class="search-result-texts">\n\n  <h2>Web result</h2>\n\n  <div class="results" id="results"></div>\n\n  <footer class="pager" id="pager"></footer>\n\n</section>\n\n<script type="text/template" id="serp-text-item">\n<article>\n  <span class="title">{{htmlTitle}}</span>\n  <span class="link"><a href="javascript:window.u.openLink(\'{{link}}\')" target="_blank">{{htmlFormattedUrl}}</a></span>\n  <span class="text">{{htmlSnippet}}</span>\n</article>\n</script>\n';});

/*global define */
(function() {
  

  define('models/goo-serp-texts-result',['libs/fakejQuery', 'models/base/model'], function($, Model) {

    var ModelTexts = function() {

      // Set the endpoint url
      this.url = 'https://www.googleapis.com/customsearch/v1' +
                 '?cx=004417568209807888223%3A6slior__w8o&' +
                 'key=AIzaSyDuRaWmTk3jDfm1u4ejlHICRNYXaO2-BV8&num=9&q=';

      // this.url = '../dummy-api/dummy-text-result-q-lectures.json?';

      // Call model parent
      Model.call(this, arguments);
    };

    // Extend prototype
    ModelTexts.prototype = Object.create(Model.prototype);

    /**
     * Hook of parse
     * @return Array
     */
    ModelTexts.prototype.parse = function(response) {

      // Reset the model in case of no result
      if (Number(response.searchInformation.totalResults) === 0) {
        this.collection = null;
      }

      // Stop execution
      if (!response || !response.items) { return; }

      // Copy response items in collection instead of attributes
      this.collection = response.items;

      return response.items;
    };

    /**
     * Fetch data from endpoint
     * @return Array
     */
    ModelTexts.prototype.search = function(q, callbacks) {

      // Run before function
      if (callbacks.before) { callbacks.before(); }

      // Set the search term
      this.searchTerm = encodeURI(q);

      // Return the ajax call
      return this.fetch(callbacks && callbacks.after);
    };

    return ModelTexts;
  });

}).call(this);

/*global define */
(function() {
  

  define('views/searchtexts-view',[
    'views/base/view',
    'text!templates/main-texts-view.html',
    'models/goo-serp-texts-result'
  ], function(View, Template, Model) {

    /**
     * Pre-listen to h2 tag
     * @param  eventType, element, function
     * @return empty
     */
    var clickH2 = function(self){

      self.listenTo('click', 'h2', function(evt){

        var parent = evt.target.parentElement;

        if ($(parent).hasClass('closed')) {

          $(parent).removeClass('closed');

        } else {

          $(parent).addClass('closed');
        }
      });
    };

    /**
     * SearchTextsView class
     */
    var SearchTextsView = function(options) {

      // Call parent
      View.call(this, options);
    };

    // Extend
    SearchTextsView.prototype = Object.create(View.prototype);

    SearchTextsView.prototype.id = 'main-texts-view';

    SearchTextsView.prototype.classes = 'box w50';

    SearchTextsView.prototype.autoRender = false;

    SearchTextsView.prototype.template = Template;

    SearchTextsView.prototype.model = new Model();

    SearchTextsView.prototype.itemTpl = '#serp-text-item';

    SearchTextsView.prototype.itemsContainer = '#results';

    SearchTextsView.prototype.events = [clickH2];

    SearchTextsView.prototype.pager = {'total': 9, 'num': 3};

    return SearchTextsView;
  });

}).call(this);

/*global define */
(function() {
  

  var win = this;

  define('views/main-view',[
    'views/base/view',
    'views/searchimages-view',
    'views/searchtexts-view'
  ], function(View, SearchImages, SearchTexts) {

    /**
     * Istantiate the MainView
     * @type {View}
     */
    var MainView = function(){

      // Call base view
      View.apply(this, arguments);
    };

    // Extend prototype
    MainView.prototype = Object.create(View.prototype);

    MainView.prototype.id = 'main-view';

    MainView.prototype.classes = 'main-container boxes';

    MainView.prototype.container = '#main';

    MainView.prototype.callback = function(){

      // Register MainView in mediator
      win.mediator.MainView = this;
    };

    /**
     * Lists the subviews that need to be instantiated
     * @type array
     */
    MainView.prototype.subviews = {
      'SearchImages': SearchImages,
      'SearchTexts': SearchTexts
    };

    return MainView;
  });

}).call(this);

/*global define */
(function() {
  

  define('applications/single-page-app',[
    'libs/fakejQuery',
    'applications/base/application',
    'views/site-view',
    'views/header-view',
    'views/main-view'
  ], function($, Application, SiteView, HeadView, MainView) {

    /**
     * Single Page App main class
     */
    var SinglePageApp = function() {

      // Call parent application class
      Application.apply(this, arguments);
    };

    /**
     * Extend prototype class
     */
    SinglePageApp.prototype = Object.create(Application.prototype);

    /**
     * Set the main view of the app
     */
    SinglePageApp.prototype.main = SiteView;

    /**
     * Set the list of regions view of the main view
     */
    SinglePageApp.prototype.regions = [HeadView, MainView];

    return SinglePageApp;
  });

}).call(this);

/**
 * Utility functions collection
 */
(function() {
  

  // Shortcut to window public object
  var win = this;

  // Object container for utility functions
  var u = {

    openLink: function(url) {

      // Switch for isPhonegap
      if (win.isPhonegap) {

        win.navigator.app.loadUrl(url, { openExternal:true });

      } else {

        win.open(url, '_blank');
      }
    }

  };

  // Copy in public object
  win.u = u;

}).call(window);

define("libs/utility", function(){});

/*global window, requirejs */
/**
 * Bootstrap file
 */

// Configure loading modules from the lib directory, except for 'app' ones,
// which are in a sibling directory.
requirejs.config({
    baseUrl: 'scripts',
    paths: {
      app: '../scripts',
      text: '../../bower_components/requirejs-text/text'
    }
});

/**
 * Wrapped function for real bootstrap of the app
 */
(function() {
  

  // Copy the window object in win
  var win = this;

  // Initialize the mediator
  win.mediator = {};

  // Set a public element to reuse in the app as flag for PhoneGap/Cordova app
  // recognition
  win.isPhonegap = false;

  // Starting the app when the DOM is ready/loaded
  document.addEventListener('DOMContentLoaded', function() {

    // Some console output
    console.info('DOM Loaded,', 'Cordova: ' + ('cordova' in win));

    requirejs(['applications/single-page-app', 'libs/utility'], function(SingleAppPage) {

      // onDeviceReady function to start the application
      var onDeviceReady = function() {

        // Instantiate the new app
        new SingleAppPage({
          'container': '#app'
        });
      };

      // If is Cordova/PhoneGap app, listen the deviceready event for start.
      // Otherwise just run the onDeviceReady fucntion
      if ('cordova' in win) {

        document.addEventListener('deviceready', onDeviceReady, false);

        // Update this public value for PhoneGap/Cordova app recognition
        win.isPhonegap = true;

      } else {
        onDeviceReady();
      }
    });

  }, false);

}).call(window);

define("bootstrap", function(){});

