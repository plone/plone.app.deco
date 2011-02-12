/**
 * This plugin is used to display a dialog
 *
 * @author Rob Gietema
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
 * @version 0.1
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

    // Define the dialog namespace
    $.deco.dialog = {
    };

    /**
     * Create a new instance of a deco dialog.
     *
     * @constructor
     * @id jQuery.fn.decoDialog
     * @return {Object} Returns a jQuery object of the matched elements.
     */
    $.fn.decoDialog = function () {

        // Loop through matched elements
        return this.each(function () {

            // Get current object
            var obj = $(this);

            // Init dialog
            obj
                .hide()
                .css({
                    'width': '900px',
                    'left': (($(window).width() - 900) / 2)
                })
                .addClass("deco-dialog");

            // Add lightbox
            $(document.body).prepend($(document.createElement("div"))
                .addClass("deco-dialog-blocker")
            );

            // Clear actions
            $(".formControls").children("input").hide();
            $(".formControls").append(
                $(document.createElement("input")).attr({
                    'type': 'button',
                    'value': 'Ok'
                })
                .addClass('button-field context')
                .click(function () {
                    $.deco.dialog.close();
                })
            );
        });
    };

    /**
     * Open the dialog
     *
     * @id jQuery.deco.dialog.open
     * @param {String} mode Mode of the dialog
     * @param {Object} tile_config Configuration of the tile
     */
    $.deco.dialog.open = function (mode, tile_config) {

        // Local variables
        var form, formtabs, tile_group, x, visible_tabs, offset_top,
            field_tile, field, fieldset;

        // Get form
        form = $(".deco-dialog").find("form");

        if (mode === 'all') {

            // Get form tabs
            formtabs = form.find(".formTabs");

            // Show form tabs
            form.find(".formTabs").removeClass('deco-hidden');

            // Show all fields
            form.find("fieldset").children().removeClass('deco-hidden');

            // Hide all fieldsets
            form.find('fieldset').addClass('hidden');

            // Deselect all tabs
            formtabs.find('a').removeClass('selected');

            // Remove first and last tab
            formtabs.children('.firstFormTab').removeClass('firstFormTab');
            formtabs.children('.lastFormTab').removeClass('lastFormTab');

            // Hide layout field
            form.find('#formfield-form-widgets-ILayoutAware-content')
                .addClass('deco-hidden');
            form.find('#formfield-form-widgets-ILayoutAware-layout')
                .addClass('deco-hidden');

            // Hide title and description
            form.find('#formfield-form-widgets-IDublinCore-title')
                .addClass('deco-hidden');
            form.find('#formfield-form-widgets-IDublinCore-description')
                .addClass('deco-hidden');

            // Hide field which are on the wysiwyg area
            for (x = 0; x < $.deco.options.tiles.length; x += 1) {
                if ($.deco.options.tiles[x].name === 'fields') {
                    tile_group = $.deco.options.tiles[x];
                }
            }
            for (x = 0; x < tile_group.tiles.length; x += 1) {
                field_tile = tile_group.tiles[x];
                if ($.deco.options.panels
                    .find(".deco-" + field_tile.name + "-tile").length !== 0) {
                    $(document.getElementById(field_tile.id))
                        .addClass('deco-hidden');
                }
            }

            // Hide tab if fieldset has no visible items
            form.find("fieldset").each(function () {
                if ($(this).children("div:not(.deco-hidden)").length === 0) {
                    $('a[href=#fieldsetlegend-' +
                        $(this).attr('id').split('-')[1] + ']')
                        .parent().addClass('deco-hidden');
                }
            });

            // Get visible tabs
            visible_tabs = formtabs.children(':not(.deco-hidden)');

            // Add first and last form tab
            visible_tabs.eq(0).addClass('firstFormTab');
            visible_tabs.eq(visible_tabs.length - 1).addClass('lastFormTab');

            // Select first tab
            visible_tabs.eq(0).children('a').addClass('selected');
            form.find('#fieldset-' +
                visible_tabs.eq(0).children('a').attr('href').split('-')[1])
                .removeClass('hidden');

        } else if (mode === 'field') {

            // Get fieldset and field
            field = $("#" + tile_config.id);
            fieldset = field.parents("fieldset");

            // Hide all fieldsets
            form.find('fieldset').hide();

            // Show current fieldset
            fieldset.show();

            // Hide all fields in current fieldset
            fieldset.children().addClass('deco-hidden');

            // Show current field
            field.removeClass('deco-hidden');

            // Hide form tabs
            form.find(".formTabs").addClass('deco-hidden');
        }
        $(".deco-dialog-blocker").show();
        offset_top = parseInt($(".deco-dialog").css('top'), 10);
        $(".deco-dialog")
            .css({'top': offset_top - 300})
            .show()
            .animate({'top': offset_top}, 300);
    };

    /**
     * Close the dialog
     *
     * @id jQuery.deco.dialog.close
     */
    $.deco.dialog.close = function () {
        $(".deco-dialog-blocker").hide();
        $(".deco-dialog").hide();
        $(".deco-iframe-dialog").remove();
    };

    /**
     * Open an iframe dialog
     *
     * @id jQuery.deco.dialog.openIframe
     * @param {String} url of the iframe
     */
    $.deco.dialog.openIframe = function (url) {

        $(".deco-dialog-blocker").show();
        
        $(document.body).append($(document.createElement("iframe"))
            .css({
                'position': 'absolute',
                'width': '900px',
                'height': '600px',
                'top': '0px',
                'z-index': '3000',
                'left': (($(window).width() - 900) / 2),
                'border': '0px'
            })
            .attr({
                'src': url
            })
            .addClass("deco-iframe-dialog")
        );
    };
}(jQuery));
