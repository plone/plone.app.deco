// Deco Layout Editor
// ==================
//
// Author: Rok Garbas
// Contact: rok@garbas.si
// Version: 1.0
// Depends:
//    ++resource++plone.app.jquery.js
//    ++resource++plone.app.deco/lib/jquery.event.drag.js
//    ++resource++plone.app.deco/lib/jquery.event.drop.js
//    ++resource=+plone.app.tiles/src/plone.tiletype.js
// Description:
//    Initialize toolbar for deco, where all available tiles are listed.
//    Initialize Deco Layout Editor for each element defining `data-panel`
//    attribute.
//
// License:
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
 
/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  regexp:true, undef:true, strict:true, trailing:true, browser:true */
/*global jQuery:false */

var NUM_GRID_COLUMNS = 12;

(function ($) {
"use strict";

// # Namespace
$.deco = $.deco || {};

// # Drop tolerance
// Every dnd action runs through this to notify if they
// can drop over the current area
$.drop({
  tolerance: function(e, proxy, target ) {
    var doc = window.parent.document;
    var doctop = $(doc).scrollTop();
    var docleft = $(doc).scrollLeft();
    if ($(proxy.elem).hasClass('deco-column-proxy')) {
      if($(target.elem).hasClass('deco-column')){
        if (e.pageY + doctop > target.top && e.pageY + doctop < target.bottom &&
            e.pageX + docleft > target.left && e.pageX + docleft < target.right) {
          return 1;
        }
      }
    } else if($(proxy.elem).hasClass('deco-row-proxy')) {
      if ($(target.elem).hasClass('deco-row')) {
        if (e.pageX + doctop > target.left && e.pageX + doctop < target.right &&
            e.pageY + docleft > target.top - 20 && e.pageY + docleft < target.bottom + 20){
          return 1;
        }
      }
    } else if($(proxy.elem).hasClass('deco-tile-proxy') && $(target.elem).hasClass('deco-column')) {
      var drop = $.event.special.drop;
      if ((drop.contains(target, [e.pageX, e.pageY + $(doc).scrollTop()]) === true) &&
          (target.left < e.pageX) && (target.right > e.pageX)) {
        return 1;
      }
    }
    return 0;
  }
});


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
$.deco.getTileType = function(el, callback) {
  $('.plone-tiletype', el).each(function() {
    callback($(this).decoTile());
  });
};

// # Drop Tile
$.deco.dropTile = function(e, dd) {
  $(document).trigger('deco-tile-drag-dropped');
  var tile_el = $(dd.drag),
      preview_tile = $('.deco-tile-preview', window.parent.document),
      dragging_from_toolbar = $('[data-tile]', dd.drag).size() === 0;

  // only drop tile if there is preview tile somewhere
  if (preview_tile.size() > 0) {

    // if we drag from tile from toolbar we should open add_tile form in an
    // overlay. when sucessfully saved it should create new tile in deco grid
    // and remove preview_tile.
    if (dragging_from_toolbar) {
      new $.plone.overlay.Overlay({
        url: $(dd.drag).parents('form').attr('action') + '/' +
                $('input[name="tiletype"]', dd.drag).attr('value'),
        form: 'form#edit_tile,form#add_tile',
        save: function(response, state, xhr, form) {
          $(document).trigger('deco-tile-add-save');
          var overlay = this;

          // create new tile, place it after preview_tile and initialize it
          var tile = $('<div/>')
            .addClass('deco-tile')
            .append($('<div/>')
              .addClass('plone-tile')
              .attr('data-tile', xhr.getResponseHeader('X-Tile-Url'))
              .append(response.html()))
            .insertAfter(preview_tile)
            .decoTile();
          tile.show();

          // remove preview_tile
          preview_tile.remove();

          // destroy overlay
          overlay.destroy();

          // We'll save the layout because adding
          // new tile actually stores data to the zodb
          var decoToolbar = $($.plone.deco.defaults.toolbar).decoToolbar();
          decoToolbar._editformDontHideDecoToolbar = true;
          $($.plone.deco.defaults.form_save_btn, decoToolbar._editform).click();
        },
        cancel:  function() {
          $(document).trigger('deco-tile-add-canceled');
          var overlay = this;

          // remove preview_tile
          preview_tile.remove();

          // destroy overlay
          overlay.destroy();
        }
      }).show();

    } else {

      // move tile after preview tile and remove preview tile
      preview_tile.after(tile_el);

      // remove preview_tile
      preview_tile.remove();

      // notify user layout has changed and needs saving
      $(document).trigger('deco.toolbar.layoutchange');
    }
  }
};


// # Drop Column or Row
$.deco.dropLayoutElement = function(e, dd) {
  if($(dd.proxy).hasClass('deco-layout-el')){
    $('.deco-preview', window.parent.document).removeClass('deco-preview');
    // trigger layout changed event
    $(document).trigger('deco.toolbar.layoutchange');
  }
};

// # Tile
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


// # Column
$.deco.Column = function(el) {
  var self = this;
  self.el = el;
  self.doc = window.parent.document;
  self.del_container = null;
  self.del_el = null;
  self.el.events_registered = false;
};
$.deco.Column.prototype = {
  show: function() {
    var self = this;

    // initialize height on column otherwise empty
    // column will have no height and can't be dropped on
    self.calculateHeight();

    // Make sure to register these events only once by element
    // This add and remove column delete, drop info on drag
    if (!self.el.events_registered) {
      self.el.events_registered = true;
      $(document).on('deco-tile-drag-start', function(){
        self.removeColumnInfo();
      });
      $(document).on('deco-tile-drag-end', function(){
        self.addColumnInfo();
      });
    }

    // trigger deco.column.show event
    $(document).trigger('deco.column.show', [self]);

    // create drop place for tiles
    self.el.on('drop', $.deco.dropTile);

    // show tiles
    $.deco.getTiles(self.el, function(item) { item.show(); });

    // trigger deco.column.shown event
    $(document).trigger('deco.column.shown', [self]);

    self.addColumnInfo();
  },
  hide: function() {
    var self = this;

    self.clearHeight();

    // trigger deco.column.hide event
    $(document).trigger('deco.column.hide', [self]);

    // remove drop events
    self.el.off('drop');

    // hide tiles
    $.deco.getTiles(self.el, function(item) { item.hide(); });

    // trigger deco.column.hidden event
    $(document).trigger('deco.column.hidden', [self]);

    self.removeColumnInfo();
  },
  clearHeight: function(){
    // XXX part of height hack
    // XXX this is to clear height styles
    this.el.attr('style', '');
  },
  calculateHeight: function(){
    var self = this;
    // XXX setting default height here so we can drop elements
    // XXX can't figure out a way to make this work with css
    var row_height = self.el.parent().height();
    var column_height = self.el.height();
    if ((column_height < row_height) ||
        (self.el.attr('height') && column_height > row_height)) {
      // get row height and set to it.
      self.el.css('height', row_height);
    }
  },
  removeColumnInfo: function(){
    /* remove delete column info */
    var self = this;
    if (self.del_container !== null) {
      self.del_container.remove();
    }
    self.el.removeClass('deco-predelete');
    self.el.removeClass('deco-column-empty');
  },
  addColumnInfo: function(){
    /* for adding delete column info to column if needed */
    var self = this;
    if (self.el.find('.deco-tile-preview').length > 0) {
      return;
    }
    if($('.plone-tile', self.el).length === 0){
      self.del_container = $('<div class="deco-delete">Drag tiles here </div>');
      if($('.deco-column', self.doc).length > 1){
        // not able to delete last column
        self.del_el = $('<a href="#" title="delete column">or delete</a>');
        self.del_container.append(self.del_el);
        self.del_el.click(function(){
          $(this).parents('.deco-column').decoColumn().destroy();
          return false;
        });
        self.del_el.hover(function(){
          self.el.addClass('deco-predelete');
        }, function(){
          self.el.removeClass('deco-predelete');
        });
        self.el.append(self.del_container);
        self.el.addClass('deco-column-empty');
      }
    }
  },
  destroy: function(){
    var self = this;
    var row = self.el.parent().decoRow();

    // check if we need to delete row
    var newcolumn = self.el.siblings('.deco-column');
    var lastcolumn = false;
    if (newcolumn.length === 0) {
      lastcolumn = true;
    } else {
      // has sibligs, we need to add to grid with so it fills in space
      newcolumn = newcolumn.eq(0);
      var newcolumnobj = newcolumn.decoColumn();
      newcolumnobj.setWidth(self.getWidth() + newcolumnobj.getWidth());
    }

    if (lastcolumn) {
      row.el.remove();
    } else {
      self.el.remove();
    }
    // This is done so we can re-calculate layout
    $.deco.getPanels(window.parent.document, function(panel) {
      panel.hide();
      panel.show();
    });
    $(document).trigger('deco.toolbar.layoutchange');
  },
  getWidth: function() {
    var item = $(this.el);
    var itemClass = item.attr("class");
    if (itemClass.length) {
      var regex_match = itemClass.match(/\bdeco-span(\d+)/);
      if (regex_match.length > 1) {
        return parseInt(regex_match[1], 10);
      } else {
        // perhaps it's missing, not sure, but let's not error.
        return 1;
      }
    }
  },
  setWidth: function (newWidth) {
    var item = $(this.el);
    var itemClass = item.attr("class");
    if (itemClass) {
      var regex_match = itemClass.match(/\bdeco-span(\d+)/);
      item.removeClass(regex_match[0]);
      item.addClass('deco-span' + newWidth);
    }

  }
};


// # Row
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


// # Panel
$.deco.Panel = function(el) { this.el = el; };
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


// # Toolbar
$.deco.Toolbar = function(el) {
  this.el = el;
  this.add_column_btn = $('#plone-deco-addcolumn', el);
  this.add_row_btn = $('#plone-deco-addrow', el);
  this.doc = window.parent.document;
};
$.deco.Toolbar.prototype = {
  setupDnD: function(el, options){
    if (options === undefined) {
      options = {};
    }
    options = $.extend({
      type: 'column',
      placeholdercss: function(el){ return {}; },
      halfcondition: function(el){ return {}; },
      create: function(dd){},
      drop: function(e, dd){},
      last_sel: 'last-child'
    }, options);
  
    var type = options.type;
    var css = options.placeholdercss;
    var halfcondition = options.halfcondition;
    var doc = window.parent.document;

    $('.deco-' + type, doc).on('drop', $.deco.dropLayoutElement);

    el.off('dragstart').drag('start', function(e, dd) {
      $.iframe.stretch();
      // create drop targets
      $('.deco-' + type, doc).each(function() {
        $('<div class="deco-' + type + '-drop"/>')
          .css(css(this, false))
          .insertAfter(this);
      });
      $('.deco-' + type + ':' + options.last_sel, doc).each(function() {
        $('<div class="deco-' + type + '-drop"/>')
          .css(css(this, true))
          .insertAfter(this);
      });

      // create proxy element which is going to be dragged around append
      // it to body of top frame.
      var proxy = $('<div/>')
        .addClass('deco-' + type + '-proxy')
        .addClass('deco-layout-el')
        .appendTo($('body'));

      // returning an element from 'dragstart' event is what makes proxy,
      // otherwise original element is used.
      return proxy;

    }, { distance: 10 });

    el.drag(function(e, dd) {
      // proxy tile follows mouse
      $(dd.proxy).css({
        top: dd.offsetY,
        left: dd.offsetX
      });

      if ($(dd.drop).hasClass('deco-preview')) {
        return;
      }

      if ($(dd.drop).length === 1) {
        // we're on a drop target; figure out where to put the preview
        if (halfcondition(e, dd)) {
          // 2nd half; add if it's not there yet
          if (!$(dd.drop).next().is('.deco-preview')) {
            options.create(dd, "after");
          }
        } else {
          // 1st half; add if it's not there yet
          if (!$(dd.drop).prev().is('.deco-preview')) {
            options.create(dd, "before");
          }
        }
      }

      // Keep track of which column was temporarily shortened
      // to make way for the preview. If it's different than
      // before, restore the size of the previous one.
      if (type === 'column') {
        var lastDrop = $(window.document).data('deco-last-drop');
        if ($(lastDrop).hasClass('deco-column') && (!$(dd.drop).length) || !$(lastDrop).is(dd.drop)) {
          $('.deco-preview', window.parent.document).remove();
          if ($(lastDrop).hasClass('deco-column')) {
            var decoCol = $(lastDrop).decoColumn();
            var width = decoCol.getWidth();
            if (width < NUM_GRID_COLUMNS) {
              decoCol.setWidth(width + 1);
            }
          }
        }
        $(window.document).data('deco-last-drop', dd.drop);
      }

    });

    el.off('dragend').drag('end', function(e, dd) {
      $(window.document).data("deco-last-drop", false);
      $('.deco-preview', doc).removeClass('deco-preview');
      $(dd.proxy).remove();
      $.iframe.shrink();
      $('.deco-' + type + '-drop', doc).remove();
    });
  },
  show: function() {
    var self = this;
    self._hidden = false;

    // trigger deco.toolbar.show event
    $(document).trigger('deco.toolbar.show', [self]);

    // show toolbar tiles
    $.deco.getTileType(self.el, function(item) { item.show(); });

    // mark document as being edited
    $('body').addClass('deco-toolbar-editing');

    // show panels
    $.deco.getPanels(window.parent.document, function(item) { item.show(); });

    // set up column drag/drop
    self.setupDnD(self.add_column_btn, {
      type: 'column',
      create: function(dd, side) {
        // Remove any previous previews.
        $('.deco-preview', window.parent.document).remove();

        var newColumn = $('<div/>')
          .addClass('deco-column deco-preview deco-span1');

        // calculate total width and find the biggest column
        var totalSize = 0;
        var biggestSize = 0;
        var biggestCol = null;
        var columns = $(dd.drop).parent().children(".deco-column");
        columns.splice(columns.index(dd.drop), newColumn);
        columns.each(function() {
            var decoCol = $(this).decoColumn();
            var width = decoCol.getWidth();
            totalSize += width;
            if (width > biggestSize) {
              biggestCol = $(this);
              biggestSize = width;
            }
        });
        
        // decrease size of biggest column
        if (totalSize >= NUM_GRID_COLUMNS) {
            var lastDrop = $(window.document).data('deco-last-drop');
            if (biggestSize > 1 && !biggestCol.is(lastDrop)) {
                var decoCol = $(biggestCol).decoColumn();
                var width = decoCol.getWidth();
                decoCol.setWidth(width - 1);
            }
        }
        
        if (side === "after") {
          newColumn.insertAfter($(dd.drop));
        } else {
          newColumn.insertBefore($(dd.drop));
        }
        newColumn.decoColumn().show();
        $(document).trigger('deco.toolbar.layoutchange');
        return newColumn;
      },
      placeholdercss: function(el, last){
        el = $(el);
        return {
          height: el.height(),
          left: el.position().left + (last ? el.width() : 0),
          top: el.position().top
        };
      },
      halfcondition: function(e, dd) {
        return (e.pageX > $(dd.drop).offset().left + $(dd.drop).width() / 2);
      }
    });

    // set up row drag/drop
    self.setupDnD(self.add_row_btn, {
      type: 'row',
      init: 'decoRow',
      last_sel: 'last',
      create: function(dd, side) {
        // Remove any previous previews.
        $('.deco-preview', window.parent.document).remove();

        var row = $('<div/>')
          .addClass('deco-row deco-preview');

        if (side === "after") {
          row.insertAfter($(dd.drop));
        } else {
          row.insertBefore($(dd.drop));
        }
        row.decoRow().show();

        // Make sure there's a column in the row
        $('<div/>')
          .addClass('deco-column deco-span' + NUM_GRID_COLUMNS)
          .appendTo(row)
          .decoColumn().show();

        $(document).trigger('deco.toolbar.layoutchange');
        return row;
      },
      placeholdercss: function(el, last){
        el = $(el);
        return {
          width: el.width(),
          left: el.position().left,
          top: el.position().top + (last ? el.position().top : 0)
        };
      },
      halfcondition: function(e, dd) {
        return (e.pageY > $(dd.drop).offset().top + $(dd.drop).height() / 2);
      }
    });

    // show toolbar
    $.iframe.stretch();
    self.el.slideDown('slow', function() {
      $.iframe.state.height = $('body').height();
      $.iframe.shrink();
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
    $.deco.getTileType(self.el, function(item) { item.hide(); });

    // remove editing marker class
    $('body').removeClass('deco-toolbar-editing');

    // hide panels
    $.deco.getPanels(window.parent.document, function(item) { item.hide(); });

    // hide toolbar
    self.el.slideUp('slow', function() {
      $.iframe.shrink();
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
