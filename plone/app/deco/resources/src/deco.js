// TODO: write description
// This script is used to create toolbar for deco, where all available tiles
// are listed. It depends on TODO: list dependencies.
//
//
// @author Rok Garbas
// @version 1.0
// @licstart  The following is the entire license notice for the JavaScript
//            code in this page.
//
// Copyright (C) 2010 Plone Foundation
//
// This program is free software; you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation; either version 2 of the License.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
// more details.
//
// You should have received a copy of the GNU General Public License along with
// this program; if not, write to the Free Software Foundation, Inc., 51
// Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//
// @licend  The above is the entire license notice for the JavaScript code in
//          this page.
//

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  regexp:true, undef:true, strict:true, trailing:true, browser:true */
/*global jQuery:false */


(function ($) {
"use strict";

// # Namespace
$.deco = $.deco || {};

// # Drop tolerance
$.drop({
  tolerance: function(e, proxy, target ) {
    var drop = $.event.special.drop;
    if ((drop.contains(target, [e.pageX, e.pageY +
          $(window.parent.document).scrollTop()]) === true) &&
        (target.left < e.pageX) && (target.right > e.pageX)) {
        return 1;
    }
    return 0;
  }
});

// # Drop Tile Helper
$.deco.dropTile = function(e, dd) {
  var tile_el = $(dd.drag),
      preview_tile = $('.tile-preview', window.parent.document),
      dragging_from_toolbar = $(dd.drag).attr('data-tile') === undefined;

  // only drop tile if there is preview tile somewhere
  if (preview_tile.size() > 0) {

    // if we drag from tile from toolbar we should provide a copy of
    // a tile button and remove all button specific data.
    if (dragging_from_toolbar) {
      tile_el = tile_el.clone();
      tile_el.attr('class', 'deco-tile');
      tile_el.attr('data-tile', '');
      tile_el.html('');
      tile_el.append($('<div/>').addClass('deco-tile-content'));
    } else {
      tile_el.show();
    }

    // move tile after preview tile and remove preview tile
    preview_tile.after(tile_el);
    preview_tile.remove();

    // this initializes tile again if not yet initialized
    var tile = tile_el.decoTile();
    tile.show();

    // if we moved tile from toolbar we have to show its content part
    // which was hidden while being in toolbar
    if (dragging_from_toolbar) {
      tile._editButton.trigger('click');
    }
  }
};

// # Helper methods
$.deco.getTiles = function(el, callback) {
  $('.deco-tile', el).each(function() {
    callback($(this).decoTile());
  });
};
$.deco.getColumns = function(el, callback) {
  $('.deco-column', el).each(function() {
    callback($(this).decoColumn());
  });
};
$.deco.getRows = function(el, callback) {
  $('.deco-row', el).each(function() {
    callback($(this).decoRow());
  });
};
$.deco.getPanels = function(el, callback) {
  $('[data-panel]', el).each(function() {
    callback($(this).decoPanel());
  });
};
$.deco.getTileTypes = function(el, callback) {
  $('[data-tiletype]', el).each(function() {
    callback($(this).decoTile());
  });
};

// Default TileType
$.deco.TileType = function(tile) {
  var self = this;
  self.tile = tile;
  self.name = tile.el.attr('data-tiletype');
};
$.deco.TileType.prototype = {
  createAddTileUrl: function() {
    return this.tile.el.attr('data-tile') || '@@add-tile/' + this.name;
  },
  createEditButton: function() {
    var button = $('<a/>').html('Edit');
    button.css("cssText", "color: #333333 !important;");
    button.css({
      'cursor': 'pointer',
      'z-index': '700',
      'position': 'absolute',
      'top': '0.3em',
      'right': '0.5em',

      'text-align': 'center',
      'text-shadow': '0 1px 1px rgba(255, 255, 255, 0.75)',
      'font-size': '13px',
      'vertical-align': 'middle',

      'background-color': '#f5f5f5',
      'background-image': 'linear-gradient(top, #ffffff, #e6e6e6)',
      'background-repeat': 'repeat-x',
      '-webkit-box-shadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05)',
      '-moz-box-shadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05)',
      'box-shadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05)',

      'line-height': '18px',
      'margin-bottom': '0',
      'padding': '4px 10px 4px',
      'border': '1px solid #cccccc',
      'border-color': '#e6e6e6 #e6e6e6 #bfbfbf',
      'border-bottom-color': '#b3b3b3',
      '-webkit-border-radius': '4px',
      '-moz-border-radius': '4px',
      'border-radius': '4px'
    });
    return button;
  },
  createProxy: function() {
    return $('<div/>').css({
      'opacity': 0.75,
      'z-index': 1000,
      'position': 'absolute',
      'border': '1px solid #89B',
      'background': '#BCE',
      'height': '58px',
      'width': '258px'
      });
  },
  createPreview: function() {
    return $('<div/>').css({
      'cursor': 'move',
      'width': '100%',
      'height': '50px',
      'background': '#BCE',
      'border': '1px solid #89B',
      'border-radius': '3px'
      });
  }
};


// # Tile
$.deco.Tile = function(el) {
  var self = this,
      TileType = $.deco.tiletype[el.attr('data-tiletype')] || $.deco.TileType;

  self.el = el;
  self.tiletype = new TileType(self);

  // ## initialize tile's editform with ploneOverlay
  self.overlay = new $.plone.overlay.Overlay({
    url: el.attr('data-tile') || self.tiletype.createAddTileUrl(),
    form: 'form#edit_tile,form#add_tile',
    save: function(response) {
      self.overlay.hide();
    }
  });

};
$.deco.Tile.prototype = {
  show: function() {
    var self = this;

    // ## trigger deco.tile.show event
    $(document).trigger('deco.tile.show', [self]);

    // ## store style of tile to restore it later
    self._originalStyles = self.el.attr('style');

    // ## make sure that cursor is in 'move' state when deco editor is on
    self.el.css({ 'cursor': 'move', 'position': 'relative' });

    // ## for tiles that are already in grid, show edit button on hover
    if (self.el.attr('data-tile') !== undefined) {

      // TODO:  double click should also trigger click on editButton
      //self.el_view.off('dblclick').on('dblclick', function(e) {
      //    self.tiletype.editButton.trigger('click');
      //  });

      // TODO: use tiletype and create edit button

      var editButton = self._editButton;
      if (editButton === undefined) {
        editButton = self.tiletype.createEditButton();
        editButton.hide().appendTo(self.el);
        self._editButton = editButton;
      }

      editButton.off('hover').on('hover', function(e) {
        if (editButton.is(":visible")) {
          editButton.show();
        } else {
          editButton.hide();
        }
      });
      self.el.off('hover').on('hover', function(e) {
        if (editButton.is(":visible")) {
          editButton.hide();
        } else {
          editButton.show();
        }
      });
      $(editButton, window.parent.document).on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        self.overlay.show();
      });
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
    //self.el.off('draginit').drag('init', function(e, dd) {
    //  if ($(e.target).hasClass('tile-editing') ||
    //      $(e.target).parents('.tile-editing').size() !== 0) {
    //    return false;
    //  }
    //});
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

      // tile is being edited, which means dblclick click happend and we
      // want to avoid dragging. return false will cancel rest of drag
      // interaction.
      if ($(dd.drag).hasClass('tile-editing')) {
        return false;
      }
      $.plone.toolbar.iframe_stretch();

      // TODO: check with setTimeout if its double click

      // create proxy element which is going to be dragged around append
      // it to body of top frame.
      var proxy = self.tiletype.createProxy().appendTo($('body'));

      // if we are not dragging new tile from toolbar
      if ($(dd.drag).attr('data-tile') !== undefined) {

        // TODO: add description
        proxy.append($(dd.drag).clone());
        proxy.height($(dd.drag).height());
        proxy.width($(dd.drag).width());

        // hide tile and mark it as being dragged, this will make sure
        // we dont take it into account when dropping in this column.
        $(dd.drag).hide();

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
      if ($(dd.drag).hasClass('tile-editing')) {
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
          $('.tile-preview', window.parent.document).remove();

          // just append it to column if there is no tiles in
          // column yet
          var column = $(this).decoColumn(),
              column_items = $(column.items_selector, column.el);
          if (column_items.size() === 0) {
            column.el.append(self.tiletype.createPreview().addClass('tile-preview'));

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
            drop_el[drop_method](self.tiletype.createPreview().addClass('tile-preview'));
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
      //$(this).animate({top: dd.offsetY, left: dd.offset}, 420);
      $(dd.proxy).remove();

      if ($('.tile-editing').size() === 0) {
        $.plone.toolbar.iframe_shrink();
      }

      // above will execute when we are outside dropzone panels and when
      // there is already existing tile-preview
      if ($(dd.drop).size() === 0 &&
        $('.tile-preview', window.parent.document).size() === 1) {
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

    // remove edit button
    if (self._editButton !== undefined) {
      self._editButton.remove();
    }

    // trigger deco.tile.hidden event
    $(document).trigger('deco.tile.hidden', [self]);
  }
};


// # Column
$.deco.Column = function(el) { this.el = el; };
$.deco.Column.prototype = {
  show: function() {
    var self = this;

    // trigger deco.column.show event
    $(document).trigger('deco.column.show', [self]);

    // create drop place for tiles
    self.el.on('drop', $.deco.dropTile);

    // show tiles 
    $.deco.getTiles(self.el, function(item) { item.show(); });

    // trigger deco.column.shown event
    $(document).trigger('deco.column.shown', [self]);
  },
  hide: function() {
    var self = this;

    // trigger deco.column.hide event
    $(document).trigger('deco.column.hide', [self]);

    // hide tiles
    $.deco.getTiles(self.el, function(item) { item.hide(); });

    // trigger deco.column.hidden event
    $(document).trigger('deco.column.hidden', [self]);
  }
};


// # Row
$.deco.Row = function(el) { this.el = el; };
$.deco.Row.prototype = {
  show: function() {
    var self = this;

    // trigger deco.row.show event
    $(document).trigger('deco.row.show', [self]);

    // show column
    $.deco.getColumns(self.el, function(item) { item.show(); });

    // trigger deco.row.shown event
    $(document).trigger('deco.row.shown', [self]);
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


// # Panel
$.deco.Panel = function(el) { this.el = el; };
$.deco.Panel.prototype = {
  show: function() {
    var self = this;

    // trigger deco.panel.show event
    $(document).trigger('deco.panel.show', [self]);

    // show rows 
    $.deco.getRows(self.el, function(item) { item.show(); });

    // trigger deco.panel.shown event
    $(document).trigger('deco.panel.shown', [self]);
  },
  hide: function() {
    var self = this;

    // trigger deco.panel.hide event
    $(document).trigger('deco.panel.hide', [self]);

    // hide rows 
    $.deco.getRows(self.el, function(item) { item.hide(); });

    // trigger deco.panel.hidden event
    $(document).trigger('deco.panel.hidden', [self]);
  }
};


// # Toolbar
$.deco.Toolbar = function(el) { this.el = el; };
$.deco.Toolbar.prototype = {
  show: function() {
    var self = this;
    self._hidden = false;

    // trigger deco.toolbar.show event
    $(document).trigger('deco.toolbar.show', [self]);

    // show toolbar tiles
    $.deco.getTileTypes(self.el, function(item) { item.show(); });

    // show panels
    $.deco.getPanels(window.parent.document, function(item) { item.show(); });

    // show toolbar
    $.plone.toolbar.iframe_stretch();
    self.el.slideDown('slow', function() {
      $.plone.toolbar.iframe_state.height = $('body').height();
      $.plone.toolbar.iframe_shrink();
    });

    // trigger deco.toolbar.shown event
    $(document).trigger('deco.toolbar.shown', [self]);
  },
  hide: function() {
    var self = this;
    self._hidden = true;

    // trigger deco.toolbar.hide event
    $(document).trigger('deco.toolbar.hide', [self]);

    // hide toolbar tiles
    $.deco.getTileTypes(self.el, function(item) { item.hide(); });

    // hide panels
    $.deco.getPanels(self.el, function(item) { item.hide(); });

    // hide toolbar
    self.el.slideUp('slow', function() {
      $.plone.toolbar.iframe_shrink();
    });
    // trigger deco.toolbar.hidden event
    $(document).trigger('deco.toolbar.hidden', [self]);
  },
  toggle: function() {
    var self = this;
    if (self._hidden === false) {
      self.hide();
    } else {
      self.show();
    }
  }
};


// jQuery integration for Toolbar, 
$.each(['Toolbar','Panel','Row','Column','Tile'], function(i, name) {
  $.fn['deco' + name] = function() {
    var el = $(this),
        dataName = 'deco-' + name.toLowerCase(),
        data = el.data(dataName);
    if (data === undefined) {
      data = new $.deco[name](el);
      el.data(dataName, data);
    }
    return data;
  };
});

}(jQuery));
