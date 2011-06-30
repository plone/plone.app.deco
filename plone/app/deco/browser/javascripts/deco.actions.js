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

    // Define deco namespace if it doesn't exist
    if (typeof($.deco) === "undefined") {
        $.deco = {};
    }

    // Global array containing actions and shortcuts
    $.deco.actionManager = {
        actions: [],                // Array with all the actions
        shortcuts: []               // Lookup array for shortcuts
    };

    /**
     * Register an action
     *
     * @id jQuery.deco.registerAction
     * @param {String} name Name of the action.
     * @param {Object} options Object containing all the options of the action
     */
    $.deco.registerAction = function (name, options) {

        // Extend default settings
        options = $.extend({

            // Handler for executing the action
            exec: function () {
            },

            // Shortcut can be any key + ctrl/shift/alt or a combination of
            // those
            shortcut: {
                ctrl: false,
                alt: false,
                shift: false,
                key: ""
            },

            // Method to see if the actions should be visible based on the
            // current tile state
            visible: function (tile) {
                return true;
            },

            // Should the action be undo-able?
            undoable: false

        }, options);

        // Add action to manager
        $.deco.actionManager.actions[name] = options;

        // Check if shortcut is defined
        if (options.shortcut.key !== "") {

            // Set keyCode and charCode
            options.shortcut.charCode = options.shortcut.key.toUpperCase()
                .charCodeAt(0);
            options.shortcut.action = name;

            // Set shortcut
            $.deco.actionManager.shortcuts.push(options.shortcut);
        }
    };

    /**
     * Execute an action
     *
     * @id jQuery.decoExecAction
     * @return {Object} Returns a jQuery object of the matched elements.
     */
    $.fn.decoExecAction = function () {

        // Loop through matched elements
        return this.each(function () {

            // Check if actions specified
            if ($(this).data("action") !== "") {

                var mgr = $.deco.actionManager;

                // Exec actions
                mgr.actions[$(this).data("action")].exec(this);
                if (mgr.actions[$(this).data("action")].undoable) {
                    $.deco.undo.snapshot();
                }
            }
        });
    };

    /**
     * Remove spans inserted by webkit
     *
     * @id jQuery.deco.fixWebkitSpan
     * @return {Object} jQuery object
     */
    $.deco.fixWebkitSpan = function () {
        var webkit_span = $(".Apple-style-span", $.deco.document);
        webkit_span.after(webkit_span.html());
        webkit_span.remove();
    };

    /**
     * Initialize the action manager
     *
     * @id jQuery.deco.initActions
     */
    $.deco.initActions = function () {

        // Register strong action
        $.deco.registerAction('strong', {
            exec: function () {
                $.deco.execCommand("Bold");
            },
            shortcut: {
                ctrl: true,
                alt: false,
                shift: false,
                key: 'b'
            }
        });

        // Register emphasis action
        $.deco.registerAction('em', {
            exec: function () {
                $.deco.execCommand("Italic");
            }
        });

        // Register unordered list action
        $.deco.registerAction('ul', {
            exec: function () {
                $.deco.execCommand("InsertUnorderedList");
            }
        });

        // Register ordered list action
        $.deco.registerAction('ol', {
            exec: function () {
                $.deco.execCommand("InsertOrderedList");
            }
        });

        // Register undo action
        $.deco.registerAction('undo', {
            exec: function () {
                $.deco.execCommand("Undo");
            }
        });

        // Register redo action
        $.deco.registerAction('redo', {
            exec: function () {
                $.deco.execCommand("Redo");
            }
        });

        // Register paragraph action
        $.deco.registerAction('paragraph', {
            exec: function () {
                $.deco.execCommand("FormatBlock", false, "p");
                $.deco.fixWebkitSpan();
            }
        });

        // Register heading action
        $.deco.registerAction('heading', {
            exec: function () {
                $.deco.execCommand("FormatBlock", false, "h2");
                $.deco.fixWebkitSpan();
            }
        });

        // Register subheading action
        $.deco.registerAction('subheading', {
            exec: function () {
                $.deco.execCommand("FormatBlock", false, "h3");
                $.deco.fixWebkitSpan();
            }
        });

        // Register discreet action
        $.deco.registerAction('discreet', {
            exec: function () {
                $.deco.execCommand("FormatBlock", false, "p");
                $.deco.execCommand("mceSetCSSClass", false, "discreet");
                $.deco.fixWebkitSpan();
            }
        });

        // Register literal action
        $.deco.registerAction('literal', {
            exec: function () {
                $.deco.execCommand("FormatBlock", false, "pre");
                $.deco.fixWebkitSpan();
            }
        });

        // Register quote action
        $.deco.registerAction('quote', {
            exec: function () {
                $.deco.execCommand("FormatBlock", false, "div");
                $.deco.execCommand("mceSetCSSClass", false, "pullquote");
                $.deco.fixWebkitSpan();
            }
        });

        // Register callout action
        $.deco.registerAction('callout', {
            exec: function () {
                $.deco.execCommand("FormatBlock", false, "p");
                $.deco.execCommand("mceSetCSSClass", false, "callout");
                $.deco.fixWebkitSpan();
            }
        });

        // Register highlight action
        $.deco.registerAction('highlight', {
            exec: function () {
                $.deco.execCommand("mceSetCSSClass", false, "visualHighlight");
                $.deco.fixWebkitSpan();
            }
        });

        // Register sub action
        $.deco.registerAction('sub', {
            exec: function () {
                $.deco.execCommand("Subscript");
                $.deco.fixWebkitSpan();
            }
        });

        // Register sup action
        $.deco.registerAction('sup', {
            exec: function () {
                $.deco.execCommand("Superscript");
                $.deco.fixWebkitSpan();
            }
        });

        // Register remove format action
        $.deco.registerAction('remove-format', {
            exec: function () {
                $.deco.execCommand("RemoveFormat");
                $.deco.fixWebkitSpan();
            }
        });

        // Register pagebreak action
        $.deco.registerAction('pagebreak', {
            exec: function () {
                $.deco.execCommand("FormatBlock", false, "p");
                $.deco.execCommand("mceSetCSSClass", false, "pagebreak");
                $.deco.fixWebkitSpan();
            }
        });

        // Register justify left action
        $.deco.registerAction('justify-left', {
            exec: function () {
                $.deco.execCommand("mceSetCSSClass", false, "justify-left");
                $.deco.fixWebkitSpan();
            }
        });

        // Register justify center action
        $.deco.registerAction('justify-center', {
            exec: function () {
                $.deco.execCommand("mceSetCSSClass", false, "justify-center");
                $.deco.fixWebkitSpan();
            }
        });

        // Register justify right action
        $.deco.registerAction('justify-right', {
            exec: function () {
                $.deco.execCommand("mceSetCSSClass", false, "justify-right");
                $.deco.fixWebkitSpan();
            }
        });

        // Register justify full action
        $.deco.registerAction('justify-justify', {
            exec: function () {
                $.deco.execCommand("mceSetCSSClass", false, "justify-justify");
                $.deco.fixWebkitSpan();
            }
        });

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
                $("#form-widgets-ILayoutAware-content",
                  $.deco.document)
                      .attr("value", $.deco.getPageContent());

                // Remove KSS onunload protection
                window.parent.onbeforeunload = null;
                $("#form-buttons-save", $.deco.document).click();
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
                $("#form-buttons-cancel", $.deco.document).click();
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
}(jQuery));
