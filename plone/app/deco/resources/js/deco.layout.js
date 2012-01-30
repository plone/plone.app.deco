//
// This plugin is used to create and edit deco layout.
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
/*global $:false, jQuery:false */


(function ( window, $, document ) {
    "use strict";

    // # Namespaces {{{
    //
    // Ensure that used namespaces are there
    $.deco = $.deco || {};
    // }}}

    // # Options {{{
    //
    // we make sure that needed options used in deco.layout.js script are there
    // for us to use.
    $.deco.options = $.extend({
        // used to set number of deco grid columns of deco panel
        grid_columns: 100,
        preview_klass: 'deco-preview',
        panel_attr: 'data-panel',
        panel_css: {
            'position': 'relative',
            'z-index': '450'
            },
        row_helper_klass: 'deco-helper',
        row_helper_css: {
            'background': 'Red',
            'display': 'block',
            'float': 'left',
            'position': 'relative',
            'width': '100%',
            'height': '10px'
            },
        tile_resize_helper_klass: 'deco-resize-helper',
        tile_klass: 'deco-tile',
        tile_attr: 'data-tile'
    }, $.deco.options || {});
    // }}}

    // # Grid {{{
    $.deco.gridRow = function(el) {
        el.css({
            display: 'block',
            float: 'left',
            position: 'relative',
            width: '100%'
        });
    };
    $.deco.gridColumn = function(el, position, width) {
        var grid_columns = $.deco.options.grid_columns,
            column_width = 100 / grid_columns,
            column_style = {
                float: 'left',
                left: '100%',
                position: 'relative'
            };

        // position
        column_style['margin-left'] = '-' + (100 - ((grid_columns - position) * 100 / grid_columns)) + '%';

        // width
        column_style.width = width - (width % column_width);
        if ((width % column_width) / column_width >= 0.5) {
            column_style.width += column_width;
        }
        var difference = column_style.width - width;
        column_style.width = (Math.round(column_style.width * 10000) / 10000) + '%';

        // apply styles to element
        el.css(column_style);

        return difference;
    };
    // }}}

    // # Tile {{{
    //
    // ## Tile construstor
    var Tile = function(el, options) {
        return this.initialize(el, options || {});
    };
    // ## Tile prototype
    Tile.prototype = {
        // ### Default options
        styles: {
            'default': {
                'cursor': 'move',
                'background': 'transparent',
                'z-index': '600'
            },
            'selected': {
                'background': '#F0E56E'
            },
            'resize': {
                'background': 'Red',
                'z-index': '650',
                'width': '10px',
                'height': '10px',
                'position': 'absolute',
                'right': '0',
                'bottom': '0',
                'cursor': 'nwse-resize'
            }
        },
        // ### Initialize
        initialize: function(el, options) {
            var self = this;
            self.el = el;

            // merge styles
            if (options.styles !== undefined) {
                $.each(self.styles, function(style) {
                    $.extend(self.styles[style], options.styles[style] || {});
                });
            }

            return self;
        },
        update: function() {
            var self = this;

            // apply default styles to tile
            self.applyStyle();

            // bind to drag events
            self.el
                .drag('init', self.tileDragInit)
                .drag(self.tileDrag);

            // when initialzing tile that is in grid we have to:
            if (self.getPanel() !== undefined) {

                // 1. create resize helper
                $('<div/>')
                    .css(self.styles.resize)
                    .addClass($.deco.options.tile_resize_helper_klass)
                    .appendTo(self.el)
                    .drag(self.tileResize);

                // 2. bind to hover action to change style
                self.el.hover(
                    // execute when the mouse pointer enters the element
                    function(e) { self.applyStyle('selected'); },
                    // execute when the mouse pointer leaves the element
                    function(e) { self.applyStyle(); }
                );

                // 3. make tile a droppable place
                //
                // dropping another tile on this tile will result with adding
                // new column or adding tile below/above tile that is being
                // dropped on.
                self.el.drop(self.tileDrop);
            }

        },
        // ### Clearing helpers
        clear: function() {
            // TODO: remove preview tiles
        },
        // ### Useful functions {{{
        getTileContent: function() {
            return $('[' + $.deco.options.tile_attr + ']', this.el);
        },
        getColumn: function() {
            return this.el.parent().data('deco-column');
        },
        getRow: function() {
            return this.el.parent().parent().data('deco-row');
        },
        getPanel: function() {
            var el = this.el.parents('[' + $.deco.options.panel_attr + ']');
            if (el.size() !== 0) {
                return el.data('deco-panel');
            }
        },
        // }}}
        // ### Apply different styles, eg: default/normal, selected, etc...
        applyStyle: function(style) {
            var self = this;

            if (style === 'selected') {
                self.el.css(self.styles.selected);
            } else {
                self.el.css(self.styles['default']);
            }

            // tile can exist in to states:
            //
            //  - outside grid: while dragging, means that we have to force
            //    absolute position.
            if (self.getPanel() === undefined) {
                self.el.css({ position: 'absolute'});
                // TODO: would be nice if this would be fixed, but then we have
                // to change drag event

            //  - inside grid: when droped and this are tiles that will be
            //    later on saved. we have to force relative position
            } else {
                self.el.css({ position: 'relative' });
            }

        },
        // ### TODO: actions that happend when tile is dropped
        tileDrop: function(e, dd) {
            $('.' + $.deco.options.preview_klass,
                $(dd.drop).parents('[data-panel]'))
                    .removeClass($.deco.options.preview_klass);
            $(dd.proxy).remove();
        },
        // ### TODO: tile resizing
        tileResize: function(e, dd) {
        },
        // ### starting to drag tile
        tileDragInit: function(e, dd) {
            var tile = $(this).data('deco-tile'),
                tile_panel = tile.getPanel();

            // when we start dragging tile which still in deco grid
            if (tile_panel !== undefined) {
                var tile_el = tile.getTileContent(),
                    tile_column = tile.getColumn(),
                    tile_row = tile.getRow();

                // create new tile which is not in grid
                var new_tile = $.deco.createTile(
                        tile_el.attr($.deco.options.tile_attr),
                        tile_el.html());

                // remove existing tile
                tile.el.remove();

                // row/column cleanup
                //
                // if there is no tiles in column remove column
                if (tile_column.el.decoTiles().size() === 0) {
                    tile_column.el.remove();
                }
                // if there is no tiles in row then remove row
                if (tile_row.el.decoColumns().size() === 0) {
                    tile_row.el.remove();
                }

                tile_panel.update();

                // since we start dragging the tile selected style should
                // always be "on"
                new_tile.update();
                new_tile.applyStyle('selected');

                // once tile is pulled out of grid center it under cursor
                new_tile.el.css({
                    top: e.pageY - (new_tile.el.outerHeight() / 2),
                    left: e.pageX - (new_tile.el.outerWidth() / 2)
                });

                //
                new_tile.el.data('deco-tile', new_tile);

                return new_tile.el;
            }
        },
        // ### calculate dragging direction
        tileDragDirection: function (e) {
            var width = parseFloat(this.el.width()),
                height = parseFloat(this.el.height()),
                X = parseFloat(e.pageX - this.el.offset().left - (width / 2)),
                Y = parseFloat(e.pageY - this.el.offset().top - (height / 2));

            // If left of center
            if (X < 0) {
                if (Y < 0) {  // If above center
                    if ((X / Y) < ((-1 * width) / (-1 * height))) {
                        return 'top';
                    } else {
                        return 'left';
                    }
                } else {  // Below center
                    if ((X / Y) < ((-1 * width) / (height))) {
                        return 'left';
                    } else {
                        return 'bottom';
                    }
                }
            // Right of center
            } else {
                // If above center
                if (Y < 0) {
                    if ((X / Y) < ((1 * width) / (-1 * height))) {
                        return 'right';
                    } else {
                        return 'top';
                    }
                // Below center
                } else {
                    if ((X / Y) < ((width) / (height))) {
                        return 'bottom';
                    } else {
                        return 'right';
                    }
                }
            }
        },
        // ### tile dragging
        tileDrag: function(e, dd) {

            // position proxy element (element we are dragging)
            $(dd.proxy).css({
                opacity: 1,
                top: dd.offsetY,
                left: dd.offsetX
            });

            // clear previous preview tiles
            $('div.' + $.deco.options.preview_klass).remove();

            // in case we are over droppable (but still not dropped) we create
            // preview tile in grid
            var drop_el = $(dd.drop);
            if (drop_el.size() !== 0) {

                var tile = $(dd.proxy).data('deco-tile'),
                    tile_el = tile.getTileContent(),
                    preview_tile = $.deco.createTile(
                            tile_el.attr($.deco.options.tile_attr),
                            tile_el.html());

                // preview tile should be in selected styles
                preview_tile.applyStyle('selected');

                // we make dragging element a bit seethrough while we are
                // showing preview tile
                $(dd.proxy).css('opacity', '0.4');

                // tiles can be dropped in 2 places:
                //  - add new row helper which will create new deco grid row
                //    and place tile inside
                //  - on other tiles, which will place tile:
                //      * above/bellow: tile placed before/after tile element
                //      * left/right: tile placed left/right in new column

                // if droping element is "add new row helper" which we
                // recognize if parent element is row
                if ($.data(drop_el.parent().parent()[0],
                            'deco-panel') !== undefined) {

                    var tile_row_el = $('<div/>')
                            .addClass($.deco.options.preview_klass)
                            .insertAfter(drop_el),
                        tile_column_el = $('<div/>')
                            .appendTo(tile_row_el);

                    preview_tile.el.appendTo(tile_column_el);

                // if dropping element is tile
                } else {

                    var drag_direction = tile.tileDragDirection(e);

                    console.log(drag_direction);

                    // in case of placing preview element left/right we need to
                    // create column before placing it
                    if ((drag_direction === 'left') ||
                        (drag_direction === 'right')) {

                        var drop_column_el = drop_el.parent(),
                            preview_column_el = $('<div/>')
                                .addClass($.deco.options.preview_klass)
                                .append(preview_tile.el);

                        if (drag_direction === 'left') {
                            drop_column_el.before(preview_column_el);
                        } else {
                            drop_column_el.after(preview_column_el);
                        }

                    // add tile top/bottom
                    } else {
                        if (drag_direction === 'top') {
                            drop_el.before(preview_tile.el);
                        } else {
                            drop_el.after(preview_tile.el);
                        }
                    }
                }

                //
                preview_tile.getPanel().update();
                preview_tile.applyStyle('selected');
                preview_tile.el.addClass($.deco.options.preview_klass);
            } else {
                var panel_el = drop_el.parents('[' + $.deco.options.panel_attr + ']');
                if (panel_el.size() !== 0) {
                    panel_el.data('deco-panel').update();
                }
            }
            dd.update();
        }
    };
    // ## Tile jQuery Integration
    $.fn.decoTiles = function (options) {
        var tiles = [];
        $(this).find('> div').each(function(e, el) {
            var tile_el = $(el),
                tile = tile_el.data('deco-tile');

            if (tile === undefined) {
                tile = new Tile(tile_el);
                tile.update();
                tile_el.data('deco-tile', tile);
            }

            tiles.push(tile);
        });
        return $(tiles);
    };
    // ## Utility to create tile structure
    $.deco.createTile = function (url, content, options) {
        var el = $('<div/>')  // wrapping tile with additional div
            .addClass($.deco.options.tile_klass)  // tile class
            .append($('<div/>')  // actual tile
                .attr($.deco.options.tile_attr, url)
                .html(content))
            // initially we always create it at the end of body
            .appendTo($('body'));
        return new Tile(el, options || {});
    };
    // }}}

    // # Column {{{
    //
    // ## Column construstor
    var Column = function(el) { return this.initialize(el); };
    // ## Column prototype
    Column.prototype = {
        // ### Initialize
        initialize: function(el) {
            var self = this;
            self.el = el;
            self.tiles = el.decoTiles();
            return this;
        },
        // ### Update
        update: function() {
            var self = this;

            // update list of tiles
            self.tiles = self.el.decoTiles();

            // update tiles
            $.each(self.tiles, function(i, tile) { tile.update(); });
        },
        // ### Clear helpers
        clear: function() {
            $.each(this.tiles, function(i, tile) { tile.clear(); });
        }
    };
    // ## Column jQuery Integration
    $.fn.decoColumns = function () {
        var columns = [];
        $(this).find('> div').each(function(e, el) {
            var column_el = $(el),
                column = column_el.data('deco-column');

            if (column === undefined) {
                column = new Column(column_el);
                column_el.data('deco-column', column);
            }

            columns.push(column);
        });
        return $(columns);
    };
    // }}}

    // # Row {{{
    //
    // ## Row construstor
    var Row = function(el) { return this.initialize(el); };
    // ## Row prototype
    Row.prototype = {
        // ### Initialize
        initialize: function(el) {
            var self = this;
            self.el = el;
            self.columns = el.decoColumns();
            return this;
        },
        // ### Update
        update: function() {
            var self = this;

            // update list of columns
            self.columns = self.el.decoColumns();

            // recalculate grid cell position and width
            self.recalculateGrid();

            // update columns
            $.each(self.columns, function(i, column) { column.update(); });
        },
        // ### Clearing helper, nothing really to clear here, but will be
        // higher in the chain
        clear: function() {
            $.each(this.columns, function(i, column) { column.clear(); });
        },
        // ### Grid cells position and width
        recalculateGrid: function() {
            var self = this,
                columns = [],
                columns_width = 0,
                average_column_width = 100 / self.columns.length;

            // apply style to row
            $.deco.gridRow(self.el);

            // check if any new column was added
            self.columns = self.el.decoColumns();

            // get column widths
            $.each(self.columns, function(i, column) {
                var column_width = average_column_width,
                    column_style = column.el.attr('style');

                if (column_style !== undefined) {
                    $.each(column.el.attr('style').split(';'), function(i, item) {
                        item = item.split(':');
                        if ($(item).size() === 2) {
                            if (item[0].trim() === 'width') {
                                column_width = parseInt(item[1].trim(), 10);
                            }
                        }
                    });
                }

                columns.push([column.el, column_width]);
                columns_width += column_width;
            });

            //
            var difference = 0, position = 0, width = 0;
            $.each(columns, function(i, item) {
                width = item[1] * 100 / columns_width;
                position += width + difference;
                difference = $.deco.gridColumn(item[0], position, width);
            });

        }
    };
    // ## Row jQuery Integration
    $.fn.decoRows = function () {
        var rows = [];
        $(this).find('> div:not(.' + $.deco.options.row_helper_klass + ')')
            .each(function(i, el) {
                var row_el = $(el),
                    row = row_el.data('deco-row');

                if (row === undefined) {
                    row = new Row(row_el);
                    row.update();
                    row_el.data('deco-row', row);
                }

                rows.push(row);
            });
        return rows;
    };
    // }}}

    // # Panel {{{
    //
    // ## Panel construstor
    var Panel = function(el) { return this.initialize(el); };
    // ## Panel prototype
    Panel.prototype = {
        // ### Initialize
        initialize: function(el) {
            var self = this;
            self.el = el;
            self.el_original = el.clone();

            // inner wrapper of rows, create it if its not there
            if (self.el.children().size() === 0) {
                self.el.html('<div style="position: relative;"></div>');
            // TODO: how do we raise error if initial structure of panel is not
            // like we are expecting from deco grid layout?
            //} else if (self.el.children().size() !== 1) {
            }

            // Rows (instances) of this panel
            this.rows = this.el.children().first().decoRows();

            return this;
        },
        // ### Update
        update: function() {

            function create_helper_row() {
                return $('<div/>')
                    .addClass($.deco.options.row_helper_klass)
                    .css($.deco.options.row_helper_css)
                    // make every helper a droppable place
                    // TODO: redo this part
                    .drop(function(e, dd) {

                        // clear previous preview tiles
                        $('div.' + $.deco.options.preview_klass).remove();

                        //
                        var tile_el = $('[data-tile]', dd.proxy),
                            tile = $.deco.createTile(
                                tile_el.attr($.deco.options.tile_attr),
                                tile_el.html());

                        // wrap tile into column, column into row and place it
                        // after element we dropped it onto
                        $('<div/>')
                                .append($('<div/>').append(tile.el))
                                .insertAfter($(dd.drop));

                        // remove item we've been dragging
                        $(dd.proxy).remove();

                        // update panel and its children
                        // this will add/remove row helpers
                        tile.getPanel().update();
                    });
            }

            var self = this,
                expect = 'helper',
                el_wrapper = self.el.children().first(),
                el = $('> div', el_wrapper).first();

            // update list of rows
            self.rows = self.el.children().first().decoRows();

            // apply custom css (move about mask, ...)
            self.el.css($.deco.options.panel_css);

            // add row helpers to panel, place one helper at the top and other
            // after every row
            while (el.length !== 0) {

                // if we expect helper and its not helper
                if (expect === 'helper') {
                    if (!el.hasClass('deco-helper')) {
                        el.before(create_helper_row());
                    }
                    expect = 'row';
                } else {
                    if (el.hasClass('deco-helper')) {
                        el.remove();
                    } else {
                        expect = 'helper';
                    }
                }

                el = el.next();
            }
            if (expect === 'helper') {
                el_wrapper.append(create_helper_row());
            }

            // update rows
            $.each(this.rows, function(i, row) { row.update(); });
        },
        // ### Clear helpers (Used by Save button)
        clear: function() {
            var self = this;

            // remove row helpers
            self.el.children().first().find(
                    '> .' + $.deco.option.row_helper_klass,
                function(i, el) { $(el).remove(); });

            // restore style from original
            self.el.attr('style', self.el_original.attr('style'));

            // clear rows
            $.each(self.rows, function(i, row) { row.clear(); });

        }
    };
    // ## Panel jQuery Integration
    $.fn.decoPanels = function () {
        var panels = [];

        $(this).find('[' + $.deco.options.panel_attr + ']').each(
            function(i, el) {
                var panel_el = $(el),
                    panel = panel_el.data('deco-panel');

                if (panel === undefined) {
                    panel = new Panel(panel_el);
                    panel.update();
                    panel_el.data('deco-panel', panel);
                }

                panels.push(panel);
            });

        return $(panels);
    };
    // }}}

}( window.parent ? window.parent : window,
   window.parent ? window.parent.jQuery : window.jQuery,
   window.parent ? window.parent.document : window.document ));
