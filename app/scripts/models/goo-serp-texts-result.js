/*global define */
(function() {
  'use strict';

  define(['libs/fakejQuery', 'models/base/model'], function($, Model) {

    var ModelTexts = function() {

      // Set the endpoint url
      this.url = 'https://www.googleapis.com/customsearch/v1' +
                 '?cx=004417568209807888223%3A6slior__w8o&' +
                 'key=AIzaSyDuRaWmTk3jDfm1u4ejlHICRNYXaO2-BV8&q=';

      this.url = '../dummy-api/dummy-text-result-q-lectures.json?';

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
      return this.fetch(callbacks.after);
    };

    return ModelTexts;
  });

}).call(this);
