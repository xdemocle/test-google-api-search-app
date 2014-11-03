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

      evt.preventDefault();

      console.log(arguments);

    });

    return HeaderView;
  });

}).call(this);
