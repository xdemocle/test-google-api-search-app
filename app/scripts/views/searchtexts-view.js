/*global define */
(function() {
  'use strict';

  define([
    'views/base/view',
    'text!templates/main-texts-view.html',
    'models/goo-serp-texts-result'
  ], function(View, Template, Model) {

    /**
     * Pre-listen to h2 tag
     * @param  eventType, element, function
     * @return empty
     */
    var clickH2 = function(self){

      self.listenTo('click', 'h2', function(evt){

        var parent = evt.target.parentElement;

        if ($(parent).hasClass('closed')) {

          $(parent).removeClass('closed');

        } else {

          $(parent).addClass('closed');
        }
      });
    };

    /**
     * SearchTextsView class
     */
    var SearchTextsView = function(options) {

      // Call parent
      View.call(this, options);
    };

    // Extend
    SearchTextsView.prototype = Object.create(View.prototype);

    SearchTextsView.prototype.id = 'main-texts-view';

    SearchTextsView.prototype.classes = 'box w50';

    SearchTextsView.prototype.autoRender = false;

    SearchTextsView.prototype.template = Template;

    SearchTextsView.prototype.model = new Model();

    SearchTextsView.prototype.itemTpl = '#serp-text-item';

    SearchTextsView.prototype.itemsContainer = '#results';

    SearchTextsView.prototype.events = [clickH2];

    SearchTextsView.prototype.pager = {'total': 9, 'num': 3};

    return SearchTextsView;
  });

}).call(this);
