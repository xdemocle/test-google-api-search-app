/*global define */
(function() {
  'use strict';

  define(['libs/fakejQuery'], function($) {

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
