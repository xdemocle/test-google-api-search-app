/*global define */
(function() {
  'use strict';

  define([
    'views/base/view',
    'text!templates/main-images-view.html',
    'models/goo-serp-images-result',
  ], function(View, Template, Model) {

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
     * SearchImagesView class
     */
    var SearchImagesView = function(options) {

      // Call parent
      View.call(this, options);
    };

    // Extend
    SearchImagesView.prototype = Object.create(View.prototype);

    SearchImagesView.prototype.id = 'main-images-view';

    SearchImagesView.prototype.classes = 'box w50';

    SearchImagesView.prototype.autoRender = false;

    SearchImagesView.prototype.template = Template;

    SearchImagesView.prototype.model = new Model();

    SearchImagesView.prototype.itemTpl = '#serp-image-item';

    SearchImagesView.prototype.itemsContainer = '#results';

    SearchImagesView.prototype.events = [clickH2];

    return SearchImagesView;
  });

}).call(this);
