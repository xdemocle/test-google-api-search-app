/*global define */
(function() {
  'use strict';

  define([
    'views/base/view',
    'models/base/model',
    'text!templates/site-view.html'
  ], function(View, Model, Template) {

    var SiteView = new View({
      'id': 'site-view',
      // 'model': 'modellll',
      'template': Template
    });

    return SiteView;
  });

}).call(this);
