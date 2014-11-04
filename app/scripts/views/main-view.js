/*global define */
(function() {
  'use strict';

  var win = this;

  define([
    'views/base/view',
    'text!templates/main-images-view.html',
    'text!templates/main-texts-view.html',
    'models/goo-serp-texts-result',
    'models/goo-serp-images-result'
  ], function(View, TplMainImages, TplMainTexts, ModelTexts, ModelImages) {

    var MainView = new View({
      'id': 'main-view',
      'container': '#main',
      'classes': 'main-container boxes'
    });

    // Add new subview
    MainView.subview('SearchImages', {
      'id': 'main-images-view',
      'classes': 'box w50',
      'template': TplMainImages,
      'model': new ModelImages(),
      'itemTpl': '#serp-image-item',
      'itemsContainer': '#results'
    });

    // Add new subview
    MainView.subview('SearchTexts', {
      'id': 'main-texts-view',
      'classes': 'box w50',
      'template': TplMainTexts,
      'model': new ModelTexts(),
      'itemTpl': '#serp-text-item',
      'itemsContainer': '#results'
    });

    /**
     * Register in window object our subviews models
     * @type Object
     */
    win.mainViews = MainView.subviewsByName;

    return MainView;
  });

}).call(this);
