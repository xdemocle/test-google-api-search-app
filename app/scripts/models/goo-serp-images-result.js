/*global define */
(function() {
  'use strict';

  define(['libs/fakejQuery', 'models/base/model'], function($, Model) {

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
      this.fetch(callbacks && callbacks.after);
    };

    return ModelImages;
  });

}).call(this);
