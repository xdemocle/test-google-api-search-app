/*!
 *
 *  Fake Underscore for 24i
 *
 */

/*global define */
(function() {
  'use strict';

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
        var arr=new Array();
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
    window._ = _;

    return _;
  });

}).call(this);
