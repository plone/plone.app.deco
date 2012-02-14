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
        panel_data_attr: 'data-panel',
        panel_zindex: 450,
        tile_data_attr: 'data-tile',
        tile_preview_klass: 'tile-preview',
        tile_dragging_css: {
            opacity: 0.5,
            background: '#F0E56E'
            }
    }, $.deco.options || {});
    // }}}

    // # Tile {{{
    $.deco._.Tile = function(el, options) {
        this.initialize(el, options);
        return this;
    };
    $.deco._.Tile.prototype = {
        initialize: function(el, options) {
            var self = this;

            self.el = el;
            self.options = $.extend({
                do_not_activate: false
            }, options);
            self.activated = false;

            if (!self.options.do_not_activate) {
                self.activate();
            }
        },
        activate: function() {
            var self = this,
                tile_preview_klass = $.deco.options.tile_preview_klass;

            // activate only one time
            if (self.activated === true) {
                return;
            }

            // tile can exist in to states:
            //
            //  - outside grid: while dragging, means that we have to force
            //    absolute position.
            if (self.getPanel() === undefined) {
                // FIXME: not sure if 'fixed' works 100% if not use absolute
                self.el.css({ position: 'fixed' });

            //  - inside grid: when droped and this are tiles that will be
            //    later on saved. we have to force relative position
            } else {
                self.el.css({ position: 'relative' });
            }

            // move cursor is forced if this is not preview tile
            if (self.el.hasClass(tile_preview_klass)) {
                self.el.css({ cursor: 'auto' });
            } else {
                self.el.css({ cursor: 'move' });
            }

            // bind to draging events, but not if this is preview tile
            if (!self.el.hasClass(tile_preview_klass)) {
                self.draggable();
            }

            // after activating it mark it as activated
            self.activated = true;
        },
        deactivate: function() {
            var self = this;

            // don't do anything if not already activated
            if (self.activated === false) {
                return;
            }

            // unbind drag-n-drop event
            $.each(['dropinit','dropstart','drop','dropend',
                    'draginit','dragstart','drag','dragend'],
                function( i, type ) { self.el.unbind( type );
            });

            // after deactivating it mark it as deactivated
            self.activated = false;
        },
        draggable: function() {
            var self = this;

            // dragging
            self.el.drag(function(e, dd) {

                // position proxy element (element we are dragging)
                $(dd.proxy).css($.extend({}, $.deco.options.tile_dragging_css, {
                    top: dd.offsetY,
                    left: dd.offsetX
                }));

                //console.log('drag: default');
            });
            self.el.drag('end', function(e, dd) {
                $(dd.proxy).css({opacity: 1});
            });

        },
        getPanel: function() {
            var self = this;
            if (self._panel === undefined) {
                var data_attr = $.deco.options.panel_data_attr,
                    el = self.el.parents('[' + data_attr +']');
                self._panel = el.size() !== 0 ? el.data(data_attr) : undefined;
            }
            return self._panel;
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
        $.fn['deco' + name] = function(options) {
            var el = $(this),
                data_attr = $.deco.options[name.toLowerCase() + '_data_attr'],
                data = el.data(data_attr);

            if (data === undefined) {
                data = new Func(el, options);
                el.data(data_attr, data);
            }

            return data;
        };
    });
    // }}}

    // # Create New Tile Button {{{
    //
    // helper jquery function which turns element into button which adds new
    // tile when is press or being dragged from.
    $.fn.decoNewTileButton = function(tile_url, tile_content) {

        // play nice with mask and toolbar if they exists 
        var mask = $.deco.mask ? $.deco.mask : undefined,
            toolbar = $.deco.toolbar ? $.deco.toolbar : undefined,
            tile_dragging_css = $.deco.options.tile_dragging_css;


        function new_tile(e) {

            var tile = $('<div/>')
                .appendTo($('body'))
                .attr($.deco.options.tile_data_attr, tile_url)
                .css($.extend({}, tile_dragging_css, {opacity: 1}))
                .html(tile_content)
                .decoTile();

            // initially put tile above deco panel(450) and mask(451)
            tile.el.css('z-index', $.deco.options.panel_zindex + 2);

            // when start dragging put mask back behind deco panels(450)
            tile.el.drag('start', function(e, el) {
                if (mask !== undefined) {
                    mask.css('z-index', $.deco.options.mask_zindex);
                }
            });

            // position tile under the mouse
            tile.el.css({
                top: e.pageY - (tile.el.outerHeight() / 2),
                left: e.pageX - (tile.el.outerWidth() / 2)
            });

            // jquery tools expose/mask integration: initially put mask over
            // deco panels(450) but under toolbar(500)
            if (mask !== undefined) {
                mask.css('z-index', $.deco.options.panel_zindex + 1);
            }

            // toolbar integration: shrink toolbar when new tile is created
            if (toolbar !== undefined) {
                toolbar.shrink();
            }

            return tile;
        }

        // create new tile and position on click and drag start event
        $(this)
            // TODO: when clicked it is not centered in center of window but 
            .click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                new_tile(e);
                })
            .drag('init', function(e, dd) {
                return new_tile(e).el;
                });
    };
    // }}}

    // # Panels {{{
    //
    // get instances of panels from current document
    $.deco.panels = function(panels, options) {

        // merge options
        options = $.extend($.deco.options, options);

        // panel query 
        var panel_query = '',
            panel_data_attr = options.panel_data_attr;
        if (typeof(panels) === 'string') {
            panel_query = '[' + panel_data_attr + '="' + panels + '"]';
        } else if (panels === undefined) {
            panel_query = '[' + panel_data_attr + ']';
        } else if ($(panels).size() !== 0) {
            $(panels).each(function(i, panel) {
                if (panel_query !== '') { panel_query += ','; }
                panel_query += '[' + panel_data_attr + '="' + panel + '"]';
            });
        }

        // get panels and instantiate them
        panels = [];
        $('body').find(panel_query).each(function(i, el) {
            panels.push($(el).decoPanel(options));
        });

        // return array of panel instances
        return $(panels);
    };
    // }}}

}( window.parent ? window.parent : window,
   window.parent ? window.parent.jQuery : window.jQuery,
   window.parent ? window.parent.document : window.document ));
