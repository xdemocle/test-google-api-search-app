/*global define */
(function() {
  'use strict';

  define([
    'views/base/view'
  ], function(View) {

    var SearchTextsView = function(options) {

      // Call parent
      View.call(this, options);
    };

    // Extend
    SearchTextsView.prototype = Object.create(View.prototype);

    return SearchTextsView;
  });

}).call(this);
