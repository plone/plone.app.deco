//
// This plugin is used to create and edit deco layout.
//
// @author Rob Gietema, Rok Garbas
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
/*global $:false, jQuery:false, alert:false */

(function ( window, $, document ) {
    "use strict";

    // # Namespace {{{
    //
    // Ensure that deco namespace is there
    $.deco = $.deco || { version: '1.0', _: {} };
    // }}}

    // # Options {{{
    //
    // default options
    $.deco.options = $.extend(true, {
        mask_zindex:            '400',
        data_attr_panel:        'data-panel',
        data_attr_row:          'data-row',
        data_attr_column:       'data-column',
        data_attr_tile:         'data-tile',
        klass_panel:            'deco-panel',
        klass_row:              'deco-row',
        klass_column:           'deco-column',
        klass_tile:             'deco-tile',
        klass_tile_dragging:    'deco-tile-dragging',
        klass_tile_preview:     'deco-tile-preview',
        klass_tile_dropped:     'deco-tile-dropped'
    }, $.deco.options || {});
    // tiles_options
    $.deco.tiles_options = {};
    $.deco.tiles_instances = {};
    // }}}

    // # Tile {{{
    $.deco._.Tile = function(el, options, state) {
        this.initialize(el, options, state);
        return this;
    };
    $.deco._.Tile.prototype = {
        initialize: function(el, options, state) {
            var self = this,
                data_attr = $.deco.options.data_attr_tile;

            self.el = el.addClass($.deco.options.klass_tile);
            self.state = state || 'dropped';
            self.options = options;
            self.activated = false;

            // set class on element
            self.el.addClass($.deco.options['klass_tile_' + state]);

            // merge options 
            options = $.extend({
                activate: true,
                states: ['dragging', 'preview', 'dropped']
            }, options);

            // update data-tile attribute
            if (options.url !== undefined) {
                self.el.attr(data_attr, options.url);
            }

            // update tile content
            if (options.content !== undefined) {
                self.el.html(options.content);
            }

            // update state functions
            $.each(options.states, function(i, name) {
                name = 'state_' + name;
                if (options[name] !== undefined) {
                    self['custom_' + name] = options[name];
                }
            });

            // activate when instanting tile; default: true
            if (options.activate === true) {
                self.activate();
            }
        },
        activate: function() {
            var self = this;

            // activate only one time
            if (self.activated === true) {
                return;
            }

            // call apropriate state
            self['state_' + self.state]();

            // after activating it mark it as activated
            self.activated = true;
        },
        deactivate: function() {
            var self = this;

            // don't do anything if not already activated
            if (self.activated === false) {
                return;
            }

            // unbind drag-n-drop events
            $.each(['dropinit','dropstart','drop','dropend',
                    'draginit','dragstart','drag','dragend'],
                function( i, type ) { self.el.unbind( type );
            });

            // after deactivating it mark it as deactivated
            self.activated = false;
        },
        destroy: function() {
            var self = this;
            self.deactivate();
            self.el.remove();
        },
        state_dragging: function() {
            var self = this;
            if (self.custom_state_dragging !== undefined) {
                self.custom_state_dragging();
            }
            self.el.css({
                position: 'absolute',
                cursor: 'move'
            });
            self.draggable(0);
        },
        state_preview: function() {
            var self = this;
            if (self.custom_state_preview !== undefined) {
                self.custom_state_preview();
            }
            self.el.css({
                position: 'relative',
                cursor: 'auto'
            });
        },
        state_dropped: function() {
            var self = this;
            if (self.custom_state_dropped !== undefined) {
                self.custom_state_dropped();
            }
            self.el.css({
                position: 'relative',
                cursor: 'move'
            });
            self.draggable(20);
            self.el.decoTileButton(self.options);
        },
        draggable: function(distance) {
            var self = this;

            // dragging
            self.el.drag(function(e, dd) {

                // position proxy element (element we are dragging)
                $(dd.proxy).css($.extend({}, $.deco.options.tile_dragging_css, {
                    top: dd.offsetY,
                    left: dd.offsetX
                }));

                function insert_preview_tile(column) {
                    var drop_el, drop_method, drop_distance,
                        klass_tile_preview = $.deco.options.klass_tile_preview;
                    $.each(column.getTiles(), function(i, tile) {
                        if (tile.state === 'dropped') {
                            var tile_top = tile.el.offset().top,
                                tile_height = tile.el.height(),
                                tile_middle = tile_top + (tile_height / 2),
                                tile_distance = Math.min(
                                    Math.abs(tile_top - e.pageY),
                                    Math.abs(tile_top + tile_height - e.pageY));
                            
                            if ((drop_el === undefined) ||
                                    (tile_distance < drop_distance)) {
                                drop_el = tile.el;
                                drop_distance = tile_distance;
                            }

                            if (tile_middle < e.pageY) {
                                drop_method = 'after';
                            } else {
                                drop_method = 'before';
                            }
                        }
                    });
                    column.el.find('.' + klass_tile_preview).remove();
                    drop_el[drop_method](
                        $('<div/>').decoTile(
                            $(dd.proxy).decoTile().options, 'preview').el); 
                }

                var drop_el = $(dd.drop);
                if (drop_el.size() !== 0) {
                    var column = drop_el.decoColumn();
                    if (column.tiles.size() !== 0) {
                        insert_preview_tile(column);
                    }
                }

            }, { distance: distance });

            // when dragging ends we remove proxy/preview element
            self.el.drag('end', function(e, dd) {
                $(dd.proxy).remove();
                // TODO: if not dropped then we should return tile on old
                // position
            });

        },
        getType: function() {
            // eg. extract "texttile" from "URL/@@texttile/1/?value="test"
            var type = this.el.attr($.deco.options.data_attr_tile);
            type = type.split('?')[0];  // strip away url params
            type = type.split('@@')[type.split('@@').length]; // strip away url
            type = type.split('/'); // strip away path after type name
            return type;
        }
    };
    // }}}

    // # Column {{{
    $.deco._.Column= function(el) {
        this.initialize(el);
        return this;
    };
    $.deco._.Column.prototype = {
        initialize: function(el) {
            var self = this;
            self.el = el.addClass($.deco.options.klass_column);
            self.activate();
        },
        activate: function() {
            var self = this;

            self.tiles = self.getTiles();

            // each column is a droppable element
            self.el.drop('start', function(e, dd) {
                var column = $(this).decoColumn();

                if (column.tiles.size() === 0) {
                    column.el.append(
                        $('<div/>').decoTile(
                            $(dd.proxy).decoTile().options,'preview').el); 
                }
            });
            self.el.drop('end', function(e, dd) {
                $(this).find('.' + $.deco.options.klass_tile_preview).remove();
            });
            self.el.drop(function(e, dd) {
                var klass_tile_preview = $.deco.options.klass_tile_preview,
                    dragging = $(dd.proxy).decoTile(),
                    dropped = $('<div/>').decoTile(dragging.options,'dropped'),
                    column = $(this).decoColumn();

                // insert tile after 
                column.el.find('.' + klass_tile_preview).after(dropped.el);

                // update tiles count
                column.tiles = column.getTiles();
            });
            $.drop({ tolerance: function(e, proxy, target ) {
                var drop = $.event.special.drop,
                    data_attr = $.deco.options.data_attr_panel,
                    panel_el = $(target.elem).parents('[' + data_attr + '] > div'),
                    panel_target = drop.locate(panel_el);
                if ((drop.contains(panel_target, [e.pageX, e.pageY]) === true) &&
                    (target.left < e.pageX) && (target.right > e.pageX)) {
                    return 1;
                }
                return 0;
            }});
        },
        deactivate: function() {
            var self = this;
            $.each(self.tiles, function(i, tile) {
                tile.deactivate();
            });
            self.tiles = [];
        },
        getTiles: function() {
            var self = this, tiles = [],
                data_attr = $.deco.options.data_attr_tile;

            self.el.find('[' + data_attr + ']').each(function(i, el) {
                var tile = $(el).decoTile();
                if (tile.state === 'dropped') {
                    tiles.push(tile);
                }
            });

            return $(tiles);
        }
    };
    // }}}

    // # Row {{{
    $.deco._.Row = function(el) {
        this.initialize(el);
        return this;
    };
    $.deco._.Row.prototype = {
        initialize: function(el) {
            var self = this;
            self.el = el.addClass($.deco.options.klass_row);
            self.activate();
        },
        activate: function() {
            var self = this;
            self.columns = [];
            self.el.find('> div').each(function(i, el) {
                self.columns.push($(el).decoColumn());
            });
        },
        deactivate: function() {
            var self = this;
            $.each(self.columns, function(i, column) {
                column.deactivate();
            });
            self.columns = [];
        }
    };
    // }}}

    // # Panel {{{
    $.deco._.Panel = function(el, options) {
        this.initialize(el, options);
        return this;
    };
    $.deco._.Panel.prototype = {
        initialize: function(el, options) {
            var self = this;

            self.el = el;
            self.options = $.extend({ activate: false }, options);
            self.activated = false;

            // inner wrapper of rows, create it if its not there
            if (self.el.children().size() === 0) {
                self.el.html('<div style="position: relative;"></div>');
            } else if (self.el.children().size() !== 1) {
                alert('Content of panel is not correctly structred to be ' +
                        'editable with deco editor.');
            }
            self.el_wrapper = self.el.children().first();
            self.el_wrapper.addClass($.deco.options.klass_panel);

            // activate when instanting tile; default: true
            if (self.options.activate) {
                self.activate();
            }
        },
        activate: function() {
            var self = this;

            // activate only one time
            if (self.activated === true) {
                return;
            }

            self.rows = [];
            self.el_wrapper.find('> div').each(function(i, el) {
                self.rows.push($(el).decoRow());
            });

            // after activating it mark it as activated
            self.activated = true;
        },
        deactivate: function() {
            var self = this;

            // don't do anything if not already activated
            if (self.activated === false) {
                return;
            }

            $.each(self.rows, function(i, row) { row.deactivate(); });
            self.rows = [];

            // after deactivating it mark it as deactivated
            self.activated = false;
        }
    };
    // }}}

    // # jQuery Integration {{{
    //
    // bellow code creates jquery method for each model, that creates instance
    // of it for selected dom eleement, eg.:
    //  $.deco._.Panel -> $.fn.decoPanel
    //
    $.each($.deco._, function(name, Func) {
        $.fn['deco' + name] = function(options, state) {
            var el = $(this),
                data_attr = $.deco.options['data_attr_' + name.toLowerCase()],
                data = el.data(data_attr);

            if (data === undefined) {
                data = new Func(el, options, state);
                el.data(data_attr, data);
            }

            return data;
        };
    });
    // }}}

    // # Helper for tile button {{{
    //
    // helper jquery function which turns element into button which adds new
    // tile when is press or being dragged from.
    $.fn.decoTileButton = function(tile_options) {

        // play nice with mask and toolbar if they exists 
        var mask = $.mask ? $.mask.getMask() : undefined,
            toolbar = $.deco.options.toolbar ? $.deco.options.toolbar : undefined,
            data_attr = $.deco.options.data_attr_panel;

        // create new tile and position on click and drag start event
        $(this).drag('init', function(e, dd) {

            var tile = $('<div/>') // create new tile
                    .appendTo($('body'))
                    .decoTile(tile_options, 'dragging');

            tile.el.css({ // position tile under the mouse
                top: e.pageY - (tile.el.outerHeight() / 2),
                left: e.pageX - (tile.el.outerWidth() / 2)
            });

            // if element we are trying to drag is already in grid
            if ($(this).parents('[' + data_attr + ']').size() !== 0) {
                var column = $(this).parent().decoColumn();
                $(this).detach();
                column.tiles = column.getTiles();
            }

            // jquery tools expose/mask integration
            if (mask !== undefined) {

                // TODO: zindex is still weirdly passed here

                // initially put mask over deco panels(401) but under
                // toolbar(500)
                mask.css('z-index', $.deco.options.mask_zindex + 2);

                // initially put tile above deco panel(400) and mask(452)
                tile.el.css('z-index', $.deco.options.mask_zindex + 3);

                // when start dragging put mask back behind deco panels(450)
                tile.el.drag('start', function(e, el) {
                    mask.css('z-index', $.deco.options.mask_zindex + 1);
                });

            }

            // toolbar integration: shrink toolbar when new tile is created
            if (toolbar !== undefined) {

                toolbar.shrink();

            }

            return tile.el;
        });

    };
    // }}}

}( window.parent ? window.parent : window,
   window.parent ? window.parent.jQuery : window.jQuery,
   window.parent ? window.parent.document : window.document ));
