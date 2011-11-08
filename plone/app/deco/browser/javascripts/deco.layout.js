/**
 * This plugin is used to create a deco layout.
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

    // Define the layout namespace
    $.deco.layout = {
        widthClasses: ['deco-width-quarter', 'deco-width-third',
                       'deco-width-half', 'deco-width-two-thirds',
                       'deco-width-three-quarters', 'deco-width-full'],
        positionClasses: ['deco-position-leftmost', 'deco-position-quarter',
                          'deco-position-third', 'deco-position-half',
                          'deco-position-two-thirds',
                          'deco-position-three-quarters']
    };

    /**
    * Create a new instance of a deco layout.
    *
    * @constructor
    * @id jQuery.fn.decoLayout
    * @return {Object} Returns a new deco layout object.
    */
    $.fn.decoLayout = function () {

        // Keydown handler
        var DocumentKeydown = function (e) {

            // Check if esc
            if (e.keyCode === 27) {

                // Check if dragging
                var original_tile = $(".deco-original-tile", $.deco.document);
                if (original_tile.length > 0) {
                    original_tile.each(function () {
                        $(this).addClass("deco-drag-cancel");
                        if ($(this).hasClass("deco-helper-tile-new")) {
                            $(document).trigger("mousedown");
                        } else {
                            $(document).trigger("mouseup");
                        }
                    });

                // Deselect tile
                } else {

                    // Deselect tiles
                    $(".deco-selected-tile", $.deco.document)
                        .removeClass("deco-selected-tile")
                        .children(".deco-tile-content").blur();

                    // Set actions
                    $.deco.options.toolbar.trigger("selectedtilechange");
                    $.deco.options.panels.decoSetResizeHandleLocation();
                }

                // Find resize helper
                $(".deco-resize-handle-helper",
                  $.deco.document).each(function () {

                    // Remove resizing state
                    $(this).parents("[data-panel]")
                        .removeClass("deco-panel-resizing");
                    $(this).parent().removeClass("deco-row-resizing");
                    $(this).parent().children(".deco-resize-placeholder")
                        .remove();

                    // Remove helper
                    $(this).remove();
                });

                // Hide overlay
                $.deco.overlay.close();
            }
        };

        // Bind event and add to array
        $($.deco.document).bind('keydown', DocumentKeydown);

        // Add deselect
        var DocumentMousedown = function (e) {

            // Get element
            var elm;
            if (e.target) {
                elm = e.target;
            } else if (e.srcElement) {
                elm = e.srcElement;
            }

            // If clicked outside a tile
            if ($(elm).parents(".deco-tile").length === 0) {

                // Check if outside toolbar
                if ($(elm).parents(".deco-toolbar").length === 0) {

                    // Deselect tiles
                    $(".deco-selected-tile", $.deco.document)
                        .removeClass("deco-selected-tile")
                        .children(".deco-tile-content").blur();

                    // Set actions
                    $.deco.options.toolbar.trigger("selectedtilechange");
                    $.deco.options.panels.decoSetResizeHandleLocation();
                }
            }

            // Find resize helper
            var new_tile = $(".deco-helper-tile-new", $.deco.document);
            if (new_tile.length > 0) {
                new_tile.each(function () {

                    // Handle drag end
                    $(this).decoHandleDragEnd();
                });
            }
        };

        // Bind event and add to array
        $($.deco.document).bind('mousedown', DocumentMousedown);

        // Handle mouse move event
        var DocumentMousemove = function (e) {

            // Find resize helper
            $(".deco-helper-tile-new", $.deco.document).each(function () {

                // Get offset
                var offset = $(this).parent().offset();

                // Get mouse x
                $(this).css("top", e.pageY + 3 - offset.top);
                $(this).css("left", e.pageX + 3 - offset.left);
            });

            // Find resize helper
            $(".deco-resize-handle-helper", $.deco.document).each(function () {

                var cur_snap_offset;

                // Get helper
                var helper = $(this);

                // Get row
                var row = helper.parent();

                // Get mouse x
                var mouse_x = parseFloat(e.pageX - row.offset().left - 4);

                // Get mouse percentage
                var mouse_percentage = (mouse_x / helper.data("row_width")) * 100;

                // Get closest snap location
                var snap = 25;
                var snap_offset = 1000;
                $([25, 33, 50, 67, 75]).each(function () {
                    cur_snap_offset = Math.abs(this - mouse_percentage);
                    if (cur_snap_offset < snap_offset) {
                        snap = this;
                        snap_offset = cur_snap_offset;
                    }
                });

                // If 2 columns
                if (helper.data("nr_of_columns") === 2) {

                    // Check if resize
                    if (helper.data("column_sizes").split(" ")[0] !== snap) {

                        // Loop through columns
                        row.children(".deco-resize-placeholder").each(function (i) {

                            // First column
                            if (i === 0) {

                                // Set new width and position
                                $(this)
                                    .removeClass($.deco.layout.widthClasses.join(" "))
                                    .addClass(GetWidthClassByInt(parseInt(snap, 10)));

                            // Second column
                            } else {

                                // Set new width and position
                                $(this)
                                    .removeClass($.deco.layout.positionClasses.join(" ").replace(/position/g, "resize"))
                                    .removeClass($.deco.layout.widthClasses.join(" "))
                                    .addClass(GetWidthClassByInt(parseInt(100 - snap, 10)))
                                    .addClass(GetPositionClassByInt(parseInt(snap, 10)).replace("position", "resize"));

                                // Set helper
                                helper
                                    .removeClass($.deco.layout.positionClasses.join(" ").replace(/position/g, "resize"))
                                    .addClass(GetPositionClassByInt(parseInt(snap, 10)).replace("position", "resize"));
                            }
                        });

                        // Set new size
                        $(this).data("column_sizes", snap + " " + (100 - snap));
                    }

                // Else 3 columns
                } else {

                    // Get resize handle index
                    var resize_handle_index = $(this).data("resize_handle_index");

                    // Check if first resize handle
                    if (resize_handle_index === 1) {

                        // Check if resize
                        if ((helper.data("column_sizes").split(" ")[$(this).data("resize_handle_index") - 1] !== snap) && (parseInt(snap, 10) <= 50)) {

                            // Get columns
                            var columns = row.children(".deco-resize-placeholder");

                            // Remove position and width classes
                            columns
                                .removeClass($.deco.layout.positionClasses.join(" ").replace(/position/g, "resize"))
                                .removeClass($.deco.layout.widthClasses.join(" "));
                            helper
                                .removeClass($.deco.layout.positionClasses.join(" ").replace(/position/g, "resize"))
                                .addClass(GetPositionClassByInt(parseInt(snap, 10)).replace("position", "resize"));

                            // Get layout
                            switch (parseInt(snap, 10)) {
                            case 25:
                                $(columns.get(0)).addClass(GetPositionClassByInt(0).replace("position", "resize") + " " + GetWidthClassByInt(25));
                                $(columns.get(1)).addClass(GetPositionClassByInt(25).replace("position", "resize") + " " + GetWidthClassByInt(50));
                                $(columns.get(2)).addClass(GetPositionClassByInt(75).replace("position", "resize") + " " + GetWidthClassByInt(25));
                                helper.data("column_sizes", "25 50 25");
                                break;
                            case 33:
                                $(columns.get(0)).addClass(GetPositionClassByInt(0).replace("position", "resize") + " " + GetWidthClassByInt(33));
                                $(columns.get(1)).addClass(GetPositionClassByInt(33).replace("position", "resize") + " " + GetWidthClassByInt(33));
                                $(columns.get(2)).addClass(GetPositionClassByInt(66).replace("position", "resize") + " " + GetWidthClassByInt(33));
                                helper.data("column_sizes", "33 33 33");
                                break;
                            case 50:
                                $(columns.get(0)).addClass(GetPositionClassByInt(0).replace("position", "resize") + " " + GetWidthClassByInt(50));
                                $(columns.get(1)).addClass(GetPositionClassByInt(50).replace("position", "resize") + " " + GetWidthClassByInt(25));
                                $(columns.get(2)).addClass(GetPositionClassByInt(75).replace("position", "resize") + " " + GetWidthClassByInt(25));
                                helper.data("column_sizes", "50 25 25");
                                break;
                            }
                        }

                    // Else second resize handle
                    } else {

                        // Check if resize
                        if ((helper.data("column_sizes").split(" ")[$(this).data("resize_handle_index")] !== (100 - snap)) && (parseInt(snap, 10) >= 50)) {

                            // Get columns
                            var columns = row.children(".deco-resize-placeholder");

                            // Remove position and width classes
                            columns
                                .removeClass($.deco.layout.positionClasses.join(" ").replace(/position/g, "resize"))
                                .removeClass($.deco.layout.widthClasses.join(" "));
                            helper
                                .removeClass($.deco.layout.positionClasses.join(" ").replace(/position/g, "resize"))
                                .addClass(GetPositionClassByInt(parseInt(snap, 10)).replace("position", "resize"));

                            // Get layout
                            switch (parseInt(snap, 10)) {
                            case 50:
                                $(columns.get(0)).addClass(GetPositionClassByInt(0).replace("position", "resize") + " " + GetWidthClassByInt(25));
                                $(columns.get(1)).addClass(GetPositionClassByInt(25).replace("position", "resize") + " " + GetWidthClassByInt(25));
                                $(columns.get(2)).addClass(GetPositionClassByInt(50).replace("position", "resize") + " " + GetWidthClassByInt(50));
                                helper.data("column_sizes", "25 25 50");
                                break;
                            case 66:
                            case 67:
                                $(columns.get(0)).addClass(GetPositionClassByInt(0).replace("position", "resize") + " " + GetWidthClassByInt(33));
                                $(columns.get(1)).addClass(GetPositionClassByInt(33).replace("position", "resize") + " " + GetWidthClassByInt(33));
                                $(columns.get(2)).addClass(GetPositionClassByInt(66).replace("position", "resize") + " " + GetWidthClassByInt(33));
                                helper.data("column_sizes", "33 33 33");
                                break;
                            case 75:
                                $(columns.get(0)).addClass(GetPositionClassByInt(0).replace("position", "resize") + " " + GetWidthClassByInt(25));
                                $(columns.get(1)).addClass(GetPositionClassByInt(25).replace("position", "resize") + " " + GetWidthClassByInt(50));
                                $(columns.get(2)).addClass(GetPositionClassByInt(75).replace("position", "resize") + " " + GetWidthClassByInt(25));
                                helper.data("column_sizes", "25 50 25");
                                break;
                            }
                        }
                    }
                }
            });
        };

        // Bind event and add to array
        $($.deco.document).bind('mousemove', DocumentMousemove);
        $($.deco.document).bind('dragover', DocumentMousemove);

        // Handle mouse up event
        var DocumentMouseup = function (e) {

            // Find resize helper
            $(".deco-resize-handle-helper", $.deco.document).each(function () {

                // Get panel
                var panel = $(this).parents("[data-panel]");

                // Get column sizes
                var column_sizes = $(this).data("column_sizes").split(" ");

                // Set column sizes
                $(this).parent().children(".deco-grid-cell").each(function (i) {
                    var offset_x = 0;
                    for (var j = 0; j < i; j += 1) {
                        offset_x += parseInt(column_sizes[j], 10);
                    }
                    $(this)
                        .removeClass($.deco.layout.positionClasses.join(" "))
                        .removeClass($.deco.layout.widthClasses.join(" "))
                        .addClass(GetPositionClassByInt(offset_x) + " " + GetWidthClassByInt(parseInt(column_sizes[i], 10)));
                });

                // Remove resizing state
                panel.removeClass("deco-panel-resizing");
                $(this).parent().removeClass("deco-row-resizing");
                $(this).parent().children(".deco-resize-placeholder").remove();

                // Set resize handles
                $(this).parent().decoSetResizeHandles();
                panel.decoSetResizeHandleLocation();
                panel.find(".deco-selected-tile").decoFocusTileContent();

                // Remove helper
                $(this).remove();
            });
        };

        // Bind event and add to array
        $($.deco.document).bind('mouseup', DocumentMouseup);

        // Handle mousemove on tile
        var TileMousemove = function (e) {

            // Check if dragging
            if ($(this).parents("[data-panel]").hasClass("deco-panel-dragging")) {

                // Hide all dividers
                $(".deco-selected-divider", $.deco.document)
                    .removeClass("deco-selected-divider");

                // Don't show dividers if above original or floating tile
                if (($(this).hasClass("deco-original-tile") === false) &&
                    ($(this).hasClass("deco-tile-align-left") === false) &&
                    ($(this).hasClass("deco-tile-align-right") === false)) {

                    // Get direction
                    var dir = $(this).decoGetDirection(e);
                    var divider = $(this).children(".deco-divider-" + dir);

                    // Check if left or right divider
                    if ((dir === "left") || (dir === "right")) {
                        var row = divider.parent().parent().parent();

                        // If row has multiple columns
                        if (row.children(".deco-grid-cell").length > 1) {
                            divider.height(row.height() + 5);
                            divider.css('top', (row.offset().top - divider.parent().offset().top) - 5);
                        } else {
                            divider.height(divider.parent().height() + 5);
                            divider.css('top', -5);
                        }
                    }

                    // Show divider
                    divider.addClass("deco-selected-divider");
                }
            }
        };

        // Bind events
        $(".deco-tile", $.deco.document).live("mousemove", TileMousemove);
        $(".deco-tile", $.deco.document).live("dragover", TileMousemove);

        // On click select the current tile
        $(".deco-tile", $.deco.document).live("click", function () {

            // Select tile
            $(this).decoSelectTile();
        });

        $(".deco-close-icon", $.deco.document).live("click", function () {

            // Get tile config
            var tile_config = $(this).parents(".deco-tile").decoGetTileConfig();

            // Check if app tile
            if (tile_config.tile_type === 'app') {

                // Get url
                var tile_url = $(this).parents(".deco-tile").find('.tileUrl').html();

                // Remove tags
                $.deco.removeHeadTags(tile_url);

                // Calc delete url
                var url = tile_url.split('?')[0];
                url = url.split('@@');
                var tile_type_id = url[1].split('/');
                url = url[0] + '@@delete-tile?type=' + tile_type_id[0] + '&id=' + tile_type_id[1] + '&confirm=true';

                // Ajax call to remove tile
                $.ajax({
                    type: "GET",
                    url: url,
                    success: function (value) {

                        $.plone.notify({
                            title: "Info",
                            message: "Application tile removed",
                            sticky: false
                        });
                    }
                });
            }

            // Remove empty rows
            $.deco.options.panels.find(".deco-empty-row").remove();

            // Get original row
            var original_row = $(this).parents(".deco-tile").parent().parent();

            // Save tile value
            $.deco.saveTileValueToForm(tile_config.name, tile_config);

            // Remove current tile
            $(this).parent().remove();

            $.deco.undo.snapshot();

            // Cleanup original row
            original_row.decoCleanupRow();

            // Add empty rows
            $.deco.options.panels.decoAddEmptyRows();

            // Set toolbar
            $.deco.options.toolbar.trigger("selectedtilechange");
            $.deco.options.toolbar.decoSetResizeHandleLocation();
        });


        // On click open overlay
        $(".deco-info-icon", $.deco.document).live("click", function () {

            // Get tile config
            var tile_config = $(this).parents(".deco-tile").decoGetTileConfig();

            // Check if application tile
            if (tile_config.tile_type === 'app') {

                // Get url
                var tile_url = $(this).parents(".deco-tile").find('.tileUrl').html();
                if (tile_url.indexOf('?') != -1) {
                    var match = tile_url.split("?");
                    var start_url = match[0];
                    var parameters = match[1];
                    parameters = parameters.split("&");
                    for (var i = 0; i < parameters.length; i += 1) {
                        parameters[i] = '"' + parameters[i].replace('=', '":"') + '"';
                    }
                    tile_url = start_url + '?_tiledata={' + parameters.join(",") + '}';
                }
                tile_url = tile_url.replace(/@@/, '@@edit-tile/');

                // Open overlay
                $.deco.overlay.openIframe(tile_url);

            } else {

                // Edit field
                $.deco.overlay.open('field', tile_config);
            }
        });

        // Loop through matched elements
        var total = this.length;
        return this.each(function (i) {

            // Get current object
            var obj = $(this);

            // Add icons and dividers
            obj.find('.deco-tile').decoInitTile();
            obj.find('.deco-tile').decoAddDrag();
            obj.decoAddEmptyRows();
            obj.children('.deco-grid-row').decoSetResizeHandles();
            if (i === (total - 1)) {

                // Get biggest panel
                var width = 0;
                var index = 0;
                $.deco.options.panels.each(function (j) {
                    if ($(this).width() > width) {
                        width = $(this).width();
                        index = j;
                    }
                });

                // Select first tile in biggest panel
                $.deco.options.panels.eq(index).find('.deco-tile:first').decoSelectTile();
            }
        });
    };

    /**
     * Initialize the matched tiles
     *
     * @id jQuery.decoInitTile
     * @return {Object} jQuery object
     */
    $.fn.decoInitTile = function () {

        // Loop through matched elements
        return this.each(function () {

            // Get layout object
            var tile = $(this);
            var tile_config = $(this).decoGetTileConfig();

            // Check read only
            if (tile_config && tile_config.read_only) {

                // Set read only
                $(this).addClass("deco-read-only-tile");
            }

            // Init rich text
            if (tile_config &&
                ((tile_config.tile_type === 'text' && tile_config.rich_text) ||
                 (tile_config.tile_type === 'app' && tile_config.rich_text) ||
                 (tile_config.tile_type === 'field' && tile_config.read_only === false &&
                  (tile_config.widget === 'z3c.form.browser.text.TextWidget' ||
                   tile_config.widget === 'z3c.form.browser.text.TextFieldWidget' ||
                   tile_config.widget === 'z3c.form.browser.textarea.TextAreaWidget' ||
                   tile_config.widget === 'z3c.form.browser.textarea.TextAreaFieldWidget' ||
                   tile_config.widget === 'plone.app.z3cform.wysiwyg.widget.WysiwygWidget' ||
                   tile_config.widget === 'plone.app.z3cform.wysiwyg.widget.WysiwygFieldWidget')))) {

                // Init rich editor
                $(this).children('.deco-tile-content').decoEditor();
            }

            // Add border divs
            $(this).prepend(
                $($.deco.document.createElement("div"))
                    .addClass("deco-tile-outer-border")
                    .append(
                        $($.deco.document.createElement("div"))
                            .addClass("deco-tile-inner-border")
                    )
            );

            // If tile is field tile
            if (tile_config && tile_config.tile_type === "field") {

                // Add label
                $(this).prepend(
                    $($.deco.document.createElement("div"))
                        .addClass("deco-tile-control deco-field-label")
                        .append(
                            $($.deco.document.createElement("div"))
                                .addClass("deco-field-label-content")
                                .html(tile_config.label)
                        )
                        .append(
                            $($.deco.document.createElement("div"))
                                .addClass("deco-field-label-left")
                        )
                );
            }

            // If the tile is movable
            if ($(this).hasClass("movable") && $.deco.options.can_change_layout) {

                // Add drag handle
                $(this).prepend(
                    $($.deco.document.createElement("div"))
                        .addClass("deco-tile-control deco-drag-handle")
                );
            }

            // If tile is removable
            if ($(this).hasClass("removable") && $.deco.options.can_change_layout) {

                // Add close icon
                $(this).prepend('<div class="deco-tile-control deco-close-icon"></div>');
            }

            // Add settings icon
            if (tile_config && tile_config.settings) {
                $(this).prepend(
                    $($.deco.document.createElement("div"))
                        .addClass("deco-tile-control deco-info-icon")
                );
            }

            // Add dividers
            $(this).prepend(
                $($.deco.document.createElement("div"))
                    .addClass("deco-divider deco-divider-top")
                    .append(
                        $($.deco.document.createElement("div"))
                            .addClass("deco-divider-dot")
                    )
            );
            $(this).prepend(
                $($.deco.document.createElement("div"))
                    .addClass("deco-divider deco-divider-bottom")
                    .append(
                        $($.deco.document.createElement("div"))
                            .addClass("deco-divider-dot")
                    )
            );
            $(this).prepend(
                $($.deco.document.createElement("div"))
                    .addClass("deco-divider deco-divider-right")
                    .append(
                        $($.deco.document.createElement("div"))
                            .addClass("deco-divider-dot")
                    )
            );
            $(this).prepend(
                $($.deco.document.createElement("div"))
                    .addClass("deco-divider deco-divider-left")
                    .append(
                        $($.deco.document.createElement("div"))
                            .addClass("deco-divider-dot")
                    )
            );
        });
    };

    /**
     * Select the matched tile
     *
     * @id jQuery.decoSelectTile
     * @return {Object} jQuery object
     */
    $.fn.decoSelectTile = function () {

        // Loop through matched elements
        return this.each(function () {

            // Check if not already selected
            if ($(this).hasClass("deco-selected-tile") === false) {

                $(".deco-selected-tile", $.deco.document)
                    .removeClass("deco-selected-tile")
                    .children(".deco-tile-content").blur();
                $(this).addClass("deco-selected-tile");

                // Set actions
                $.deco.options.toolbar.trigger("selectedtilechange");
                $.deco.options.panels.decoSetResizeHandleLocation();

                // Focus the tile content field
                $(this).decoFocusTileContent();
            }
        });
    };

    /**
     * Focus the tile content
     *
     * @id jQuery.decoFocusTileContent
     * @return {Object} jQuery object
     */
    $.fn.decoFocusTileContent = function () {

        // Loop through matched elements
        return this.each(function () {

            // Get content
            var tile_content = $(this).children(".deco-tile-content");
            tile_content.focus();

/*
            // Check if rich text
            if (tile_content.hasClass('deco-rich-text')) {

                // Append selection div to end of last block element
                tile_content.children(":last").append($($.deco.document.createElement("span"))
                    .addClass("deco-tile-selection-end")
                    .html("&nbsp;")
                );

                // Select node and delete the selection
                $.deco.document.selection.select(tile_content.find(".deco-tile-selection-end").get(0));
                $.deco.execCommand("Delete");

                // Fallback remove selection
                $(".deco-tile-selection-end", $.deco.document).remove();
            }
*/
        });
    };

    /**
     * Add mouse move handler to empty rows
     *
     * @id jQuery.decoAddMouseMoveEmptyRow
     * @return {Object} jQuery object
     */
    $.fn.decoAddMouseMoveEmptyRow = function () {

        // Loop through matched elements
        return this.each(function () {

            // Mouse move event
            $(this).mousemove(function (e) {

                // Get layout object
                var obj = $(this).parents("[data-panel]");

                // Check if dragging
                if (obj.hasClass("deco-panel-dragging")) {

                    // Hide all dividers
                    $(".deco-selected-divider", $.deco.document)
                        .removeClass("deco-selected-divider");
                    $(this).children("div").addClass("deco-selected-divider");
                }
            });
        });
    };

    /**
     * Add empty rows
     *
     * @id jQuery.decoAddEmptyRows
     * @return {Object} jQuery object
     */
    $.fn.decoAddEmptyRows = function () {

        // Loop through matched elements
        return this.each(function () {

            // Loop through rows
            $(this).find(".deco-grid-row").each(function (i) {

                // Check if current row has multiple columns
                if ($(this).children(".deco-grid-cell").length > 1) {

                    // Check if first row
                    if (i === 0) {
                        $(this).before(
                            $($.deco.document.createElement("div"))
                                .addClass("deco-grid-row deco-empty-row")
                                .append($($.deco.document.createElement("div"))
                                    .addClass("deco-grid-cell deco-width-full deco-position-leftmost")
                                    .append($($.deco.document.createElement("div"))
                                        .append($($.deco.document.createElement("div"))
                                            .addClass("deco-tile-outer-border")
                                            .append(
                                                $($.deco.document.createElement("div"))
                                                    .addClass("deco-divider-dot")
                                            )
                                        )
                                    )
                                )
                                .decoAddMouseMoveEmptyRow()
                        );
                    }

                    // Check if last row or next row also contains columns
                    if (($(this).nextAll(".deco-grid-row").length === 0) || ($(this).next().children(".deco-grid-cell").length > 1)) {
                        $(this).after(
                            $($.deco.document.createElement("div"))
                                .addClass("deco-grid-row deco-empty-row")
                                .append($($.deco.document.createElement("div"))
                                    .addClass("deco-grid-cell deco-width-full deco-position-leftmost")
                                    .append($($.deco.document.createElement("div"))
                                        .append($($.deco.document.createElement("div"))
                                            .addClass("deco-tile-outer-border")
                                            .append(
                                                $($.deco.document.createElement("div"))
                                                    .addClass("deco-divider-dot")
                                            )
                                        )
                                    )
                                )
                                .decoAddMouseMoveEmptyRow()
                        );
                    }
                }
            });
        });
    };

    /**
     * Get the width class of the matched elements
     *
     * @id jQuery.decoGetWidthClass
     * @return {String} Name of the width class
     */
    $.fn.decoGetWidthClass = function () {

        var x;

        // Loop through width classes
        for (x in $.deco.layout.widthClasses) {

            if ($.deco.layout.widthClasses.hasOwnProperty(x)) {

                // If class found
                if ($(this).hasClass($.deco.layout.widthClasses[x])) {

                    // Return the width class
                    return $.deco.layout.widthClasses[x];
                }
            }
        }

        // Loop through width classes
        for (x in $.deco.layout.widthClasses) {

            if ($.deco.layout.widthClasses.hasOwnProperty(x)) {
                // If class found
                if ($(this).hasClass($.deco.layout.widthClasses[x].replace("position", "resize"))) {

                    // Return the width class
                    return $.deco.layout.widthClasses[x];
                }
            }
        }

        // Fallback
        return $.deco.layout.widthClasses[0];
    };

    /**
     * Get the position class of the matched elements
     *
     * @id jQuery.decoGetPositionClass
     * @return {String} Name of the position class
     */
    $.fn.decoGetPositionClass = function () {

        var x;

        // Loop through position classes
        for (x in $.deco.layout.positionClasses) {

            // If class found
            if ($(this).hasClass($.deco.layout.positionClasses[x])) {

                // Return the position class
                return $.deco.layout.positionClasses[x];
            }
        }

        // Loop through resize classes
        for (x in $.deco.layout.positionClasses) {

            // If class found
            if ($(this).hasClass($.deco.layout.positionClasses[x].replace("position", "resize"))) {

                // Return the position class
                return $.deco.layout.positionClasses[x];
            }
        }

        // Fallback
        return $.deco.layout.positionClasses[0];
    };

    /**
     * Add draggable to matched elements
     *
     * @id jQuery.decoAddDrag
     * @return {Object} jQuery object
     */
    $.fn.decoAddDrag = function () {

        // Loop through matched elements
        return this.each(function () {

            var tile = $(this);

            var DragMove = function (event) {
                var helper = $('.deco-helper-tile', $.deco.document);
                var offset = helper.parents("[data-panel]").offset();
                helper.css("top", event.pageY + 3 - offset.top);
                helper.css("left", event.pageX + 3 - offset.left);
            };
            var DragStop = function () {
                var helper = $('.deco-helper-tile', $.deco.document);
                $($.deco.document)
                    .unbind('mousemove', DragMove)
                    .unbind('mouseup', DragStop);

                // Handle drag end
                helper.decoHandleDragEnd();
                helper.remove();
            };
            return tile.each(function () {
                tile.find('div.deco-drag-handle')
                    .unbind('mousedown')
                    .bind('mousedown', function (event) {

                    var downX = event.pageX;
                    var downY = event.pageY;
                    var DragCheckMove = function (event) {
                        if (Math.max(
                            Math.abs(downX - event.pageX),
                            Math.abs(downY - event.pageY)
                        ) >= 1) {

                            // Add dragging class to content area
                            $.deco.options.panels.addClass("deco-panel-dragging");
                            $(".deco-selected-tile", $.deco.document)
                                .removeClass("deco-selected-tile")
                                .children(".deco-tile-content").blur();

                            var originaltile = $(event.target).parents(".deco-tile");

                            var clone = originaltile.clone(true);
                            originaltile.addClass("deco-original-tile");

                            originaltile.parents("[data-panel]").append(clone);
                            clone
                                .css({
                                    "width": originaltile.width(),
                                    "position": "absolute",
                                    "opacity": 0.5
                                })
                                .addClass("deco-helper-tile");
                            $($.deco.document).mousemove(DragMove);
                            $($.deco.document).mouseup(DragStop);
                            $($.deco.document).unbind('mousemove', DragCheckMove);
                        }
                    };
                    $($.deco.document).bind('mousemove', DragCheckMove);
                    $($.deco.document).bind('mouseup', function () {
                        $($.deco.document).unbind('mousemove', DragCheckMove);
                    });
                });
            });
        });
    };

    /**
     * Event handler for drag end
     *
     * @id jQuery.decoHandleDragEnd
     * @return {Object} jQuery object
     */
    $.fn.decoHandleDragEnd = function () {

        // Get layout object
        var obj = $(this).parents("[data-panel]");

        // Remove dragging class from content
        $.deco.options.panels.removeClass("deco-panel-dragging deco-panel-dragging-new");

        // Get direction
        var divider = $(".deco-selected-divider", $.deco.document);
        var drop = divider.parent();
        var dir = "";
        if (divider.hasClass("deco-divider-top")) {
            dir = "top";
        }
        if (divider.hasClass("deco-divider-bottom")) {
            dir = "bottom";
        }
        if (divider.hasClass("deco-divider-left")) {
            dir = "left";
        }
        if (divider.hasClass("deco-divider-right")) {
            dir = "right";
        }
        divider.removeClass("deco-selected-divider");

        // True if new tile is inserted
        var new_tile = $(".deco-helper-tile-new", $.deco.document).length > 0;
        var original_tile = $(".deco-original-tile", $.deco.document);

        // Check if esc is pressed
        if (original_tile.hasClass("deco-drag-cancel")) {

            // Remove cancel class
            original_tile.removeClass("deco-drag-cancel");

            // Remove remaining empty rows
            $.deco.options.panels.find(".deco-empty-row").remove();

            // Check if new tile
            if (!new_tile) {

                // Make sure the original tile doesn't get removed
                original_tile
                    .removeClass("deco-original-tile")
                    .addClass("deco-new-tile");
            }

        // Dropped on empty row
        } else if (drop.hasClass("deco-empty-row")) {

            // Replace empty with normal row class
            drop
                .removeClass("deco-empty-row")
                .unbind('mousemove');

            // Clean cell
            drop.children(".deco-grid-cell")
                .children("div").remove();

            // Add tile to empty row
            drop.children(".deco-grid-cell")
                .append(original_tile
                    .clone(true)
                    .removeClass("deco-original-tile deco-helper-tile deco-helper-tile-new deco-tile-align-right deco-tile-align-left")
                    .css({width: "", left: "", top: ""})
                    .decoAddDrag()
                    .addClass("deco-new-tile")
            );

            // Remove remaining empty rows
            $(".deco-empty-row", $.deco.document).remove();

        // Not dropped on tile
        } else if (drop.hasClass("deco-tile") === false) {

            // Remove remaining empty rows
            $(".deco-empty-row", $.deco.document).remove();

            // Check if new tile
            if (!new_tile) {

                // Make sure the original tile doesn't get removed
                original_tile
                    .removeClass("deco-original-tile")
                    .addClass("deco-new-tile");
            }

        // Check if max columns rows is reached
        } else if ((drop.parent().parent().children(".deco-grid-cell").length === 4) && (dir === "left" || dir === "right")) {

            // Remove remaining empty rows
            $(".deco-empty-row", $.deco.document).remove();

            // Check if new tile
            if (!new_tile) {

                // Make sure the original tile doesn't get removed
                original_tile
                    .removeClass("deco-original-tile")
                    .addClass("deco-new-tile");
            }

            // Notify user
            $.plone.notify({
                title: "Info",
                message: "You can't have more then 4 columns",
                sticky: false
            });

        // Dropped on row
        } else {

            // Remove empty rows
            $(".deco-empty-row", $.deco.document).remove();

            // If top
            if (dir === "top") {

                // Add tile before
                drop.before(
                    original_tile
                        .clone(true)
                        .removeClass("deco-original-tile deco-helper-tile deco-helper-tile-new deco-tile-align-right deco-tile-align-left")
                        .css({width: "", left: "", top: ""})
                        .decoAddDrag()
                        .addClass("deco-new-tile")
                );

            // If bottom
            } else if (dir === "bottom") {

                // Add tile after
                drop.after(
                    original_tile
                        .clone(true)
                        .removeClass("deco-original-tile deco-helper-tile deco-helper-tile-new deco-tile-align-right deco-tile-align-left")
                        .css({width: "", left: "", top: ""})
                        .decoAddDrag()
                        .addClass("deco-new-tile")
                );

            // If left
            } else if ((dir === "left") || (dir === "right")) {

                // Check if only 1 column in the row
                if (drop.parent().parent().children(".deco-grid-cell").length === 1) {

                    // Put tiles above dropped tile in a new row above
                    var prev_elms = drop.prevAll();
                    if (prev_elms.length > 0) {
                        drop.parent().parent()
                            .before($($.deco.document.createElement("div"))
                                .addClass("deco-grid-row")
                                .append($($.deco.document.createElement("div"))
                                    .addClass("deco-grid-cell deco-width-full deco-position-leftmost")
                                    .append($(prev_elms.get().reverse()).clone(true).decoAddDrag())
                                )
                            );
                        prev_elms.remove();
                    }

                    // Put tiles below dropped tile in a new row below
                    var next_elms = drop.nextAll();
                    if (next_elms.length > 0) {
                        drop.parent().parent()
                            .after($($.deco.document.createElement("div"))
                                .addClass("deco-grid-row")
                                .append($($.deco.document.createElement("div"))
                                    .addClass("deco-grid-cell deco-width-full deco-position-leftmost")
                                    .append(next_elms.clone(true).decoAddDrag())
                                )
                            );
                        next_elms.remove();
                    }

                    // Resize current column
                    drop.parent()
                        .removeClass($.deco.layout.widthClasses.join(" "))
                        .removeClass($.deco.layout.positionClasses.join(" "))
                        .addClass("deco-width-half");

                    // Create column with dragged tile in it
                    if (dir === "left") {
                        drop.parent()
                            .addClass("deco-position-half")
                            .before($($.deco.document.createElement("div"))
                                .addClass("deco-grid-cell deco-width-half deco-position-leftmost")
                                .append(
                                    original_tile
                                        .clone(true)
                                        .removeClass("deco-original-tile deco-helper-tile deco-helper-tile-new deco-tile-align-right deco-tile-align-left")
                                        .css({width: "", left: "", top: ""})
                                        .decoAddDrag()
                                        .addClass("deco-new-tile")
                                )
                        );
                    } else {
                        drop.parent()
                            .addClass("deco-position-leftmost")
                            .after($($.deco.document.createElement("div"))
                                .addClass("deco-grid-cell deco-width-half deco-position-half")
                                .append(
                                    original_tile
                                        .clone(true)
                                        .removeClass("deco-original-tile deco-helper-tile deco-helper-tile-new deco-tile-align-right deco-tile-align-left")
                                        .css({width: "", left: "", top: ""})
                                        .decoAddDrag()
                                        .addClass("deco-new-tile")
                                )
                        );
                    }

                    // Add resize handles
                    drop.parent().parent().decoSetResizeHandles();

                // Dropped inside column
                } else {

                    // Create new column
                    if (dir === "left") {
                        drop.parent()
                            .before($($.deco.document.createElement("div"))
                                .addClass("deco-grid-cell")
                                .append(
                                    original_tile
                                        .clone(true)
                                        .removeClass("deco-original-tile deco-helper-tile deco-helper-tile-new deco-tile-align-right deco-tile-align-left")
                                        .css({width: "", left: "", top: ""})
                                        .decoAddDrag()
                                        .addClass("deco-new-tile")
                                    )
                            );
                    } else {
                        drop.parent()
                            .after($($.deco.document.createElement("div"))
                                .addClass("deco-grid-cell")
                                .append(
                                    original_tile
                                        .clone(true)
                                        .removeClass("deco-original-tile deco-helper-tile deco-helper-tile-new deco-tile-align-right deco-tile-align-left")
                                        .css({width: "", left: "", top: ""})
                                        .decoAddDrag()
                                        .addClass("deco-new-tile")
                                    )
                            );
                    }

                    // Rezize columns
                    drop.parent().parent().decoSetColumnSizes();

                    // Add resize handles
                    drop.parent().parent().decoSetResizeHandles();
                }
            }
        }

        // Remove original tile
        var original_row = original_tile.parent().parent();
        $(".deco-original-tile", $.deco.document).remove();

        // Cleanup original row
        original_row.decoCleanupRow();

        // Add empty rows
        $.deco.options.panels.decoAddEmptyRows();

        // Select new tile
        if (new_tile) {
            $(".deco-new-tile", $.deco.document).removeClass("deco-new-tile").decoSelectTile();
        } else {
            $(".deco-new-tile", $.deco.document).removeClass("deco-new-tile");
        }
    };

    /**
     * Set the sizes of the column
     *
     * @id jQuery.decoSetColumnSizes
     * @return {Object} jQuery object
     */
    $.fn.decoSetColumnSizes = function () {

        // Loop through matched elements
        return this.each(function () {

            // Resize columns in the row
            var nr_of_columns = $(this).children(".deco-grid-cell").length;
            $(this)
                .children(".deco-grid-cell").each(function (i) {
                    $(this)
                        .removeClass($.deco.layout.widthClasses.join(" "))
                        .removeClass($.deco.layout.positionClasses.join(" "));

                    // Set width / position
                    switch (nr_of_columns) {

                    // 1 column
                    case 1:
                        $(this).addClass("deco-width-full deco-position-leftmost");
                        break;

                    // 2 columns
                    case 2:
                        switch (i) {
                        case 0:
                            $(this).addClass("deco-width-half deco-position-leftmost");
                            break;
                        case 1:
                            $(this).addClass("deco-width-half deco-position-half");
                            break;
                        }
                        break;

                    // 3 columns
                    case 3:
                        switch (i) {
                        case 0:
                            $(this).addClass("deco-width-third deco-position-leftmost");
                            break;
                        case 1:
                            $(this).addClass("deco-width-third deco-position-third");
                            break;
                        case 2:
                            $(this).addClass("deco-width-third deco-position-two-thirds");
                            break;
                        }
                        break;

                    // 4 columns
                    case 4:
                        switch (i) {
                        case 0:
                            $(this).addClass("deco-width-quarter deco-position-leftmost");
                            break;
                        case 1:
                            $(this).addClass("deco-width-quarter deco-position-quarter");
                            break;
                        case 2:
                            $(this).addClass("deco-width-quarter deco-position-half");
                            break;
                        case 3:
                            $(this).addClass("deco-width-quarter deco-position-three-quarters");
                            break;
                        }
                        break;
                    }
                });
        });
    };

    /**
     * Add new resize handlers
     *
     * @id jQuery.decoSetResizeHandles
     * @return {Object} jQuery object
     */
    $.fn.decoSetResizeHandles = function () {

        // Loop through matched elements
        return this.each(function () {

            // Remove resize handles
            $(this).children(".deco-resize-handle").remove();

            // Check number of columns
            var nr_of_columns = $(this).children(".deco-grid-cell").length;
            switch (nr_of_columns) {
            case 2:
                $(this).append($($.deco.document.createElement("div"))
                    .addClass("deco-resize-handle deco-resize-handle-center deco-resize-handle-one " + $($(this).children(".deco-grid-cell").get(1))
                        .decoGetPositionClass().replace("position", "resize")
                    )
                );
                break;
            case 3:
                $(this).append($($.deco.document.createElement("div"))
                    .addClass("deco-resize-handle deco-resize-handle-center deco-resize-handle-one " + $($(this).children(".deco-grid-cell").get(1))
                        .decoGetPositionClass().replace("position", "resize")
                    )
                );
                $(this).append($($.deco.document.createElement("div"))
                    .addClass("deco-resize-handle deco-resize-handle-center deco-resize-handle-two " + $($(this).children(".deco-grid-cell").get(2))
                        .decoGetPositionClass().replace("position", "resize")
                    )
                );
                break;
            }

            // Mouse down handler on resize handle
            $(this).children(".deco-resize-handle").mousedown(function (e) {

                // Get number of columns and current sizes
                var column_sizes = new Array();
                $(this).parent().children(".deco-grid-cell").each(function () {

                    // Add column size
                    switch ($(this).decoGetWidthClass()) {
                    case "deco-width-half":
                        column_sizes.push("50");
                        break;
                    case "deco-width-quarter":
                        column_sizes.push("25");
                        break;
                    case "deco-width-third":
                        column_sizes.push("33");
                        break;
                    case "deco-width-two-thirds":
                        column_sizes.push("66");
                        break;
                    case "deco-width-three-quarters":
                        column_sizes.push("75");
                        break;
                    }

                    // Add placeholder
                    $(this).parent().append($($.deco.document.createElement("div"))
                        .addClass("deco-resize-placeholder " + $(this).decoGetWidthClass() + " " + $(this).decoGetPositionClass().replace("position", "resize"))
                        .append($($.deco.document.createElement("div"))
                            .addClass("deco-resize-placeholder-inner-border")
                        )
                    );
                });

                // Get resize handle index
                var resize_handle_index = 1;
                if ($(this).hasClass("deco-resize-handle-two")) {
                    resize_handle_index = 2;
                }

                // Add helper
                $(this).parent().append($($.deco.document.createElement("div"))
                    .addClass("deco-resize-handle deco-resize-handle-helper")
                    .addClass($(this).decoGetPositionClass().replace("position", "resize"))
                    .data("row_width", $(this).parent().width())
                    .data("nr_of_columns", $(this).parent().children(".deco-grid-cell").length)
                    .data("column_sizes", column_sizes.join(" "))
                    .data("resize_handle_index", resize_handle_index)
                );

                // Set resizing state
                $(this).parents("[data-panel]").addClass("deco-panel-resizing");
                $(this).parent().addClass("deco-row-resizing");
                $(".deco-selected-tile", $.deco.document).children(".deco-tile-content").blur();

                // Prevent drag event
                return false;
            });
        });
    };

    /**
     * Cleanup row after tiles added or removed from the row
     *
     * @id jQuery.decoCleanupRow
     * @return {Object} jQuery object
     */
    $.fn.decoCleanupRow = function () {

        // Loop through matched elements
        return this.each(function () {

            // Get original row
            var original_row = $(this);

            // Remove empty columns
            original_row.children(".deco-grid-cell").each(function () {
                if ($(this).children().length === 0) {
                    $(this).remove();

                    // Resize columns
                    original_row.decoSetColumnSizes();
                }
            });

            // Remove row if no tiles inside
            if (original_row.find(".deco-tile").length === 0) {
                var del_row = original_row;

                // Check if next row available
                if (original_row.nextAll(".deco-grid-row").length > 0) {
                    original_row = original_row.next(".deco-grid-row");

                // Check if prev row available
                } else if (original_row.prevAll(".deco-grid-row").length > 0) {
                    original_row = original_row.prev(".deco-grid-row");

                // This is the last row
                } else {
                    original_row.remove();
                    return;
                }

                // Remove current row
                del_row.remove();
            }

            // Check if prev row exists and if both rows only have 1 column
            if ((original_row.prevAll(".deco-grid-row").length > 0) && (original_row.children(".deco-grid-cell").length === 1) && (original_row.prev().children(".deco-grid-cell").length === 1)) {

                // Merge rows
                original_row.children(".deco-grid-cell").prepend(
                    original_row.prev().children(".deco-grid-cell").children(".deco-tile")
                        .clone(true)
                        .decoAddDrag()
                );
                original_row.prev().remove();
            }

            // Check if next row exists and if both rows only have 1 column
            if ((original_row.nextAll(".deco-grid-row").length > 0) && (original_row.children(".deco-grid-cell").length === 1) && (original_row.next().children(".deco-grid-cell").length === 1)) {

                // Merge rows
                original_row.children(".deco-grid-cell").append(
                    original_row.next().children(".deco-grid-cell").children(".deco-tile")
                        .clone(true)
                        .decoAddDrag()
                );
                original_row.next().remove();
            }

            // Set resize handles
            original_row.decoSetResizeHandles();
        });
    };

    /**
     * Set the location of the resize handle (left, right or center)
     *
     * @id jQuery.decoSetResizeHandleLocation
     * @return {Object} jQuery object
     */
    $.fn.decoSetResizeHandleLocation = function () {

        // Get panel
        var obj = $(this);

        // Loop through rows
        obj.children(".deco-grid-row").each(function () {

            // Get row
            var row = $(this);

            // Get cells
            var cells = row.children(".deco-grid-cell");

            // Check if 2 or 3 columns
            if ((cells.length === 2) || (cells.length === 3)) {

                // Remove location classes
                row.children(".deco-resize-handle").removeClass("deco-resize-handle-left deco-resize-handle-center deco-resize-handle-right");

                // Check if first column is selected
                if ($(cells.get(0)).children(".deco-tile").hasClass("deco-selected-tile")) {

                    // Set location
                    row.children(".deco-resize-handle-one").addClass("deco-resize-handle-left");
                    row.children(".deco-resize-handle-two").addClass("deco-resize-handle-center");

                // Check if second columns is selected
                } else if ($(cells.get(1)).children(".deco-tile").hasClass("deco-selected-tile")) {

                    // Set location
                    row.children(".deco-resize-handle-one").addClass("deco-resize-handle-right");
                    row.children(".deco-resize-handle-two").addClass("deco-resize-handle-left");

                // Check if third column is selected
                } else if (cells.length === 3 && $(cells.get(2)).children(".deco-tile").hasClass("deco-selected-tile")) {

                    // Set location
                    row.children(".deco-resize-handle-one").addClass("deco-resize-handle-center");
                    row.children(".deco-resize-handle-two").addClass("deco-resize-handle-right");

                // No tile selected
                } else {

                    // Set location
                    row.children(".deco-resize-handle-one").addClass("deco-resize-handle-center");
                    row.children(".deco-resize-handle-two").addClass("deco-resize-handle-center");
                }
            }
        });
    };

    /**
     * Get the config of the tile
     *
     * @id jQuery.decoGetTileConfig
     * @return {Object} config of the tile
     */
    $.fn.decoGetTileConfig = function () {

        // Get tile type
        var tiletype = '';
        var classes = $(this).attr('class').split(" ");
        $(classes).each(function () {
            var classname = this.match(/^deco-(.*)-tile$/);
            if (classname !== null) {
                if ((classname[1] !== 'selected') && (classname[1] !== 'new') && (classname[1] !== 'read-only') && (classname[1] !== 'helper') && (classname[1] !== 'original')) {
                    tiletype = classname[1];
                }
            }
        });

        // Get tile config
        var tile_config;
        for (var x = 0; x < $.deco.options.tiles.length; x += 1) {
            var tile_group = $.deco.options.tiles[x];
            for (var y = 0; y < tile_group.tiles.length; y += 1) {
                if (tile_group.tiles[y].name === tiletype) {
                    tile_config = tile_group.tiles[y];
                }
            }
        }

        // Return config
        return tile_config;
    };

    /**
     * Get the direction based on the tile size and relative x and y coords of the cursor
     *
     * @id jQuery.decoGetDirection
     * @param {Object} e Event object
     * @return {String} Direction of the cursor relative to the tile
     */
    $.fn.decoGetDirection = function (e) {

        // Calculate x, y, width and height
        var width = parseFloat($(this).width());
        var height = parseFloat($(this).height());
        var x = parseFloat((e.pageX - $(this).offset().left) - (width / 2));
        var y = parseFloat((e.pageY - $(this).offset().top) - (height / 2));
        var halfwidth = width / 2;
        var halfheight = height / 2;

        // If left of center
        if (x < 0) {

            // If above center
            if (y < 0) {
                if ((x / y) < ((-1 * halfwidth) / (-1 * halfheight))) {
                    return "top";
                } else {
                    return "left";
                }
            // Below center
            } else {
                if ((x / y) < ((-1 * halfwidth) / (halfheight))) {
                    return "left";
                } else {
                    return "bottom";
                }
            }

        // Right of center
        } else {

            // If above center
            if (y < 0) {
                if ((x / y) < ((1 * halfwidth) / (-1 * halfheight))) {
                    return "right";
                } else {
                    return "top";
                }
            // Below center
            } else {
                if ((x / y) < ((halfwidth) / (halfheight))) {
                    return "bottom";
                } else {
                    return "right";
                }
            }
        }
    };

    /**
     * Disable edit html source
     *
     * @id jQuery.deco.disableEditHtmlSource
     */
    $.deco.disableEditHtmlSource = function () {

        // Find rich text textareas
        $(".deco-rich-text-textarea", $.deco.document).each(function () {

            // Local variables
            var tilecontent, text;

            // Get text and tilecontent
            text = $(this).val();
            tilecontent = $(this).parent();
            tilecontent
                .html(text)
                .decoEditor();
        });
    };


    /**
     * Add an apptile with the given value
     *
     * @id jQuery.deco.addAppTile
     * @param {String} type Type of the application tile
     * @param {String} url Url of the application tile
     * @param {String} id Id of the application tile
     */
    $.deco.addAppTile = function (type, url, id) {

        // Close overlay
        $.deco.overlay.close();

        // Focus on current window
        window.parent.focus();

        // Get value
        $.ajax({
            type: "GET",
            url: url,
            success: function (value) {

                // Get dom tree
                value = $.deco.getDomTreeFromHtml(value);

                // Add head tags
                $.deco.addHeadTags(url, value);

                // Add tile
                $.deco.addTile(type,
                    '<p class="hiddenStructure tileUrl">' + url + '</p>' + 
                        value.find('.temp_body_tag').html());
            }
        });
    };

    /**
     * Edit an apptile with the given value
     *
     * @id jQuery.deco.editAppTile
     * @param {String} type Type of the application tile
     * @param {String} url Url of the application tile
     * @param {String} id Id of the application tile
     */
    $.deco.editAppTile = function (url) {

        // Close overlay
        $.deco.overlay.close();

        // Focus on current window
        window.parent.focus();

        // Get new value
        $.ajax({
            type: "GET",
            url: url,
            success: function (value) {

                // Get dom tree
                value = $.deco.getDomTreeFromHtml(value);

                // Remove head tags
                $.deco.removeHeadTags(url);

                // Add head tags
                $.deco.addHeadTags(url, value);

                // Update tile
                $('.deco-selected-tile .deco-tile-content',
                  $.deco.document).html('<p class="hiddenStructure tileUrl">' + url + '</p>' + value.find('.temp_body_tag').html());
            }
        });
    };

    /**
     * Add a tile with the given value
     *
     * @id jQuery.deco.addTile
     * @param {String} type Type of the application tile
     * @param {String} value Value of the application tile
     */
    $.deco.addTile = function (type, value) {

        // Set dragging state
        $.deco.options.panels.addClass("deco-panel-dragging deco-panel-dragging-new");

        // Add helper
        $($.deco.options.panels.get(0)).append(
            $($.deco.document.createElement("div"))
                .addClass("deco-grid-row")
                .append($($.deco.document.createElement("div"))
                    .addClass("deco-grid-cell deco-width-half deco-position-leftmost")
                    .append($($.deco.document.createElement("div"))
                        .addClass("movable removable deco-tile deco-" + type + "-tile")
                        .append($($.deco.document.createElement("div"))
                            .addClass("deco-tile-content")
                            .html(value)
                        )
                        .addClass("deco-helper-tile deco-helper-tile-new deco-original-tile")
                    )
                )
        );

        // Set helper min size
        var helper = $.deco.options.panels.find(".deco-helper-tile-new");

        // Get max width
        var width = 0;
        $.deco.options.panels.each(function () {
            if ($(this).width() > width) {
                width = $(this).width();
            }
        });

        // Set width
        if (helper.width() < (width / 4)) {
            helper.width(width / 4);
        } else {
            helper.width(helper.width());
        }
        helper.decoInitTile();

        // Notify user
        $.plone.notify({
            title: "Inserting new tile",
            message: "Select the location for the new tile",
            sticky: false
        });
    };

    /**
     * Get the default value of the given tile
     *
     * @id jQuery.deco.getDefaultValue
     * @param {Object} tile_config Configuration options of the tile
     * @return {String} Default value of the given tile
     */
    $.deco.getDefaultValue = function (tile_config) {
        switch (tile_config.tile_type) {
        case "field":
            switch (tile_config.widget) {
            case "z3c.form.browser.text.TextWidget":
            case "z3c.form.browser.text.TextFieldWidget":
                return '<div>' + $("#" + tile_config.id, $.deco.document).find('input').attr('value') + '</div>';
                break;
            case "z3c.form.browser.textarea.TextAreaWidget":
            case "z3c.form.browser.textarea.TextAreaFieldWidget":
                var lines = $("#" + tile_config.id, $.deco.document).find('textarea').attr('value').split('\n');
                var return_string = "";
                for (var i = 0; i < lines.length; i += 1) {
                    return_string += '<div>' + lines[i] + '</div>';
                }
                return return_string;
                break;
            case "plone.app.z3cform.wysiwyg.widget.WysiwygWidget":
            case "plone.app.z3cform.wysiwyg.widget.WysiwygFieldWidget":
                return $("#" + tile_config.id, $.deco.document).find('textarea').attr('value');
                break;
            default:
                return '<div class="discreet">Placeholder for field:<br/><b>' + tile_config.label + '</b></div>';
                break;
            }
            break;
        default:
            return tile_config.default_value;
            break;
        }
    };

    /**
     * Save the tile value to the form
     *
     * @id jQuery.deco.saveTileValueToForm
     * @param {String} tiletype Type of the tile
     * @param {Object} tile_config Configuration options of the tile
     * @return {String} Default value of the given tile
     */
    $.deco.saveTileValueToForm = function (tiletype, tile_config) {

        // Update field values if type is rich text
        if (tile_config && tile_config.tile_type === 'field' &&
            tile_config.read_only === false &&
            (tile_config.widget === 'z3c.form.browser.text.TextWidget' ||
             tile_config.widget === 'z3c.form.browser.text.TextFieldWidget' ||
             tile_config.widget === 'z3c.form.browser.textarea.TextAreaWidget' ||
             tile_config.widget === 'z3c.form.browser.textarea.TextAreaFieldWidget' ||
             tile_config.widget === 'plone.app.z3cform.wysiwyg.widget.WysiwygWidget' ||
             tile_config.widget === 'plone.app.z3cform.wysiwyg.widget.WysiwygFieldWidget')) {
            switch (tile_config.widget) {
            case "z3c.form.browser.text.TextWidget":
            case "z3c.form.browser.text.TextFieldWidget":
                $("#" + tile_config.id, $.deco.formdocument).find('input').attr('value', $('.deco-' + tiletype + '-tile', $.deco.document).find('.deco-tile-content > *').html());
                break;
            case "z3c.form.browser.textarea.TextAreaWidget":
            case "z3c.form.browser.textarea.TextAreaFieldWidget":
                var value = "";
                $('.deco-' + tiletype + '-tile', $.deco.document).find('.deco-tile-content > *').each(function () {
                    value += $(this).html() + "\n";
                });
                value = value.replace(/<br[^>]*>/ig, "\n");
                $("#" + tile_config.id, $.deco.formdocument).find('textarea').attr('value', value);
                break;
            case "plone.app.z3cform.wysiwyg.widget.WysiwygWidget":
            case "plone.app.z3cform.wysiwyg.widget.WysiwygFieldWidget":
                $($.deco.formdocument.getElementById(tile_config.id)).find('textarea').attr('value', $('.deco-' + tiletype + '-tile', $.deco.document).find('.deco-tile-content').html());
                break;
            }
        }
    };

    /**
     * Get the content of the page which can be saved
     *
     * @id jQuery.deco.getPageContent
     * @return {String} Full content of the page
     */
    $.deco.getPageContent = function () {

        // Content
        var content,
            body = "",
            tilecount = 0,
            panel_id = "";

        // Disable edit html source
        $.deco.disableEditHtmlSource();

        // Add body tag
        body += "  <body>\n";

        // Loop through panels
        $("[data-panel]", $.deco.document).each(function () {

            // Add open panel tag
            panel_id = $(this).attr("data-panel");
            body += '    <div data-panel="' + panel_id + '">\n';

            // Loop through rows
            $(this).children(".deco-grid-row").each(function () {

                // Check if not an empty row
                if ($(this).hasClass("deco-empty-row") === false) {

                    // Add row open tag
                    body += '      <div class="deco-grid-row">\n';

                    // Loop through rows
                    $(this).children(".deco-grid-cell").each(function () {

                        // Add cell start tag
                        body += '        <div class="' +
                            $(this).attr("class") + '">\n';

                        // Loop through tiles
                        $(this).children(".deco-tile").each(function () {

                            // Get tile type
                            var tiletype = '',
                                classes = $(this).attr('class').split(" ");
                            $(classes).each(function () {
                                var classname = this.match(/^deco-(.*)-tile$/);
                                if (classname !== null) {
                                    if ((classname[1] !== 'selected') && (classname[1] !== 'new') && (classname[1] !== 'read-only') && (classname[1] !== 'helper') && (classname[1] !== 'original')) {
                                        tiletype = classname[1];
                                    }
                                }
                            });

                            // Get tile config
                            var tile_config;
                            for (var x = 0; x < $.deco.options.tiles.length; x += 1) {
                                var tile_group = $.deco.options.tiles[x];
                                for (var y = 0; y < tile_group.tiles.length; y += 1) {
                                    if (tile_group.tiles[y].name === tiletype) {
                                        tile_config = tile_group.tiles[y];
                                    }
                                }
                            }

                            // Predefine vars
                            var tile_url;

                            switch (tile_config.tile_type) {
                            case "text":
                                body += '          <div class="' + $(this).attr("class") + '">\n';
                                body += '          <div class="deco-tile-content">\n';
                                body += $(this).children(".deco-tile-content").html();
                                body += '          </div>\n';
                                body += '          </div>\n';
                                break;
                            case "app":
                                body += '          <div class="' + $(this).attr("class") + '">\n';
                                body += '          <div class="deco-tile-content">\n';

                                // Get url
                                tile_url = $(this).find('.tileUrl').html();
                                if (tile_url === null) {
                                    break;
                                }
                                body += '          <span data-tile="' + tile_url + '"></span>\n';
                                body += '          </div>\n';
                                body += '          </div>\n';

                                // Save title and description
                                if (tile_config.name === 'plone.app.standardtiles.title') {
                                    $('.deco-plone\\.app\\.standardtiles\\.title-tile .deco-tile-content .hiddenStructure', $.deco.document).remove();
                                    $("#formfield-form-widgets-IDublinCore-title", $.deco.formdocument).find('input').attr('value', $.trim($('.deco-plone\\.app\\.standardtiles\\.title-tile .deco-tile-content', $.deco.document).text()));
                                }
                                if (tile_config.name === 'plone.app.standardtiles.description') {
                                    $('.deco-plone\\.app\\.standardtiles\\.description-tile .deco-tile-content .hiddenStructure', $.deco.document).remove();
                                    $("#formfield-form-widgets-IDublinCore-description", $.deco.formdocument).find('textarea').attr('value', $.trim($('.deco-plone\\.app\\.standardtiles\\.description-tile .deco-tile-content', $.deco.document).text()));
                                }

                                break;
                            case "field":
                                body += '          <div class="' + $(this).attr("class") + '">\n';
                                body += '          <div class="deco-tile-content">\n';

                                // Calc url
                                tile_url = './@@plone.app.standardtiles.field?field=' + tiletype;

                                body += '          <span data-tile="' + tile_url + '"></span>\n';
                                body += '          </div>\n';
                                body += '          </div>\n';

                                // Update field values if type is rich text
                                $.deco.saveTileValueToForm(tiletype, tile_config);
                                break;
                            }
                        });

                        // Add cell end tag
                        body += '        </div>\n';
                    });

                    // Add row close tag
                    body += '      </div>\n';
                }
            });

            // Add close panel tag
            body += '    </div>\n';
        });

        // Add close tag
        body += "  </body>\n";

        content = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en" data-layout="' + $.deco.options.layout + '">\n';
        content += body;
        content += '</html>\n';
        return content;
    };

    /**
     * Get the name of the width class of the given integer
     *
     * @id GetWidthClassByInt
     * @param {Integer} column_width Percentage of the column width
     * @return {String} Classname of the width class of the given integer
     */
    function GetWidthClassByInt(column_width) {
        switch (column_width) {
        case 25:
            return "deco-width-quarter";
        case 33:
            return "deco-width-third";
        case 50:
            return "deco-width-half";
        case 66:
        case 67:
            return "deco-width-two-thirds";
        case 75:
            return "deco-width-three-quarters";
        case 100:
            return "deco-width-full";
        }

        // Fallback
        return "deco-width-full";
    }

    /**
     * Get the name of the position class of the given integer
     *
     * @id GetPositionClassByInt
     * @param {Integer} position Percentage of the column position
     * @return {String} Classname of the position class of the given integer
     */
    function GetPositionClassByInt(position) {
        switch (position) {
        case 0:
            return "deco-position-leftmost";
        case 25:
            return "deco-position-quarter";
        case 33:
            return "deco-position-third";
        case 50:
            return "deco-position-half";
        case 66:
        case 67:
            return "deco-position-two-thirds";
        case 75:
            return "deco-position-three-quarters";
        }

        // Fallback
        return "deco-position-leftmost";
    }

}(jQuery));
