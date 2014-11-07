/*global define */
(function() {
  'use strict';

  define([
    'views/base/view',
    'models/base/model',
    'text!templates/site-view.html'
  ], function(View, Model, Template) {

    var SiteView = function() {

      // Call parent application class
      View.apply(this, arguments);
    };

    // Extend prototype
    SiteView.prototype = Object.create(View.prototype);

    SiteView.prototype.autoRender = true;

    SiteView.prototype.classes = 'wrapper';

    SiteView.prototype.container = '#app';

    SiteView.prototype.id = 'site-view';

    SiteView.prototype.template = Template;

    return SiteView;
  });

}).call(this);
