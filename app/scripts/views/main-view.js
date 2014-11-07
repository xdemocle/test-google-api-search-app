/*global define */
(function() {
  'use strict';

  var win = this;

  define([
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
