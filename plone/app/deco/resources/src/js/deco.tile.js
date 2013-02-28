define(
"deco.tile",
["jquery", "deco"],
function($) {

  $.deco.Tile = function(el) {
    var self = this;
    self.el = el;

    if ($('[data-tile]', el).size() !== 0) {
      self.tile = $('[data-tile]', el).ploneTile({ wrapper: el });
    } else {
      self.tile = {};
      self.tile.type = new ($.plone.tiletype.get(
          $('input[name="tiletype"]', el).attr('value')))();
    }

  };

  $.deco.Tile.prototype = {
    show: function() {
      var self = this;
      // ## trigger deco.tile.show event
      $(document).trigger('deco.tile.show', [self]);

      // ## store style of tile to restore it later
      self._originalStyles = self.el.attr('style');

      // ## make sure that cursor is in 'move' state when deco editor is on
      self.el.css({cursor: 'move'});

      if (self.tile.show) {
        self.tile.show();
      }

      // ## draginit {{{
      //
      // This event is fired when a mouse button is pressed (mousedown)
      //   within the bound element. The handler can return false to cancel the
      //   rest of the drag interaction events, or can return elements to use
      //   as the drag targets for the rest of the drag interaction. This event
      //   will not fire unless the options "not", "handle", and "which" are
      //   all satisfied.
      //
      // Don't start dragging if tile is being edited.
      // Stretch toolbar's iframe since dragging is being done inside iframe
      //
      self.el.off('draginit').drag('init', function(e, dd) {

        // if we click on tile action we dont intent to start draggin.g
        if ($(e.target).parents('.plone-tiletype-actions').size() !== 0) {
          return false;
        }

        if ($(e.target).hasClass('plone-tile-editing') ||
            $(e.target).parents('.plone-tile-editing').size() !== 0) {
          return false;
        }
        $.iframe.stretch();
      });
      // }}}

      // ## dragstart {{{
      //
      // This event fires after "draginit", once the mouse has moved
      //   a minimum "distance", which may be specificed in the options. The
      //   handler can return false to cancel the rest of the drag interaction
      //   events, or can return an element to set as the drag proxy for the
      //   rest of the drag interaction. If dragging multiple elements (from
      //   "draginit"), this event will fire uniquely on each element.
      //
      // Don't dragg if tile is being edited.
      //
      self.el.off('dragstart').drag('start', function(e, dd) {
        $(document).trigger('deco-tile-drag-start');

        // tile is being edited, which means dblclick click happend and we
        // want to avoid dragging. return false will cancel rest of drag
        // interaction.
        if ($(dd.drag).hasClass('plone-tile-editing')) {
          return false;
        }

        // TODO: check with setTimeout if its double click

        // create proxy element which is going to be dragged around append
        // it to body of top frame.
        var proxy = self.tile.type.createProxy().appendTo($('body'));
        proxy.addClass('deco-tile-proxy');

        // if we are not dragging new tile from toolbar
        if ($('[data-tile]', dd.drag).size() !== 0) {

          // TODO: add description
          proxy.append($(dd.drag).clone());
          proxy.height($(dd.drag).height());
          proxy.width($(dd.drag).width());

          // hide tile and mark it as being dragged, this will make sure
          // we dont take it into account when dropping in this column.
          $(dd.drag).detach();

          // we place tile right in the center of our mouse.
          proxy.css({ // position tile under the mouse
            top: e.pageY - (proxy.outerHeight(true) / 2),
            left: e.pageX - (proxy.outerWidth(true) / 2)
          });

        }

        // returning an element from 'dragstart' event is what makes proxy,
        // otherwise original element is used.
        return proxy;

      }, { distance: 10 });
      // }}}

      // ## drag {{{
      //
      // This event fires after "draginit" and "dragstart" every time the
      // mouse moves. The handler can return false to stop the drag
      // interaction and go straight to "dragend" and also prevent any "drop"
      // events. If dragging multiple elements (from "draginit"), this event
      // will fire uniquely on each element.
      self.el.off('drag').drag(function(e, dd) {

        // tile is being edited, which means dblclick click happend and we
        // want to avoid dragging. return false will cancel rest of drag
        // interaction.
        // because we can not always with certanty say which event
        // 'dblclick' or 'dragstart' event will be first it might happen
        // that also 'drag' event will be fired up. if so we have to cancel
        // rest of drag interaction and remove proxy created at 'decostart'
        // event.
        if ($(dd.drag).hasClass('plone-tile-editing')) {
          $(dd.proxy).remove();
          return false;
        }

        // proxy tile follows mouse
        $(dd.proxy).css({
          top: dd.offsetY,
          left: dd.offsetX
        });

        // we'll show preview tile in column if we'll find place to drop it
        var drop = $(dd.drop);
        if (drop.size() !== 0) {
          drop.each(function() {

            // remove any previous tile because we are going to create
            // new one
            $('.deco-tile-preview', window.parent.document).remove();

            // just append it to column if there is no tiles in
            // column yet
            var column = $(this).decoColumn(),
                column_items = $('> .deco-tile', column.el);
            if (column_items.size() === 0) {

              column.el.append(self.tile.type.createPreview().addClass('deco-tile-preview'));

            // calculate position if there are tiles already
            // existing
            } else {
              var drop_el, drop_method, drop_distance;

              $.each(column_items, function(i, el) {
                var tile_top = $(el).offset().top,
                    tile_height = $(el).height(),
                    tile_middle = tile_top + (tile_height / 2),
                    tile_distance = Math.min(
                      Math.abs(tile_top - e.pageY),
                      Math.abs(tile_top + tile_height - e.pageY));

                if ((drop_el === undefined) ||
                   (tile_distance < drop_distance)) {
                  drop_el = $(el);
                  drop_distance = tile_distance;
                }

                if (tile_middle < e.pageY) {
                  drop_method = 'after';
                } else {
                  drop_method = 'before';
                }
              });

              // append preview tile before/after the tile that we
              // found we are over with our drag event. from code
              // above we can tell that if we are located (with
              // a mouse) in upper half of tile we'll place tile
              // above tile we currently hovering and if below we'll
              // place it below this tile.
              drop_el[drop_method](self.tile.type.createPreview().addClass('deco-tile-preview'));
            }
          });
        }
      });
      // }}}

      // ## dragend {{{
      //
      // This event fires after "draginit" and "dragstart" and "drag" when
      // the mouse button is released, or when a "drag" event is canceled.
      // This event will always fire after any "drop" events. If dragging
      // multiple elements (from "draginit"), this event will fire uniquely
      // on each element.
      self.el.off('dragend').drag('end', function(e, dd) {
        $(dd.proxy).remove();
        $(document).trigger('deco-tile-drag-end');

        if ($('.plone-tile-editing').size() === 0) {
          $.iframe.shrink();
          $(document).trigger('deco-tile-drag-cancel');
        }

        // above will execute when we are outside dropzone panels and when
        // there is already existing deco-tile-preview
        if ($(dd.drop).size() === 0 &&
            $('.deco-tile-preview', window.parent.document).size() === 1) {
          $.deco.dropTile(e, dd);
        }
      });
      // }}}

      // ## trigger deco.tile.shown event
      $(document).trigger('deco.tile.shown', [self]);
    },


    hide: function() {
      var self = this;
      // trigger deco.tile.hide event
      $(document).trigger('deco.tile.hide', [self]);

      // restore original styles
      self.el.attr('style', self._originalStyles);
      self.el.css({cursor: 'inherit' });

      if (self.tile.hide) {
        self.tile.hide();
      }

      // trigger deco.tile.hidden event
      $(document).trigger('deco.tile.hidden', [self]);
    }
  };

});
