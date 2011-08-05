/**
 * This plugin is used to create a deco toolbar.
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

    /**
     * Adds a control to the toolbar
     *
     * @id AddControl
     * @param {Object} parent Parent object to append control to
     * @param {Object} action Object of the action
     */
    function AddControl(parent, action) {

        // Check if button or menu
        if ((typeof (action.menu) !== undefined) && (action.menu)) {

            // Check if icon menu
            if (action.icon) {

                // Create menu
                parent.append($(document.createElement("label"))
                    .addClass("deco-icon-menu deco-icon-menu-" +
                              action.name.replace(/_/g, "-") + ' deco-icon')
                    .html(action.label)
                    .attr("title", action.label)
                    .append($(document.createElement("select"))
                        .addClass("deco-menu-" + action.name.replace(/_/g, "-"))
                        .data("action", action.action)
                        .change(function () {
                            $(this).decoExecAction();
                        })
                        .each(function () {

                            // Local variables
                            var z, elm, y;

                            for (z in action.items) {

                                // Check if child objects
                                if (action.items[z].items !== undefined) {
                                    $(this).append($(document.createElement("optgroup"))
                                        .addClass("deco-option-group deco-option-group-" + action.items[z].value.replace(/_/g, "-").replace(/\//g, "-"))
                                        .attr("label", action.items[z].label)
                                    );
                                    elm = $(this).find(".deco-option-group-" + action.items[z].value.replace(/_/g, "-").replace(/\//g, "-"));

                                    // Add child nodes
                                    for (y in action.items[z].items) {
                                        elm.append(
                                            $(document.createElement("option"))
                                                .attr('value', action.items[z].items[y].value)
                                                .addClass('deco-option deco-option-' + action.items[z].items[y].value.replace(/\//g, "-"))
                                                .html(action.items[z].items[y].label)
                                        );
                                    }

                                // Else no child objects
                                } else {
                                    $(this).append(
                                        $(document.createElement("option"))
                                            .attr('value', action.items[z].value)
                                            .addClass('deco-option deco-option-' + action.items[z].value.replace(/\//g, "-"))
                                            .html(action.items[z].label)
                                    );
                                }
                            }
                        })
                    )
                );

            // Else text menu
            } else {

                // Create menu
                parent.append($(document.createElement("select"))
                    .addClass("deco-menu deco-menu-" + action.name.replace(/_/g, "-"))
                    .data("action", action.action)
                    .change(function () {
                        $(this).decoExecAction();
                    })
                    .each(function () {

                        // Local variables
                        var z, elm, y;
                        for (z = 0; z < action.items.length; z += 1) {

                            // Check if child objects
                            if (action.items[z].items !== undefined) {
                                $(this).append($(document.createElement("optgroup"))
                                    .addClass("deco-option-group deco-option-group-" + action.items[z].value.replace(/_/g, "-").replace(/\//g, "-"))
                                    .attr("label", action.items[z].label)
                                );
                                elm = $(this).find(".deco-option-group-" + action.items[z].value.replace(/_/g, "-").replace(/\//g, "-"));

                                // Add child nodes
                                for (y in action.items[z].items) {
                                    elm.append(
                                        $(document.createElement("option"))
                                            .attr('value', action.items[z].items[y].value)
                                            .addClass('deco-option deco-option-' + action.items[z].items[y].value.replace(/\//g, "-"))
                                            .html(action.items[z].items[y].label)
                                    );
                                }

                            // Else no child objects
                            } else {
                                $(this).append(
                                    $(document.createElement("option"))
                                        .attr('value', action.items[z].value)
                                        .addClass('deco-option deco-option-' + action.items[z].value.replace(/\//g, "-"))
                                        .html(action.items[z].label)
                                );
                            }
                        }
                    })
                );
            }

        } else {
            // Create button
            parent.append($(document.createElement("button"))
                .addClass("deco-button deco-button-" + action.name.replace(/_/g, "-") + (action.icon ? ' deco-icon' : ''))
                .html(action.label)
                .attr("title", action.label)
                .attr("type", "button")
                .data("action", action.action)
                .mousedown(function () {
                    $(this).decoExecAction();
                })
            );
        }
    }

    /**
     * Create a new instance of a deco toolbar.
     *
     * @constructor
     * @id jQuery.fn.decoToolbar
     * @return {Object} Returns a jQuery object of the matched elements.
     */
    $.fn.decoToolbar = function () {

        // Loop through matched elements
        return this.each(function () {

            // Local variables
            var obj, content, actions, a, x, action_group, elm_action_group, y,
            elm_select_insert, tile, elm_select_format, action,
            RepositionToolbar, SelectedTileChange;

            // Get current object
            obj = $(this);

            // Empty object
            obj.html("");

            // Add deco toolbar class
            obj.append($(document.createElement("div"))
                .addClass("deco-inline-toolbar")
            );
            obj = obj.children(".deco-inline-toolbar");

            // Add content
            obj.append($(document.createElement("div"))
                .addClass("deco-toolbar-content")
            );
            content = obj.children(".deco-toolbar-content");

            // Add primary and secondary function div's
            actions = {};
            content.append($(document.createElement("div"))
                .addClass("deco-toolbar-primary-functions")
            );
            actions.primary_actions =
                content.children(".deco-toolbar-primary-functions");
            content.append($(document.createElement("div"))
                .addClass("deco-toolbar-secondary-functions")
            );
            actions.secondary_actions =
                content.children(".deco-toolbar-secondary-functions");

            // Loop through action groups
            for (a in actions) {

                // Add actions to toolbar
                for (x = 0; x < $.deco.options[a].length; x += 1) {

                    // If single action
                    if ($.deco.options[a][x].actions === undefined) {

                        // Add control
                        AddControl(actions[a], $.deco.options[a][x]);

                    // If fieldset
                    } else {
                        action_group = $.deco.options[a][x];
                        actions[a].append($(document.createElement("fieldset"))
                            .addClass("deco-button-group deco-button-group-" +
                                $.deco.options[a][x].name.replace(/_/g, "-"))
                        );
                        elm_action_group = actions[a]
                            .children(".deco-button-group-" +
                            $.deco.options[a][x].name.replace(/_/g, "-"));
                        for (y = 0; y < action_group.actions.length; y += 1) {

                            // Add control
                            AddControl(elm_action_group,
                                       action_group.actions[y]);
                        }
                    }
                }
            }

            // Add formats to toolbar
            if ($.deco.options.formats !== undefined) {
                for (x = 0; x < $.deco.options.formats.length; x += 1) {
                    action_group = $.deco.options.formats[x];
                    actions.primary_actions.append($(document.createElement("fieldset"))
                        .addClass("deco-button-group deco-button-group-" + action_group.name.replace(/_/g, "-"))
                    );
                    elm_action_group = actions.primary_actions.children(".deco-button-group-" + action_group.name.replace(/_/g, "-"));
                    for (y = 0; y < action_group.actions.length; y += 1) {
                        if (action_group.actions[y].favorite) {

                            // Add control
                            AddControl(elm_action_group, action_group.actions[y]);
                        }
                    }
                    if (elm_action_group.children().length === 0) {
                        elm_action_group.remove();
                    }
                }
            }

            // Add items to the insert menu
            if ($.deco.options.tiles !== undefined) {
                elm_select_insert = actions.secondary_actions.find(".deco-menu-insert");
                for (x = 0; x < $.deco.options.tiles.length; x += 1) {
                    action_group = $.deco.options.tiles[x];
                    elm_select_insert.append($(document.createElement("optgroup"))
                        .addClass("deco-option-group deco-option-group-" + action_group.name.replace(/_/g, "-"))
                        .attr("label", action_group.label)
                    );
                    elm_action_group = actions.secondary_actions.find(".deco-option-group-" + action_group.name.replace(/_/g, "-"));
                    for (y = 0; y < action_group.tiles.length; y += 1) {
                        tile = action_group.tiles[y];
                        elm_action_group.append($(document.createElement("option"))
                            .addClass("deco-option deco-option-" + tile.name.replace(/_/g, "-"))
                            .attr("value", tile.name)
                            .html(tile.label)
                        );
                    }
                    if (elm_action_group.children().length === 0) {
                        elm_action_group.remove();
                    }
                }
            }

            // Add items to the format menu
            if ($.deco.options.formats !== undefined) {
                elm_select_format = actions.secondary_actions.find(".deco-menu-format");
                for (x = 0; x < $.deco.options.formats.length; x += 1) {
                    action_group = $.deco.options.formats[x];
                    elm_select_format.append($(document.createElement("optgroup"))
                        .addClass("deco-option-group deco-option-group-" + action_group.name.replace(/_/g, "-"))
                        .attr("label", action_group.label)
                    );
                    elm_action_group = actions.secondary_actions.find(".deco-option-group-" + action_group.name.replace(/_/g, "-"));
                    for (y = 0; y <  action_group.actions.length; y += 1) {
                        action = action_group.actions[y];
                        if (action.favorite === false) {
                            elm_action_group.append($(document.createElement("option"))
                                .addClass("deco-option deco-option-" + action.name.replace(/_/g, "-"))
                                .attr("value", action.name)
                                .html(action.label)
                                .data("action", action.action)
                            );
                        }
                    }
                    if (elm_action_group.children().length === 0) {
                        elm_action_group.remove();
                    }
                }
            }

            // Reposition toolbar on scroll
            RepositionToolbar = function () {

                // Local variables
                var left;

                if (parseInt($(window).scrollTop(), 10) >
                    parseInt(obj.parent().offset().top, 10)) {
                    if (obj.hasClass("deco-inline-toolbar")) {
                        left = obj.offset().left;

                        obj
                            .width(obj.width())
                            .css({
                                'left': left,
                                'margin-left': '0px'
                            })
                            .removeClass("deco-inline-toolbar")
                            .addClass("deco-external-toolbar")
                            .parent().height(obj.height());
                    }
                } else {
                    if (obj.hasClass("deco-external-toolbar")) {
                        obj
                            .css({
                                'width': '',
                                'left': '',
                                'margin-left': ''
                            })
                            .removeClass("deco-external-toolbar")
                            .addClass("deco-inline-toolbar")
                            .parent().css('height', '');
                    }
                }
            };

            // Bind method and add to array
            $(window).bind('scroll', RepositionToolbar);

            // Bind selected tile change event
            SelectedTileChange = function () {

                // Local variables
                var obj, tiletype, selected_tile, classes, actions, x,
                tile_group, y;

                // Disable edit html source
                $.deco.disableEditHtmlSource();

                // Get object
                obj = $(this);

                // Get selected tile and tiletype
                tiletype = "";
                selected_tile = $(".deco-selected-tile", $.deco.document);
                if (selected_tile.length > 0) {
                    classes = selected_tile.attr('class').split(" ");
                    $(classes).each(function () {
                        var classname = this.match(/^deco-(.*)-tile$/);
                        if (classname !== null) {
                            if ((classname[1] !== 'selected') &&
                                (classname[1] !== 'new') &&
                                (classname[1] !== 'read-only') &&
                                (classname[1] !== 'helper') &&
                                (classname[1] !== 'original')) {
                                tiletype = classname[1];
                            }
                        }
                    });
                }

                // Get actions
                actions = $.deco.options.default_available_actions;
                for (x = 0; x < $.deco.options.tiles.length; x += 1) {
                    tile_group = $.deco.options.tiles[x];
                    for (y = 0; y <  tile_group.tiles.length; y += 1) {
                        if (tile_group.tiles[y].name === tiletype) {
                            actions = actions
                                .concat(tile_group.tiles[y].available_actions);
                        }
                    }
                }

                // Show option groups
                obj.find(".deco-option-group").show();

                // Hide all actions
                obj.find(".deco-button").hide();
                obj.find(".deco-menu").hide();
                obj.find(".deco-icon-menu").hide();
                obj.find(".deco-menu-format").find(".deco-option")
                    .hide()
                    .attr("disabled", "disabled");
                $(obj.find(".deco-menu-format").find(".deco-option").get(0))
                    .show()
                    .attr("disabled", "");

                // Show actions
                $(actions).each(function () {
                    obj.find(".deco-button-" + this).show();
                    obj.find(".deco-icon-menu-" + this).show();
                    obj.find(".deco-menu-" + this).show();
                    obj.find(".deco-option-" + this)
                        .show()
                        .attr("disabled", "");
                });

                // Set available fields
                obj.find(".deco-menu-insert")
                    .children(".deco-option-group-fields")
                    .children().each(function () {
                    if ($.deco.options.panels
                        .find(".deco-" + $(this).attr("value") + "-tile")
                        .length === 0) {
                        $(this).show().attr("disabled", "");
                    } else {
                        $(this).hide().attr("disabled", "disabled");
                    }
                });

                // Hide option group if no visible items
                obj.find(".deco-option-group").each(function () {
                    if ($(this).children(":enabled").length === 0) {
                        $(this).hide();
                    }
                });

                // Hide menu if no enabled items
                $(".deco-menu, .deco-icon-menu",
                  $.deco.document).each(function () {
                    if ($(this).find(".deco-option:enabled").length === 1) {
                        $(this).hide();
                    }
                });
            };

            // Bind method and add to array
            $(this).bind("selectedtilechange", SelectedTileChange);

            // Set default actions
            $(this).trigger("selectedtilechange");
        });
    };
}(jQuery));
