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

    return HeaderView;
  });

}).call(this);
