/*global define */
(function() {
  'use strict';

  // Copy the window object in win
  var win = this;

  define([
    'views/base/view',
    'text!templates/header-view.html'
  ], function(View, Template) {

    /**
     * Pre-listen to submit event
     * @param  eventType, element, function
     * @return empty
     */
    var submitSearch = function(self){

      self.listenTo('submit', '#search', function(evt){

        var input, errorMessage, q, onFocusInput, SubViews;

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

        // Take Subviews from mediator
        SubViews = win.mediator.MainView.subviewsByName;

        // Making image search
        SubViews.SearchImages.model.search(q, {

          before: function() {

            // Render and show loader
            SubViews.SearchImages.render()
              .showLoader(false, false, false, 'nested');
          },

          after: function(){

            // Render items collection
            SubViews.SearchImages.renderItems(function(){

              // Hide loader in the end
              SubViews.SearchImages.hideLoader(150);
            });
          }
        });

        // Making textual search
        SubViews.SearchTexts.model.search(q, {

          before: function() {

            // Render and show loader
            SubViews.SearchTexts.render()
              .showLoader(false, false, false, 'nested');
          },

          after: function(){

            // Render items collection
            SubViews.SearchTexts.renderItems(function(){

              // Hide loader in the end
              SubViews.SearchTexts.hideLoader(150);
            });
          }
        });

        // Update page title
        var prevTitle = document.title.split('|');
        document.title = q + ' | ' + (prevTitle.length > 1 ? prevTitle[1] : prevTitle[0]);

        // Set to empty value
        input.value = '';
        input.blur();
      });
    };

    /**
     * Header view class
     */
    var HeaderView = function(){

      // Call base view
      View.apply(this, arguments);
    };

    // Extend prototype
    HeaderView.prototype = Object.create(View.prototype);

    HeaderView.prototype.id = 'header-view';

    HeaderView.prototype.classes = 'header-container';

    HeaderView.prototype.container = '#header';

    HeaderView.prototype.template = Template;

    HeaderView.prototype.events = [submitSearch];

    return HeaderView;
  });

}).call(this);
