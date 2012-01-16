/**
 * This plugin is used to register and execute actions.
 *
 * @author Rob Gietema
 * @version 0.1
 * @licstart  The following is the entire license notice for the JavaScript
 *            code in this page.
 *
 * Copyright (C) 2010 Plone Foundation
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation; either version 2 of the License.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program; if not, write to the Free Software Foundation, Inc., 51
 * Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * @licend  The above is the entire license notice for the JavaScript code in
 *          this page.
 */

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  regexp:true, undef:true, strict:true, trailing:true, browser:true */
/*global $:false, jQuery:false */

(function ( window, $, document ) {
    "use strict";

    // # Namespace
    $.deco = $.deco || {};

    // # Buttons
    $.deco.buttons = $.deco.buttons || [];
    $.each([

        // ## Save button
        {
            category: "deco-leftactions",
            id: "toolbar-button-deco-save",
            title: "Save",
            exec: function (item) {
                item.click(function (e) {
                    alert("For now we don't do anything, this will be implemented last!");
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

                var toolbar = $('iframe#plone-toolbar').toolbar(),
                    toolbar_iframe_el = toolbar.el.contents();

                item.click(function (e) {

                    // hide custom deco toolbar
                    $('.toolbar', toolbar_iframe_el).removeClass('toolbar-deco');

                    // bring original panels back
                    $('[data-panel]').each(
                        function (i, el) {
                            $(el).replaceWith($(el).decoPanel().el_original);
                        }
                    );

                    // hide mask
                    $.mask.close();

                    // remove deco helpers
                    $('.deco-helper').remove();

                    return false;
                });
            }
        },
        {
            category: "deco-leftactions",
            id: "toolbar-button-deco-properties",
            title: "Properties",
            exec: function (item) {
                item.click(function (e) {
                    return false;
                });
            }
        }
    ], function (i, button) { $.deco.buttons.push(button); });


    // # Trigger buttons when deco is initialized
    $(document).bind('decoInitialized', function (e) {

        var toolbar = $('iframe#plone-toolbar').toolbar(),
            toolbar_iframe_el = toolbar.el.contents(),
            toolbar_left_el = $('.toolbar-left', toolbar_iframe_el);


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
                        var mask = $.mask.getMask(),
                            tile = $('<div/>')
                                .html(tile_options['default'])
                                .attr({ 'data-tile': './@@' + tile_options.name })
                                .addClass('deco-helper')
                                .decoTile({
                                    style: {
                                        background: '#F0E56E'
                                    }
                                });

                        // put mask over deco panels(450) but under
                        // toolbar(500)
                        mask.css('z-index', '490');
                        tile.el
                            // when start dragging put mask back behind deco
                            // panels(450)
                            .drag('start', function(e, el) {
                                    mask.css('z-index', '400');
                                })
                            // place tile into center
                            .css({
                                'top': (($(window).height() -
                                            tile.el.outerHeight()) / 2) +
                                            $(window).scrollTop() + 'px',
                                'left': (($(window).width() -
                                            tile.el.outerWidth()) / 2) +
                                            $(window).scrollLeft() + 'px'
                                })
                            // and append it to body
                            .appendTo($('body'));


                        // TODO: this should be part of toolbar api. eg:
                        //  - $.plone.toolbar.shrink()
                        //  - $.plone.toolbar.stretch()
                        toolbar.el.height(toolbar.initial_height);
                        toolbar.el.removeClass('toolbar-dropdown-activated');
                        $('.activated', toolbar_iframe_el).removeClass('activated');
                        $('.toolbar-submenu', toolbar_iframe_el).hide();

                        // clear placeholder and add new tile

                        return false;
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
            var el = $('.toolbar-category-' + category, toolbar_left_el);
            if (el.length === 0) {
                toolbar_left_el.append(
                    buttons.render_category(items, category));
            }
        });

        $('.toolbar', toolbar_iframe_el).addClass('toolbar-deco');

        return buttons;

    });

}( window.parent ? window.parent : window,
   window.parent ? window.parent.jQuery : window.jQuery,
   window.parent ? window.parent.document : window.document ));

    /*
        // Register tile align block action
        $.deco.registerAction('tile-align-block', {
            exec: function () {

                // Remove left and right align classes
                $(".deco-selected-tile", $.deco.document)
                    .removeClass("deco-tile-align-right deco-tile-align-left");
            },
            shortcut: {
                ctrl: true,
                alt: false,
                shift: true,
                key: 'b'
            }
        });

        // Register tile align left action
        $.deco.registerAction('tile-align-left', {
            exec: function () {

                // Remove right align class, add left align class
                $(".deco-selected-tile", $.deco.document)
                    .removeClass("deco-tile-align-right")
                    .addClass("deco-tile-align-left");
            },
            shortcut: {
                ctrl: true,
                alt: false,
                shift: true,
                key: 'l'
            }
        });

        // Register tile align right action
        $.deco.registerAction('tile-align-right', {
            exec: function () {

                // Remove left align class, add right align class
                $(".deco-selected-tile", $.deco.document)
                    .removeClass("deco-tile-align-left")
                    .addClass("deco-tile-align-right");
            },
            shortcut: {
                ctrl: true,
                alt: false,
                shift: true,
                key: 'r'
            }
        });

        // Register save action
        $.deco.registerAction('save', {
            exec: function () {
                $($.deco.document)
                    .find("#form-widgets-ILayoutAware-content")
                    .attr("value", $.deco.getPageContent());

                // Remove KSS onunload protection
                window.parent.onbeforeunload = null;
                $($.deco.document).find("#form-buttons-save").click();
            },
            shortcut: {
                ctrl: true,
                alt: false,
                shift: false,
                key: 's'
            }
        });

        // Register cancel action
        $.deco.registerAction('cancel', {
            exec: function () {

                // Cancel form
                $($.deco.document).find("#form-buttons-cancel").click();
            }
        });

        // Register undo action
        $.deco.registerAction('undo', {
            exec: function () {
                $.deco.undo.undo();
            }
        });

        // Register redo action
        $.deco.registerAction('redo', {
            exec: function () {
                $.deco.undo.redo();
            }
        });

        // Register page properties action
        $.deco.registerAction('page-properties', {
            exec: function () {
                $.deco.overlay.open('all');
            }
        });

         // Register add tile action
        $.deco.registerAction('add-tile', {
            exec: function () {

                // Open overlay
                $.deco.overlay.openIframe($.deco.options.parent +
                    '@@add-tile?form.button.Create=Create');
            }
        });

        // Register format action
        $.deco.registerAction('format', {
            exec: function (source) {

                // Execute the action
                $(source).find("[value=" + $(source).val() + "]")
                    .decoExecAction();

                // Reset menu
                $(source).val("none");
            }
        });

        // Register page-insert action
        $.deco.registerAction('insert', {
            exec: function (source) {

                // Local variables
                var tile_config, tile_group, x, y;

                // Check if value selected
                if ($(source).val() === "none") {
                    return false;
                }

                // Deselect tiles
                $(".deco-selected-tile", $.deco.document)
                    .removeClass("deco-selected-tile")
                    .children(".deco-tile-content").blur();

                // Set actions
                $.deco.options.panels.trigger("selectedtilechange");

                // Get tile config
                for (x = 0; x < $.deco.options.tiles.length; x += 1) {
                    tile_group = $.deco.options.tiles[x];
                    for (y = 0; y < tile_group.tiles.length; y += 1) {
                        if (tile_group.tiles[y].name === $(source).val()) {
                            tile_config = tile_group.tiles[y];
                        }
                    }
                }

                if (tile_config.tile_type === 'app') {

                    // Open overlay
                    $.deco.overlay.openIframe($.deco.options.parent +
                        '@@add-tile?type=' + $(source).val() +
                        '&form.button.Create=Create');

                } else {

                    // Add tile
                    $.deco.addTile($(source).val(),
                        $.deco.getDefaultValue(tile_config));
                }

                // Reset menu
                $(source).val("none");

                // Normal exit
                return true;
            }
        });

        // Handle keypress event, check for shortcuts
        $(document).keypress(function (e) {

            // Action name
            var action = "";

            // Loop through shortcuts
            $($.deco.actionManager.shortcuts).each(function () {

                // Check if shortcut matched
                if (((e.ctrlKey === this.ctrl) ||
                     (navigator.userAgent.toLowerCase()
                        .indexOf('macintosh') !== -1 &&
                        e.metaKey === this.ctrl)) &&
                    ((e.altKey === this.alt) || (e.altKey === undefined)) &&
                    (e.shiftKey === this.shift) &&
                    (e.charCode && String.fromCharCode(e.charCode)
                        .toUpperCase().charCodeAt(0) === this.charCode)) {

                    // Found action
                    action = this.action;
                }
            });

            // Check if shortcut found
            if (action !== "") {

                // Exec actions
                $.deco.actionManager.actions[action].exec();

                if ($.deco.actionManager.actions[action].undoable) {
                    $.deco.undo.snapshot();
                }

                // Prevent other actions
                return false;
            }

            // Normal exit
            return true;
        });
    };
    */
