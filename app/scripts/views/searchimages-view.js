/*global define */
(function() {
  'use strict';

  define([
    'views/base/view'
  ], function(View) {

    var SearchImagesView = function(options) {

      // Call parent
      View.call(this, options);
    };

    // Extend
    SearchImagesView.prototype = Object.create(View.prototype);

    return SearchImagesView;
  });

}).call(this);
