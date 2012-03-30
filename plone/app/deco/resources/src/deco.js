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

(function ($) {
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

    // # Utils {{{
    $.deco.create_proxy_tile = function() {
        return $('<div/>').css({
            'opacity': .75,
            'z-index': 1000,
            'position': 'absolute',
            'border': '1px solid #89B',
            'background': '#BCE',
            'height': '58px',
            'width': '258px'
            });
    };
    $.deco.create_preview_tile = function() {
        return $('<div/>').addClass('tile-preview')
            .css({
                'width': '100%',
                'height': '50px',
                'background': '#EEEEEE',
                'border': '2px dotted #BBBBBB',
                'border-radius': '3px'
                });
    };
    $.deco.drop_tile = function(e, dd) {
        var el = $($(dd.proxy).html()),
            preview_tile = $('.tile-preview', window.parent.document),
            new_tile_in_grid = $(dd.drag).attr('data-tiletype') !== undefined;

        if (preview_tile.size() > 0) {
            if (new_tile_in_grid) {
                el.removeAttr('data-tiletype').removeAttr('style');
                el.find('.btn-tile-add').remove();
            }

            preview_tile.after(el).remove();
            var tile = el.decoTile();  // this initializes tile

            if (new_tile_in_grid) {
                tile.el_content.show();
                tile.el_content.trigger('dblclick');
            }
        }
    };
    // }}}

    // # Tile {{{
    $.deco.Tile = function(e, p) { this.init(e, p); };
    $.deco.Tile.prototype = {
        init: function(el, parent) {
            var self = this;

            self.parent = parent
            self.el  = el;
            self.el_add_button = $('> .btn-tile-add', self.el);
            self.el_edit_button = $('> .btn-tile-edit', self.el);
            self.el_form = $('> .tile-form', self.el);
            self.el_content = $('> .tile-content', self.el);

            self.title = $('.tile-title', self.el).text();
            self.description = $('.tile-description', self.el).text();

            // TODO: dblclick on self.el_view
            self.el_content.on('dblclick', function(e) {
                $(this).parent('.tile-wrapper').addClass('tile-being-edited')
                self.el.ploneOverlay(function(overlay) {
                    var panel_z_indexes = {};
                    $('[data-panel]', window.parent.document).each(function() {
                        var el = $(this);
                        if (el.css('z-index')) {
                            panel_z_indexes[el.attr('data-panel')] = el.css('z-index');
                        }
                        el.css('z-index', 0);
                    });
                    $.plone.overlay_form_transform(overlay, $(self.el_form.html()));
                    overlay._overlay.on('hidden', function() {
                        $('[data-panel]', window.parent.document).each(function() {
                            var el = $(this);
                            el.css('z-index', panel_z_indexes[el.attr('data-panel')]);
                        });
                    });
                    $("input[name='buttons.save']", overlay.footer).on('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();

                        $.each($(this).parents('form').serializeArray(), function(i, item) {
                            if (item.name === 'text') {
                                self.el_content.html(item.value);
                            } else if (item.name === 'external_url') {
                                self.el_content.html($('<img/>').attr('src', item.value));
                            }
                        });

                        overlay.modal('hide');
                    });
                    overlay.mask = false;
                    overlay.modal(overlay.options);

                });
            });

            // make tile draggable
            self.make_draggable();

            // prevent clicking on add button
            self.el_add_button.on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });

            self.el_add_button.css({
                'cursor': 'move',
            });
            //
            self.el.css({
                'cursor': 'move',
            });
        },
        make_draggable: function() {
            var tile = this,
                column = tile.parent;
            tile.el.on('dragstart', function(e, dd) {
                if ($(dd.drag).hasClass('tile-being-edited')) {
                    return false;
                }
                var proxy = $.deco.create_proxy_tile();
                    tile = $(dd.drag).clone();

                proxy.append(tile.hide())
                    .appendTo($('body', window.parent.document));

                // delete original if not dragging from toolbar
                if ($(dd.drag).attr('data-tiletype') === undefined) {
                    $(dd.drag).remove();
                    proxy.css({ // position tile under the mouse
                        top: e.pageY - (proxy.outerHeight() / 2),
                        left: e.pageX - (proxy.outerWidth() / 2)
                    });
                }

                return proxy;
            });
            tile.el.on('drag', function(e, dd) {
                if ($(dd.drag).hasClass('tile-being-edited')) {
                    $(dd.proxy).remove();
                    return false;
                }
                $(dd.proxy).css({
                    top: dd.offsetY,
                    left: dd.offsetX
                });

                // show preview
                var drop = $(dd.drop);
                if (drop.size() !== 0) {
                    drop.each(function() {
                        var column = $(this).decoColumn();

                        // remove preview tile
                        column.parent.parent.el.find('.tile-preview').remove();

                        // just append it to column if there is no tiles in
                        // column yet
                        if (column.items().size() === 0) {
                            column.el.append($.deco.create_preview_tile());

                        // calculate position if there are tiles already
                        // existing
                        } else {
                            var drop_el, drop_method, drop_distance,
                                klass_tile_preview = $.deco.options.klass_tile_preview;

                            $.each(column.items(), function(i, tile) {
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
                            });

                            column.el.find('.' + klass_tile_preview).remove();
                            drop_el[drop_method]($.deco.create_preview_tile());
                        }

                    });
                }
            });
            tile.el.on('dragend', function(e, dd) {
                $(this).animate({top: dd.offsetY, left: dd.offset}, 420);
                $(dd.proxy).remove();

                if ($(dd.drop).size() == 0 &&
                    $(window.parent.document, '.tile-preview').size() === 1) {
                    $('.tile-preview', window.parent.document).remove();
                    //$.deco.drop_tile(e, dd);
                };
            });
        },
        finalize: function() {
            var self = this;
            $.each(['draginit','dragstart','drag','dragend'],
                function(i, type) { self.el.off(type);
            });
            self.el.removeAttr('style');
            self.el_view.off('dblclick');
            self.el_add_button.off('click');
        }
    };
    // }}}

    // # Column {{{
    $.deco.Column= function(el, parent) { this.init(el, parent); };
    $.deco.Column.prototype = {
        init: function(el, parent) {
            var self = this;

            self.el = el;
            self.parent = parent;

            // drop tolerance
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

            // make column droppable for tiles
            self.el.on('drop', $.deco.drop_tile);
        },
        finalize: function() {
            var self = this;

            $.each(self.items(), function(i, item) { item.finalize(); });

            // unbind drop events
            $.each(['dropinit','dropstart','drop','dropend'],
                function(i, type) { self.el.unbind( type );
            });
        },
        items: function() {
            var self = this, items = [];
            self.el.find('> div:not(.tile-preview)').each(function(i, el) {
                items.push($(el).decoTile(self));
            });
            return $(items);
        }
    };
    // }}}

    // # Row {{{
    $.deco.Row = function(el, parent) { this.init(el, parent); };
    $.deco.Row.prototype = {
        init: function(el, parent) {
            this.el = el;
            this.parent = parent;
            this.items();
        },
        finalize: function() {
            $.each(this.items(), function(i, item) { item.finalize(); });
        },
        items: function() {
            var self = this, items = [];
            self.el.find('> div').each(function(i, el) {
                items.push($(el).decoColumn(self));
            });
            return items;
        }
    };
    // }}}

    // # Panel {{{
    $.deco.Panel = function(el) { this.init(el); };
    $.deco.Panel.prototype = {
        init: function(el, options) {
            var self = this;
            self.el = el;
            self.items();
            self.el_style = self.el.attr('style');
            self.el.attr('style', self.el_style +
                    ' position: relative; float: left; width: 100%;');
        },
        finalize: function() {
            self.el.attr(self.el_style);
            $.each(this.items(), function(i, item) { item.finalize(); });
        },
        items: function() {
            var self = this, items = [];
            self.el.find('> div').each(function(i, el) {
                items.push($(el).decoRow(self));
            });
            return items;
        }
    };
    // }}}

    // # jQuery Integration {{{
    //
    // bellow code creates jquery method for each model, that creates instance
    // of it for selected dom eleement, eg.:
    //  $.deco._.Panel -> $.fn.decoPanel
    //
    $.each(['Panel', 'Row', 'Column', 'Tile' ], function(i, name) {
        $.fn['deco' + name] = function(parent) {
            var el = $(this),
                data_attr = $.deco.options['data_attr_' + name.toLowerCase()],
                data = el.data(data_attr);

            if (data === undefined) {
                data = new $.deco[name]($(el), parent);
                el.data(data_attr, data);
            }

            return data;
        };
    });
    // }}}

}(jQuery));
