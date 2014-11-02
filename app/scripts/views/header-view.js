/*global define */
(function() {
  'use strict';

  define([
    'views/base/view',
    'text!templates/header-view.html'
  ], function(View, Template) {

    var HeaderView = new View({
      'id': 'header-view',
      'container': '#header',
      'template': Template
    });

    return HeaderView;
  });

}).call(this);
