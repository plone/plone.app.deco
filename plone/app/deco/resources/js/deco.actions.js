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
"use strict";

/*global jQuery: false, window: false */
/*jslint white: true, browser: true, onevar: true, undef: true, nomen: true,
eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true,
immed: true, strict: true, maxlen: 80, maxerr: 9999 */

(function ($) {

    // # Namespace
    $.deco = $.deco || {};

    // # Buttons
    $.deco.buttons = $.deco.buttons || [];
    $.each([
        {
            category: "deco-leftactions",
            id: "toolbar-button-deco-save",
            title: "Save",
            exec: function (item) {
                item.click(function (e) {
                    alert("for now we don't do anything");
                    return false;
                });
            }
        },
        {
            category: "deco-leftactions",
            id: "toolbar-button-deco-cancel",
            title: "Cancel",
            exec: function (item) {
                item.click(function (e) {

                    // hide custom deco toolbar
                    $('.toolbar').removeClass('toolbar-deco');

                    // bring original panels back
                    $('[data-panel]', window.parent.document).each(
                        function (i, el) {
                            $(el).replaceWith($(el).data('original_panel'));
                        }
                    );

                    // hide mask
                    window.parent.$.mask.close();

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

        var el = $('.toolbar-left'),
            toolbar = window.parent.$('iframe').toolbar(),
            buttons = toolbar.create_buttons($.deco.buttons);

        $.each(buttons.categories, function (category, items) {
            if ($('.toolbar-category-' + category, el).length === 0) {
                el.append(buttons.render_category(items, category));
            }
        });

        $('.toolbar').addClass('toolbar-deco');

        return buttons;

    });

}(jQuery));

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
