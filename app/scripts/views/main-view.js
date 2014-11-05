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
      'autoRender': false,
      'template': TplMainImages,
      'model': new ModelImages(),
      'itemTpl': '#serp-image-item',
      'itemsContainer': '#results'
    });

    // Add new subview
    MainView.subview('SearchTexts', {
      'id': 'main-texts-view',
      'classes': 'box w50',
      'autoRender': false,
      'template': TplMainTexts,
      'model': new ModelTexts(),
      'itemTpl': '#serp-text-item',
      'itemsContainer': '#results',
      'pager': {
        'total': 9,
        'num': 3
      }
    });

    /**
     * Listen to submit event
     * @param  eventType, element, function
     * @return empty
     */
    MainView.listenTo('submit', '#search', function(evt){

      var input, errorMessage, q, onFocusInput, before, that = MainView;

      // Prevent normal submission
      evt.preventDefault();

      // Error message
      errorMessage = 'Insert a term...';

      // Set input variable from event target
      input = evt.target[0];

      // Check if input is empty
      if (input.value.length < 1 || input.value === errorMessage) {

        // Cancel pending setTimeout
        clearTimeout(win.searchOnFocus);

        // Local func to reset the input original status
        onFocusInput = function() {

          // Set to empty value
          input.value = '';

          // Remove class error on parent
          $(input.parentElement).removeClass('error');

          // Cancel itself
          input.removeEventListener('focus', onFocusInput);
        };

        // Set a message in the field
        input.value = errorMessage;

        // Add class error on parent
        $(input.parentElement).addClass('error');

        // Listen the input focus
        input.addEventListener('focus', onFocusInput);

        // Forced run of input resetting status after 2.5sec
        win.searchOnFocus = setTimeout(function(){
          onFocusInput();
        }, 2500);

        // Stop the process
        return;
      }

      // Search term
      q = input.value;

      // Making image search
      that.subviewsByName.SearchImages.model.search(q, {

        before: function() {

          // Render items collection
          that.subviewsByName.SearchImages.render(function(){

            // Show the loader
            that.subviewsByName.SearchImages.showLoader(false, false, false, 'nested');
          });
        },

        after: function(){

          //
          that.subviewsByName.SearchImages.renderItems();

          // Hide loader in the end
          that.subviewsByName.SearchImages.hideLoader(150);
        }
      });

      // Making textual search
      that.subviewsByName.SearchTexts.model.search(q, {

        before: function() {

          // Render items collection
          that.subviewsByName.SearchTexts.render(function(){

            // Show the loader
            that.subviewsByName.SearchTexts.showLoader(false, false, false, 'nested');
          });
        },

        after: function(){

          //
          that.subviewsByName.SearchTexts.renderItems();

          // Hide loader in the end
          that.subviewsByName.SearchTexts.hideLoader(150);
        }
      });

      // Update page title
      var prevTitle = document.title.split('|');
      document.title = q + ' | ' + (prevTitle.length > 1 ? prevTitle[1] : prevTitle[0]);

      // Set to empty value
      input.value = '';
      input.blur();
    });
    return MainView;
  });

}).call(this);
