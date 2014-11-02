/*global define */
(function() {
  'use strict';

  define([
    'views/base/view',
    'text!templates/main-images-view.html',
    'text!templates/main-texts-view.html'
  ], function(View, TemplateMainImages, TemplateMainTexts) {

    var MainView = new View({
      'id': 'main-view',
      'container': '#main',
      'classes': 'box-container'
    });

    // Add new subview
    MainView.subview('SearchImages', {
      'id': 'main-images-view',
      'classes': 'box w50',
      'template': TemplateMainImages
    });

    // Add new subview
    MainView.subview('SearchTexts', {
      'id': 'main-texts-view',
      'classes': 'box w50',
      'template': TemplateMainTexts
    });

    return MainView;
  });

}).call(this);
