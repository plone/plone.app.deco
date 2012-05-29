//
// This script is used to create toolbar for deco, where all available tiles
// are listed. It depends on iframize.js and deco.js.
//
//
// @author Rob Gietema, Rok Garbas
// @version 0.1
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

// # Tiles (on_load, on_save
$.deco.tiletypes = {};
$.deco.tiletypes['plone.app.texttile'] = {
  on_load: function(tile, overlay) {
    $('textarea[name="plone.app.texttile.text"]', overlay.el).val(
        tile.el_view.html());
  },
  on_save: function(tile, overlay) {
    tile.el_view.html($('textarea[name="plone.app.texttile.text"]',
        overlay.el).val());
  }
};
$.deco.tiletypes['plone.app.imagetile'] = {
};

// drop tolerance
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
//}});
// Helper functions {{{
function create(name, prototype) {
  var Base = {
    init: function(el, el_parent) {
      var self = this;
      self.el = el;
      self.activated = false;
      self.el_parent = el_parent || el;

      // initialize items
      self.items(function(el) {
        $(el)[$.camelCase('deco-' + self.items_name)]();
      });

      // TODO: save deco layout {{{
      //$('#deco-toolbar-save', self.el).on('click', function(e) {
      //  e.preventDefault();
      //  e.stopPropagation();

      //  var overlay = $('#plone-action-edit > a').ploneOverlay();
      //  $("textarea[name='form.widgets.ILayoutAware.content']",
      //    overlay._overlay).val(
      //      '<!DOCTYPE html>' +
      //      '<html lang="en" data-layout="./@@page-site-layout">' +
      //      '<body>' +
      //      '<div data-panel="content">' +
      //        window.parent.$("[data-panel='content']").html() +
      //      '</div>' +
      //      '</body>' +
      //      '</html>');

      //  $('form', overlay._overlay).first().on('submit', function(e) {
      //    e.preventDefault();
      //    e.stopPropagation();
      //    $(this).ajaxSubmit({
      //      beforeSubmit: function(formData, jqForm, options) {
      //        console.log('before');
      //      },
      //      success: function(responseText, statusText, xhr, $form) {
      //        console.log('closing');
      //      }
      //    });
      //  });
      //  $("[name='form.buttons.save']", overlay._overlay).submit();
      //});
      // }}}
    },
    items: function(callback) {
      $(this.items_selector, this.el_parent).each(
          function(i, el) { callback(el); });
    },
    activate: function() {
      var self = this;

      if (self.activated) {
        return;
      }

      // activate items
      self.items(function(el) {
        $(el)[$.camelCase('deco-' + self.items_name)]().activate();
      });

      self.activated = true;
      $(document).trigger(name + '.activated', [ self ]);
    },
    deactivate: function() {
      var self = this;

      if (!self.activated) {
        return;
      }

      // activate items
      self.items(function(el) {
        $(el)[$.camelCase('deco-' + self.items_name)]().deactivate();
      });

      self.activated = false;
      $(document).trigger(name + '.deactivated', [ self ]);
    }
  };
  var Func = function(el, el_parent) { this.init(el, el_parent); };
  Func.prototype = $.extend({}, Base, prototype || {});
  Func.prototype._base = Base;

  // # jQuery integration
  $.fn[$.camelCase(name)] = function() {
    var el = $(this),
        data = el.data(name);
    if (data === undefined) {
      data = new Func(el);
      el.data(name, data);
    }
    return data;
  };
  return Func;
}
// TODO: add description
$.deco.create_proxy_tile = function() {
  return $('<div/>').css({
    'opacity': 0.75,
    'z-index': 1000,
    'position': 'absolute',
    'border': '1px solid #89B',
    'background': '#BCE',
    'height': '58px',
    'width': '258px'
    });
};
// TODO: add description
$.deco.create_preview_tile = function() {
  return $('<div/>').addClass('tile-preview').css({
    'cursor': 'move',
    'width': '100%',
    'height': '50px',
    'background': '#BCE',
    'border': '1px solid #89B',
    'border-radius': '3px'
    });
};
// TODO: add description
$.deco.drop_tile = function(e, dd) {
  var tile_el = $(dd.drag),
      preview_tile = $('.tile-preview', window.parent.document),
      dragging_from_toolbar = $(dd.drag).attr('data-tiletype') !== undefined;

  // only drop tile if there is preview tile somewhere
  if (preview_tile.size() > 0) {

    // if we drag from tile from toolbar we should provide a copy of
    // a tile button and remove all button specific data.
    if (dragging_from_toolbar) {
      tile_el = tile_el.clone();
      tile_el.attr('data-tile', tile_el.attr('data-tiletype'));
      tile_el.removeAttr('data-tiletype').removeAttr('style');
      tile_el.find('.deco-tile-addbutton').remove();
    } else {
      tile_el.show();
    }

    // move tile after preview tile and remove preview tile
    preview_tile.after(tile_el);
    preview_tile.remove();

    // this initializes tile again if not yet initialized
    var tile = tile_el.decoTile();
    tile.activate();

    // if we moved tile from toolbar we have to show its content part
    // which was hidden while being in toolbar
    if (dragging_from_toolbar) {
      tile.el_view.show();
      tile.el_button.trigger('click');
    }
  }
};
// }}}

// # Tile
$.deco.DecoTile = create('deco-tile', {
  init: function(el, el_parent) {
    var self = this;

    self.el_view= $('> .deco-tile-view', el);
    self.el_form = $('> .deco-tile-form', el);
    self.el_button = $('> .deco-tile-edit', el);

    var tiletype_name = el.attr('data-tiletype') || el.attr('data-tile');
    self.tiletype = $.deco.tiletypes[tiletype_name.split('?')[0].split('@@')[1]];

    self._base.init.apply(self, [el]);
  },
  activate: function() {
    var self = this, waiting = false;

    self.el.css({ 'cursor': 'move', 'position': 'relative' });


    if (self.el.attr('data-tiletype') === undefined) {
      // TODO: 
      //self.el_view.off('dblclick').on('dblclick', function(e) {
      //    self.el_button.trigger('click');
      //  });

      self.el_button.css({
        'color': '#333',
        'cursor': 'pointer',
        'z-index': '700',
        'padding': '0.2em 0.4em',
        'position': 'absolute',
        'top': '0.3em',
        'right': '0.5em',
        'border': '1px solid #333',
        'border-radius': '0.3em',
        'background': '#eee'
      });
      $(':hover', self.el_button).css({ 'color': '#333' });

      self.el_button.off('hover').on('hover', function(e) {
        if (self.el_button.is(":visible")) {
          self.el_button.hide();
        } else {
          self.el_button.show();
        }
      });
      self.el_view.off('hover').on('hover', function(e) {
        if (self.el_button.is(":visible")) {
          self.el_button.hide();
        } else {
          self.el_button.show();
        }
      });

      $(self.el_button, window.parent.document).on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
      });
    }

    // ## draginit {{{
    //
    // This event is fired when a mouse button is pressed (mousedown)
    // within the bound element. The handler can return false to cancel the
    // rest of the drag interaction events, or can return elements to use
    // as the drag targets for the rest of the drag interaction. This event
    // will not fire unless the options "not", "handle", and "which" are
    // all satisfied.
    self.el.off('draginit').drag('init', function(e, dd) {
      if ($(e.target).hasClass('deco-tile-edit') ||
          $(e.target).parents('.deco-tile-edit').size() !== 0) {
        return false;
      }
      $.plone.toolbar.iframe_stretch();
    });
    // }}}

    // ## dragstart {{{
    //
    // This event fires after "draginit", once the mouse has moved
    // a minimum "distance", which may be specificed in the options. The
    // handler can return false to cancel the rest of the drag interaction
    // events, or can return an element to set as the drag proxy for the
    // rest of the drag interaction. If dragging multiple elements (from
    // "draginit"), this event will fire uniquely on each element.
    self.el.off('dragstart').drag('start', function(e, dd) {
      // tile is being edited, which means dblclick click happend and we
      // want to avoid dragging. return false will cancel rest of drag
      // interaction.
      if ($(dd.drag).hasClass('tile-editing') || waiting === true) {
        return false;
      }

      // TODO: check with setTimeout if its double click

      // create proxy element which is going to be dragged around append
      // it to body of top frame.
      var proxy = $.deco.create_proxy_tile().appendTo($('body'));

      // if we are not dragging new tile from toolbar
      if ($(dd.drag).attr('data-tiletype') === undefined) {

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
            column.el.append($.deco.create_preview_tile());

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
            drop_el[drop_method]($.deco.create_preview_tile());
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
        $.deco.drop_tile(e, dd);
      }
    });
    // }}}

    var overlay= self.el_button.ploneOverlay({
        loaded_data: self.el_form.clone()
      });
    $.plone.overlay.bootstrap_overlay_transform(overlay.el, overlay.loaded_data);
    overlay.el.off('hide').off('hidden').off('show').off('shown')
      .on('show', function(e) {
          $.plone.toolbar.iframe_stretch();
          overlay.el.addClass('tile-editing');
          if (self.tiletype.on_load) {
            self.tiletype.on_load(self, overlay);
          }
        })
      .on('hidden', function(e) {
          overlay.el.removeClass('tile-editing');
          $.plone.toolbar.iframe_shrink();
        });
    $("input[name='buttons.save']", overlay.el).off('click')
      .on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (self.tiletype.on_save) {
          self.tiletype.on_save(self, overlay);
        }
        // TODO: persist tile by submitting form, do this async
        overlay.el.modal('hide');
      });
    //var wysiwyg = $('#plone-app-texttile-text', overlay.el);
    //if (wysiwyg.size() !== 0) {
    //  wysiwyg.each(function(i, el) {
    //    var id = 'wysiwyg-' + Math.floor(Math.random() * 1000000);
    //    $(el).attr('id', id);
    //    $(el).attr('title', '');
    //    var config = new TinyMCEConfig(id);
    //    config.init();
    //  });
    //}

    self._base.activate.call(self);
  },
  deactivate: function() {
    var self = this;

    // unregister from all drag event that we
    $.each(['draginit','dragstart','drag','dragend'],
      function(i, type) { self.el.off(type);
    });

    // remove styles from element if we added any
    self.el.removeAttr('style');

    // disable dblclick
    self.el_view.off('dblclick');

    self._base.deactivate.call(self);
  }
});

// # Column
$.deco.DecoColumn = create('deco-column', {
  items_selector: '[data-tile]:not(.tile-preview)',
  items_name: 'tile',
  activate: function() {
    var self = this;
    self.el.on('drop', $.deco.drop_tile);
    self._base.activate.call(self);
  },
  deactivate: function() {
    var self = this;

    // unbind drop events
    $.each(['dropinit','dropstart','drop','dropend'],
      function(i, type) { self.el.off( type );
    });

    self._base.deactivate.call(self);
  }
});

// # Row
$.deco.DecoRow = create('deco-row', {
  items_selector: '.deco-column',
  items_name: 'column'
});

// # Panel
$.deco.DecoPanel = create('deco-panel', {
  items_selector: '.deco-row',
  items_name: 'row'
});

// # Toolbar
$.deco.DecoToolbar = create('deco-toolbar', {
  items_selector: '[data-panel]',
  items_name: 'panel',
  init: function(el, el_parent) {
    var self = this;

    // initialize tiletypes
    self.tiletypes = $('[data-tiletype]', el);
    self.tiletypes.each(function() {
      $(this).decoTile();
      $('[rel="tooltip"]', this).tooltip({ placement: 'right' });
    });

    self._base.init.apply(self, [el, window.parent.document]);
  },
  activate: function() {
    var self = this;
    self.tiletypes.each(function() { $(this).decoTile().activate(); });
    self._base.activate.call(self);
    $.plone.toolbar.iframe_stretch();
    self.el.slideDown('slow', function() {
      $.plone.toolbar.iframe_state.height = $('body').height();
      $.plone.toolbar.iframe_shrink();
    });
  },
  deactivate: function() {
    var self = this;
    self.tiletypes.each(function() { $(this).decoTile().deactivate(); });
    self._base.deactivate.call(self);
    self.el.slideUp('slow', function() {
      $.plone.toolbar.iframe_shrink();
    });
  }
});


// TODO: code below might be extracted to another script {{{

// # Initialize
$(document).ready(function() {
  if ($('#deco-toolbar').size() !== 0) {
    var deco_toolbar = $('#deco-toolbar').decoToolbar();
    $('#plone-toolbar ul.nav > li#plone-action-deco > a').off()
      .on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (deco_toolbar.activated === false) {
          deco_toolbar.activate();
        } else {
          deco_toolbar.deactivate();
        }
      });
  }
});

// Custom theme
$(document).on('deco-panel.activated', function(e, panel) {
  $.plone.mask.load();
  panel.el.css({
    'width': '100%',
    'float': 'left',
    'background': '#FFFFFF',
    'min-height': '50px',
    'position': 'relative',
    'z-index': '450'
  });
});
$(document).on('deco-panel.deactivated', function(e, panel) {
  $.plone.mask.close();
  panel.el.css({
    'background': 'transparent',
    'z-index': 'auto',
    'min-height': '0'
  });
});

// }}}
}(jQuery));
