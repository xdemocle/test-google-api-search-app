/*global define */
(function() {
  'use strict';

  define(['libs/fakejQuery'], function($) {

    var Model = function() {

      // Autorun
      this.initialize();
    }

    Model.prototype.initialize = function() {

      console.info('base model');
    }

    return Model;
  });

}).call(this);
