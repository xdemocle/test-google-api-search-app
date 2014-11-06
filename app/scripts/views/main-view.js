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

    /**
     * Pre-listen to h2 tag
     * @param  eventType, element, function
     * @return empty
     */
    var clickH2 = function(self){

      self.listenTo('click', 'h2', function(evt){

        var parent = evt.target.parentElement;

        if ($(parent).hasClass('closed')) {

          $(parent).removeClass('closed');

        } else {

          $(parent).addClass('closed');
        }
      });
    };

    /**
     * Istantiate the MainView
     * @type {View}
     */
    var MainView = new View({
      'id': 'main-view',
      'container': '#main',
      'classes': 'main-container boxes'
    });

    /**
     * Istantiate a subview
     */
    MainView.subview('SearchImages', {
      'id': 'main-images-view',
      'classes': 'box w50',
      'autoRender': false,
      'template': TplMainImages,
      'model': new ModelImages(),
      'itemTpl': '#serp-image-item',
      'itemsContainer': '#results',
      'events': [clickH2]
    });

    /**
     * Istantiate a subview
     */
    MainView.subview('SearchTexts', {
      'id': 'main-texts-view',
      'classes': 'box w50',
      'autoRender': false,
      'template': TplMainTexts,
      'model': new ModelTexts(),
      'itemTpl': '#serp-text-item',
      'itemsContainer': '#results',
      'events': [clickH2],
      'pager': {
        'total': 9,
        'num': 3
      }
    });

    // Register MainView in mediator
    win.mediator.MainView = MainView;

    return MainView;
  });

}).call(this);
