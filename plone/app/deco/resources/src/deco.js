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
        return $('<div/>').addClass('tile-preview')
            .css({
                'cursor': 'move',
                'width': '100%',
                'height': '50px',
                'background': '#EEEEEE',
                'border': '2px dotted #BBBBBB',
                'border-radius': '3px'
                });
    };
    //
    // drop tile on grid
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
                tile_el.removeAttr('data-tiletype').removeAttr('style');
                tile_el.find('.btn-tile-add').remove();
            } else {
                tile_el.show();
            }

            // move tile after preview tile and remove preview tile
            preview_tile.after(tile_el);
            preview_tile.remove();

            // this initializes tile again if not yet initialized
            var tile = tile_el.decoTile();

            // if we moved tile from toolbar we have to show its content part
            // which was hidden while being in toolbar
            if (dragging_from_toolbar) {
                tile.el_content.show();
                tile.el_content.trigger('dblclick');
            }
        }
    };
    // }}}

    // # Tile {{{
    //
    // TODO: wtf is the purpose of having tile object
    $.deco.Tile = function(e, p) { this.init(e, p); };
    $.deco.Tile.prototype = {
        // initialization {{{
        // TODO: what are we doing in initialization
        init: function(el, parent) {
            var self = this;

            self.parent = parent;
            self.el = el;
            self.el_add_button = $('> .btn-tile-add', self.el);
            self.el_edit_button = $('> .btn-tile-edit', self.el);
            self.el_form = $('> .tile-form', self.el);
            self.el_content = $('> .tile-content', self.el);

            self.title = $('.tile-title', self.el).text();
            self.description = $('.tile-description', self.el).text();

            // TODO: dblclick on self.el_view
            self.el_content.on('dblclick', self.dblclick);

            // bind all drag events
            self.el.on('draginit', self.draginit);
            self.el.on('dragstart', self.dragstart);
            self.el.on('drag', self.drag);
            self.el.on('dragend', self.dragend);

            // prevent clicking on add button
            self.el_add_button.on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });

            self.el_add_button.css({
                'cursor': 'move'
            });

            //
            self.el.css({
                'cursor': 'move'
            });
        },
        // }}}
        // dblclick {{{
        dblclick: function(e) {
            var self = $(this).parents('.tile-wrapper').decoTile();

            // mark tile as being
            self.el.addClass('tile-being-edited');

            // open overlay
            self.el.ploneOverlay(function(overlay) {

                $.plone.overlay_form_transform(overlay, $(self.el_form.html()));

                overlay._overlay.on('show', function() {
                    overlay.iframe.stretch();
                });
                overlay._overlay.on('hidden', function() {
                    self.el.removeClass('tile-being-edited');
                    overlay.iframe.shrink();
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
                    self.el.removeClass('tile-being-edited');
                });
                overlay.mask = false;
                overlay.modal(overlay.options);

            });
        },
        // }}}
        // draginit {{{
        //
        // This event is fired when a mouse button is pressed (mousedown)
        // within the bound element. The handler can return false to cancel the
        // rest of the drag interaction events, or can return elements to use
        // as the drag targets for the rest of the drag interaction. This event
        // will not fire unless the options "not", "handle", and "which" are
        // all satisfied.
        draginit: function(e, dd) {
            window.parent.$('iframe[name=' + window.name + ']')
                    .iframize('toolbar').stretch();
            },
        // }}}
        // dragstart {{{
        //
        // This event fires after "draginit", once the mouse has moved
        // a minimum "distance", which may be specificed in the options. The
        // handler can return false to cancel the rest of the drag interaction
        // events, or can return an element to set as the drag proxy for the
        // rest of the drag interaction. If dragging multiple elements (from
        // "draginit"), this event will fire uniquely on each element.
        dragstart: function(e, dd) {

            // tile is being edited, which means dblclick click happend and we
            // want to avoid dragging. return false will cancel rest of drag
            // interaction.
            if ($(dd.drag).hasClass('tile-being-edited')) {
                return false;
            }

            // create proxy element which is going to be dragged around append
            // it to body of top frame.
            var proxy = $.deco.create_proxy_tile()
                    .appendTo($('body'));

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
        },
        // }}}
        // drag {{{
        //
        // This event fires after "draginit" and "dragstart" every time the
        // mouse moves. The handler can return false to stop the drag
        // interaction and go straight to "dragend" and also prevent any "drop"
        // events. If dragging multiple elements (from "draginit"), this event
        // will fire uniquely on each element.
        drag: function(e, dd) {

            // tile is being edited, which means dblclick click happend and we
            // want to avoid dragging. return false will cancel rest of drag
            // interaction.
            // because we can not always with certanty say which event
            // 'dblclick' or 'dragstart' event will be first it might happen
            // that also 'drag' event will be fired up. if so we have to cancel
            // rest of drag interaction and remove proxy created at 'decostart'
            // event.
            if ($(dd.drag).hasClass('tile-being-edited')) {
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
                    var column = $(this).decoColumn();
                    if (column.items().size() === 0) {
                        column.el.append($.deco.create_preview_tile());

                    // calculate position if there are tiles already
                    // existing
                    } else {
                        var drop_el, drop_method, drop_distance;

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
        },
        // }}}
        // dragend {{{
        //
        // This event fires after "draginit" and "dragstart" and "drag" when
        // the mouse button is released, or when a "drag" event is canceled.
        // This event will always fire after any "drop" events. If dragging
        // multiple elements (from "draginit"), this event will fire uniquely
        // on each element.
        dragend: function(_e, dd) {
            $(this).animate({top: dd.offsetY, left: dd.offset}, 420);
            $(dd.proxy).remove();

            if ($('.tile-being-edited', window.parent.document).size() === 0) {
                window.parent.$('iframe[name=' + window.name + ']')
                        .iframize('toolbar').shrink();
            }

            // above will execute when we are outside dropzone panels and when
            // there is already existing tile-preview
            if ($(dd.drop).size() === 0 &&
                $(window.parent.document, '.tile-preview').size() === 1) {
                $('.tile-preview', window.parent.document).remove();
                // TODO:
                // $.deco.drop_tile(e, dd);
            }
        },
        // }}}
        // finalize {{{
        //
        // this function will (should) cleanup whatever we do with our tile dom
        // element so that after saving we lest out tile "clean"
        finalize: function() {
            var self = this;

            // unregister from all drag event that we
            $.each(['draginit','dragstart','drag','dragend'],
                function(i, type) { self.el.off(type);
            });

            // remove styles from element if we added any
            self.el.removeAttr('style');

            // disable dblclick
            self.el_view.off('dblclick');
        }
        // }}}
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
            //$.drop({ tolerance: function(e, proxy, target ) {
            //    var drop = $.event.special.drop,
            //        data_attr = $.deco.options.data_attr_panel,
            //        panel_el = $(target.elem).parents('[' + data_attr + '] > div'),
            //        panel_target = drop.locate(panel_el);

            //    if ((drop.contains(panel_target, [e.pageX, e.pageY]) === true) &&
            //        (target.left < e.pageX) && (target.right > e.pageX)) {
            //        return 1;
            //    }
            //    return 0;
            //}});

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
            self.el.attr('style', self.el_style + ' position: relative; float: left; width: 100%;');
        },
        finalize: function() {
            var self = this;
            self.el.attr(self.el_style);
            $.each(self.items(), function(i, item) { item.finalize(); });
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
    // of it for selected dom element, eg.:
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
