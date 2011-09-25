/**
 * This plugin is used to display an overlay
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

    // Define the overlay namespace
    $.deco.overlay = {
    };

    /**
     * Create a new instance of a deco overlay.
     *
     * @constructor
     * @id jQuery.fn.decoOverlay
     * @return {Object} Returns a jQuery object of the matched elements.
     */
    $.fn.decoOverlay = function () {

        // Loop through matched elements
        return this.each(function () {

            // Get current object
            var obj = $(this);

            // Init overlay
            obj
                .hide()
                .css({
                    'width': '900px',
                    'left': (($(window.parent).width() - 900) / 2)
                })
                .addClass("deco-overlay");

            // Add lightbox
            $(document.body, $.deco.document)
                .prepend($(document.createElement("div"))
                    .addClass("deco-overlay-blocker")
            );

            // Clear actions
            $(".formControls", $.deco.document).children("input").hide();
            $(".formControls", $.deco.document).append(
                $($.deco.document.createElement("input")).attr({
                    'type': 'button',
                    'value': 'Ok'
                })
                .addClass('button-field context')
                .click(function () {
                    $.deco.overlay.close();
                })
            );
        });
    };

    /**
     * Open the overlay
     *
     * @id jQuery.deco.overlay.open
     * @param {String} mode Mode of the overlay
     * @param {Object} tile_config Configuration of the tile
     */
    $.deco.overlay.open = function (mode, tile_config) {

        // Local variables
        var form, formtabs, tile_group, x, visible_tabs, offset_top,
            field_tile, field, fieldset;

        // Expand the overlay
        expandMenu();
        $('.overlay').show();

        // Get form
        form = $(".overlay").find("form");

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
                    $($.deco.document.getElementById(field_tile.id))
                        .addClass('deco-hidden');
                }
            }

            // Hide tab if fieldset has no visible items
            form.find("fieldset").each(function () {
                if ($(this).children("div:not(.deco-hidden)").length === 0) {
                    $('a[href=#fieldsetlegend-' +
                        $(this).attr('id').split('-')[1] + ']',
                      $.deco.document)
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
                visible_tabs.eq(0).children('a').attr('href').split('-')[1],
                $.deco.document)
                .removeClass('hidden');

        } else if (mode === 'field') {

            // Get fieldset and field
            field = $("#" + tile_config.id, $.deco.document);
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
        $(".deco-overlay-blocker", $.deco.document).show();
        offset_top = parseInt($(".deco-overlay",
                                $.deco.document).css('top'), 10);
        $(".deco-overlay", $.deco.document)
            .css({'top': offset_top - 300})
            .show()
            .animate({'top': offset_top}, 300);
    };

    /**
     * Close the overlay
     *
     * @id jQuery.deco.overlay.close
     */
    $.deco.overlay.close = function () {
        $(".deco-overlay-blocker", $.deco.document).hide();
        $(".deco-overlay", $.deco.document).hide();
        $(".deco-iframe-overlay", $.deco.document).remove();
    };

    /**
     * Open an iframe overlay
     *
     * @id jQuery.deco.overlay.openIframe
     * @param {String} url of the iframe
     */
    $.deco.overlay.openIframe = function (url) {

        $(".deco-overlay-blocker", $.deco.document).show();
        
        $($.deco.document.body).append(
            $($.deco.document.createElement("iframe"))
                .css({
                    'position': 'absolute',
                    'width': '900px',
                    'height': '450px',
                    'top': '130px',
                    'z-index': '3000',
                    'left': (($(window.parent).width() - 900) / 2),
                    'border': '0px'
                })
                .attr({
                    'src': url
                })
                .addClass("deco-iframe-overlay")
        );
    };
}(jQuery));
