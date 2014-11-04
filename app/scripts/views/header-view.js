/*global define */
(function() {
  'use strict';

  var win = this;

  define([
    'views/base/view',
    'text!templates/header-view.html'
  ], function(View, Template) {

    /**
     * Istantiating the header view
     * @type View
     */
    var HeaderView = new View({
      'id': 'header-view',
      'classes': 'header-container',
      'container': '#header',
      'template': Template
    });

    /**
     * Listen to submit event
     * @param  eventType, element, function
     * @return empty
     */
    HeaderView.listenTo('submit', '#search', function(evt){

      var input, errorMessage, q, onFocusInput;

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

      HeaderView.showLoader(false, false, '0.5');

      // Making textual search
      win.mainViews.SearchTexts.model.search(q, function(){

        // Render again
        win.mainViews.SearchTexts.renderItems();
      });

      // Making image search
      win.mainViews.SearchImages.model.search(q, function(){

        // Render again
        win.mainViews.SearchImages.renderItems(function(){

          // Hide loader in the end
          HeaderView.hideLoader();
        });
      });

      // Set to empty value
      input.value = '';
    });

    return HeaderView;
  });

}).call(this);
