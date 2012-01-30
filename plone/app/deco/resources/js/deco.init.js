;//
// This plugin is used to initialize deco.
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

    // # Namespace {{{
    $.deco = $.deco || {};
    // }}}

    // # Options {{{

    // TODO: below url represents content url and should be set somewhere
    // by plone. eg. $.plone.app.content_url
    // for now we have to do magic below to get clean url
    var base_url = document.location.href
            .split('#')[0].split('?')[0].replace(/\/$/, '');

    // on add form we need to pass which content type we are adding so
    // we get appropriate configuration options
    //
    // TODO: not sure if this is needed since we use deco editor after
    // contet is created
    var content_type = '';
    var match = base_url.match(/^([\w#:.?=%@!\-\/]+)\/\+\+add\+\+([\w#!:.?+=&%@!\-\/]+)$/);
    if (match) {
        content_type = '?type=' + match[2];
    }

    // merge options
    $.deco.options = $.extend({
        initialized: false,
        base_url: base_url,
        editform_url: base_url + '/edit',
        options_url: base_url + '/@@deco-config' + content_type,
        toolbar_id: 'iframe#plone-toolbar',
        toolbar_category_to_replace: '.toolbar-left',
        mask: {
            opacity: 0.6,
            color: '#FFF'
        }
    }, $.deco.options || {});
    // }}}

    // # Buttons {{{
    $.deco.buttons = $.deco.buttons || [];
    $.each([

        // ## Save button
        {
            category: "deco-leftactions",
            id: "toolbar-button-deco-save",
            title: "Save",
            exec: function (item) {
                item.click(function (e) {
                    alert('For now we don\'t do anything, this will ' +
                          'be implemented last!');
                    return false;
                });
            }
        },

        // ## Cancel button
        {
            category: "deco-leftactions",
            id: "toolbar-button-deco-cancel",
            title: "Cancel",
            exec: function (item) {

                var toolbar = $($.deco.options.toolbar_id).toolbar(),
                    toolbar_document = toolbar.el.contents();

                item.click(function (e) {

                    // hide custom deco toolbar
                    $('.toolbar', toolbar_document).removeClass('toolbar-deco');

                    // bring original panels back
                    $.each($(document).decoPanels(), function(i, panel) {
                        panel.el.replaceWith(panel.el_original);
                    });

                    // hide mask
                    $.mask.close();

                    // remove deco helpers
                    $('.deco-helper').remove();

                    return false;
                });
            }
        },

        // ## Properties button
        {
            category: "deco-leftactions",
            id: "toolbar-button-deco-properties",
            title: "Properties",
            exec: function (item) {
                var toolbar = $($.deco.options.toolbar_id).toolbar(),
                    overlay = item.overlay({
                        target: $.deco.editform,
                        onBeforeLoad: function() {
                            toolbar.el.height($(document).height());
                        },
                        onClose: function() {
                            toolbar.el.height(toolbar.options.initial_height);
                        }
                    });

                item.click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    overlay.load();
                });
            }
        }

    ], function (i, button) { $.deco.buttons.push(button); });
    // }}}

    // # Add Tile {{{
    function add_tile(button, tile_options) {
        var mask = $.mask.getMask(),
            toolbar = $($.deco.options.toolbar_id).toolbar(),
            toolbar_document = toolbar.el.contents(),
            tile = $.deco.createTile(
                tile_options.url,
                tile_options['default']
                );

        // TODO: now this looks ugly
        tile.el.data('deco-tile', tile);
        tile.activate();
        tile.applyStyle('selected');
        tile.el.css({ 'z-index': '490' });

        // put mask over deco panels(450) but under
        // toolbar(500)
        mask.css('z-index', '480');
        tile.el
            // when start dragging put mask back behind deco
            // panels(450)
            .drag('start', function(e, el) {
                mask.css('z-index', '400');
                tile.el.css({ 'z-index': '470' });
                })
            // place tile into center
            .css({
                'top': (($(window).height() -
                        tile.el.outerHeight()) / 2) +
                        $(window).scrollTop() + 'px',
                'left': (($(window).width() -
                        tile.el.outerWidth()) / 2) +
                        $(window).scrollLeft() + 'px'
                });

         // TODO: this should be part of toolbar api. eg:
         //  - $.plone.toolbar.shrink()
         //  - $.plone.toolbar.stretch()
         toolbar.el.height(toolbar.options.initial_height);
         toolbar.el.removeClass('toolbar-dropdown-activated');
         $('.activated', toolbar_document).removeClass('activated');
         $('.toolbar-submenu', toolbar_document).hide();
    }
    // }}}

    // # Initialize {{{
    $.deco.initialized = false;
    function initialize() {

        // drop is in "mouse" mode
        $.drop({ mode: true });

        // create mask and place it over page, but below toolbar.
        $.mask.load($.extend($.deco.options.mask, {
            zIndex: 400,
            closeOnEsc: false,
            closeOnClick: false
        }));

        $.when(
            $.get($.deco.options.editform_url),
            $.get($.deco.options.options_url)
        ).done(function(editform, options) {

            var toolbar = $($.deco.options.toolbar_id).toolbar(),
                toolbar_document = toolbar.el.contents(),
                toolbar_left = $($.deco.options.toolbar_category_to_replace,
                        toolbar_document);

            // we load edit form upfront to make deco editing more snappy
            $.deco.editform = $('#form', $(editform[0])
                    .filter('#visual-portal-wrapper'))
                .hide().appendTo($('body', toolbar_document));

            // options
            $.deco.options = $.deco.options || {};
            $.extend($.deco.options, options[0]);

            // Tiles List
            var tiles = [];
            $.each($.deco.options.tiles, function(i, tile_options) {
                tiles.push({
                    category: "tile-category-" + tile_options.category,
                    id: "tile-" + tile_options.name,
                    title: tile_options.label,
                    icon: tile_options.icon,
                    exec: function(button) {
                        button.click(function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            add_tile(button, tile_options);
                        });
                    }
                });
            });

            // "Add tile..." button
            $.deco.buttons.push({
                category: "deco-rightactions",
                id: "toolbar-button-deco-add-tile",
                title: "Add tile ...",
                buttons: tiles
            });

            var buttons = toolbar.create_buttons($.deco.buttons, toolbar.options);

            $.each(buttons.categories, function (category, items) {
                var el = $('.toolbar-category-' + category, toolbar_left);
                if (el.length === 0) {
                    toolbar_left.append(
                        buttons.render_category(items, category));
                }
            });

            // T
            $('.toolbar', toolbar_document).addClass('toolbar-deco');

            // initialize panels
            $(document).decoPanels();
            $.deco.initialized = true;

        });
    }
    // }}}

    // # Activate {{{
    function activate() {

        // initialize deco if not already
        if ($.deco.initialized === false) {
            initialize();
        }

        $.each($(document).decoPanels(), function(i, panel) {
            panel.activate();
        });

    }
    // }}}

    // # Trigger deco when Edit button is pressed {{{
    $('#toolbar-button-edit', $($.deco.options.toolbar_id).contents())
            .click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                activate();
            });
    // }}}

}( window.parent ? window.parent : window,
   window.parent ? window.parent.jQuery : window.jQuery,
   window.parent ? window.parent.document : window.document ));
