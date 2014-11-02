/*global define */
(function() {
  'use strict';

  define([
    'views/base/view',
    'text!templates/footer-view.html'
  ], function(View, Template) {

    var FooterView = new View({
      'id': 'footer-view',
      'container': '#footer',
      'template': Template
    });

    return FooterView;
  });

}).call(this);
