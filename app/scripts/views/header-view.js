/*global define */
(function() {
  'use strict';

  define([
    'views/base/view',
    'text!templates/header-view.html'
  ], function(View, Template) {

    var HeaderView = new View({
      'id': 'header-view',
      'classes': 'header-container',
      'container': '#header',
      'template': Template
    });

    // Listen to submit
    HeaderView.listenTo('submit', '#search', function(evt){

      // Prevent normal submission
      evt.preventDefault();

      // console.log(evt);

      // Set input variable from event target
      var input = evt.target[0];

      // Check if input is empty
      if (input.value.length < 1) {

        // Set a message in the field
        input.value = 'Insert a term...';

        // Add class error on parent
        $(input.parentElement).addClass('error');

        var onfocus = function() {

          // Set to empty value
          input.value = '';

          // Remove class error on parent
          $(input.parentElement).removeClass('error');

          // Canel itself
          input.removeEventListener('focus', onfocus);
        };

        input.addEventListener('focus', onfocus);

        setTimeout(function(){
          onfocus();
        }, 1500)

        // Stop the process
        return;
      }

      console.log(HeaderView);
    });

    return HeaderView;
  });

}).call(this);
