define(
'deco.panel',
['jquery', 'deco'],
function($) {

  $.deco.Panel = function(el) {
    this.el = el;
  };

  $.deco.Panel.prototype = {
    show: function() {
      var self = this;

      // trigger deco.panel.show event
      $(document).trigger('deco.panel.show', [self]);

      // mark panel as being in edit mode
      self.el.addClass('deco-editing');

      // show rows
      $.deco.getRows(self.el, function(item) { item.show(); });

      // trigger deco.panel.shown event
      $(document).trigger('deco.panel.shown', [self]);
    },
    hide: function() {
      var self = this;

      // trigger deco.panel.hide event
      $(document).trigger('deco.panel.hide', [self]);

      // remove marker class
      self.el.removeClass('deco-editing');

      // hide rows
      $.deco.getRows(self.el, function(item) { item.hide(); });

      // trigger deco.panel.hidden event
      $(document).trigger('deco.panel.hidden', [self]);
    }
  };

});
