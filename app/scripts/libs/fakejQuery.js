/*!
 *
 *  Fake jQuery for 24i
 *
 */

/*global define */
(function() {
  'use strict';

  define(['libs/fakeUnderscore'], function(_) {

    var document = window.document;

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

        // Define if the selector is a class or id or a complex select
        if (selector.split(' ').length > 1) {

          elements = context.querySelectorAll(selector);

        } else if (type === '.') {

          if (Obj && typeof Obj.item === 'function') {

            context = _.toArray(context);

            context.forEach(function(needle, index, context){

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

          // Set only the first needle if isn't empty
          if (needle = context.getElementById(target)) {
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

      show: function() {

        this.el.style.display = 'block';
        this.attr('style', 'transition: .2s linear all; opacity: 1;');
      },

      hide: function() {

        var that = this;

        this.attr('style', 'transition: .2s linear all; opacity: 0;');

        setTimeout(function() {
          that.el.style.display = 'none';
        }, 300);
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
        if (!newHtml) { return this.el.innerHTML; }

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
    window.$ = $;

    return $;
  });

}).call(this);
