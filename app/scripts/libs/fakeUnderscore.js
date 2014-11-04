/*!
 *
 *  Fake Underscore
 *
 */

/*global define */
(function() {
  'use strict';

  var win = this;

  define(function() {

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
