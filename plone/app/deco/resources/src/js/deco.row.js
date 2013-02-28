define(
"deco.row",
["jquery", "deco"],
function($) {

  $.deco.Row = function(el) {
    var self = this;
    self.el = el;
    self.el.events_registered = false;
  };


  $.deco.Row.prototype = {
    show: function() {
      var self = this;

      // only register events once for the element
      if (!self.el.events_registered) {
        self.el.events_registered = true;
        $(document).on('deco.toolbar.layoutchange', function() {
          self.update();
        });
        $(document).on('deco-tile-drag-end deco-tile-add-canceled', function(){
          // XXX because of weird edge cases...
          // XXX clear all columns
          $.deco.getColumns(self.el, function(column){
            column.clearHeight();
          });
          // after all were cleared, then set on all
          $.deco.getColumns(self.el, function(column){
            column.calculateHeight();
          });
        });
      }

      // trigger deco.row.show event
      $(document).trigger('deco.row.show', [self]);

      // show column
      $.deco.getColumns(self.el, function(item) { item.show(); });

      // update column drag handles when layout is modified
      self.update();

      // update column drag handles if the window gets resized
      $(parent).resize(function() {
        self.update();
      });

      // trigger deco.row.shown event
      $(document).trigger('deco.row.shown', [self]);
    },


    update: function() {
      var self = this;

      // update column drag handles
      $('.deco-column-drag', self.el).remove();
      $('.deco-column:not(:last)', self.el).each(function() {
        var el = $('<div/>')
          .addClass('deco-column-drag')
          .css({
            left: $(this).position().left + $(this).outerWidth(true),
            height: $(this).height()
          })
          .appendTo(self.el);

        var prevcol = $(this).decoColumn();
        var nextcol = $(this).next('.deco-column').decoColumn();

        el.drag('init', function(e, dd) {
          $.iframe.stretch();
        }).drag('start', function(e, dd) {
          var proxy = $('<div/>')
            .css({
              position: 'absolute',
              top: e.pageY - $(window.parent.document).scrollTop() - 10,
              left: e.pageX - $(window.parent.document).scrollLeft() - 10,
              width: 20,
              height: 20,
              cursor: 'ew-resize'
            })
            .appendTo('body');
          return proxy;
        }).drag(function(e, dd) {
          var old_prev_size = prevcol.getWidth();
          var old_next_size = nextcol.getWidth();
          var total_size = old_prev_size + old_next_size;
          var total_width = prevcol.el.width() + nextcol.el.width();
          var grid_width = Math.floor(total_width / total_size);
          var new_prev_size = Math.round((e.pageX - prevcol.el.offset().left) / grid_width);
          if (new_prev_size < 1) {
            new_prev_size = 1;
          }
          if (new_prev_size > total_size - 1) {
            new_prev_size = total_size - 1;
          }
          var new_next_size = total_size - new_prev_size;
          prevcol.setWidth(new_prev_size);
          nextcol.setWidth(new_next_size);

          $(dd.proxy).css({
            top: e.pageY - $(window.parent.document).scrollTop() - 10,
            left: e.pageX - $(window.parent.document).scrollLeft() - 10
          });
        }).drag('end', function(e, dd) {
          $(dd.proxy).remove();
          $.iframe.shrink();
          // make sure placeholders and handles get updated
          $(document).trigger('deco.toolbar.layoutchange');
        });

      });
    },


    hide: function() {
      var self = this;

      // trigger deco.row.hide event
      $(document).trigger('deco.row.hide', [self]);

      // hide column
      $.deco.getColumns(self.el, function(item) { item.hide(); });

      // trigger deco.row.hidden event
      $(document).trigger('deco.row.hidden', [self]);
    }
  };

});
