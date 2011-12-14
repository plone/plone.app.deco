/**
 * This plugin is used to define the deco namespace
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

/*global tiledata: false, jQuery: false, window: false */
/*jslint white: true, browser: true, onevar: true, undef: true, nomen: true,
eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true,
immed: true, strict: true, maxlen: 80, maxerr: 9999 */

(function ($) {

    // # Namespace
    $.deco = $.deco || {};

    // TODO: docs needed what each variable does
    $.deco.loaded = false;


    /**
     * Called upon full initialization (that is: when all tiles have
     * been loaded).
     * @id jQuery.deco.initialized
     */
    $.deco.initialized = function () {
        if ($.deco.loaded) {
            return;
        }
        $.deco.loaded = true;

        // Take first snapshot
        //$.deco.undo.snapshot();
    };

    // # Initialize the Deco UI
    //
    // @id jQuery.deco.init
    // @param {Object} options Options used to initialize the UI
    $.deco.init = function (layout_el, options) {

        // merging options
        $.deco.options = $.extend({
            window: window.parent,
            document: window.parent.document,
            tileheadelements: []
        }, options);


        // ## Tiles - by name - and their configuration
        // TODO: tiles passed in options should be flat list
        $.deco.tiles = {};
        $.deco.tiles_categories = {};
        $.each($.deco.options.tiles, function(index, tile_category) {
            $.deco.tiles_categories[tile_category.name] = tile_category;
            $.each(tile_category.tiles, function(index, tile_options) {
                $.deco.tiles[tile_options.name] = tile_options;
            });
        });


        // ## Layout
        $.deco.layout = {
            raw_el: layout_el,
            el: $.deco.utils.getDomTreeFromHtml(layout_el.val())
        };

        // ### Layout name
        $.deco.layout.name = $.deco.layout.el.attr('data-layout');

        // ### Layout panels
        $.deco.layout.panels = {};
        $.deco.layout.el.find("[data-panel]").each(function () {

            var panel_id = $(this).attr("data-panel"),
                panel_el = $("[data-panel=" + panel_id + "]", $.deco.options.document),
                panel_content = $.deco.layout.el.find("[data-panel=" + panel_id + "]");

            if (panel_el.length === 0) {
                $.deco.layout.raw_el.hide();
                panel_el = $('<div class="deco-panel" data-panel="' + panel_id + '"></div>');
                panel_el.html(panel_content.html());
                $.deco.layout.raw_el.after(panel_el);
                // TODO: should this be initialized here?
                // Init overlay
                // if ($.deco.document == $.deco.formdocument) {
                //      $('#content.deco-original-content',
                //      $.deco.document).decoOverlay().addClass('overlay');
                //  }

            } else {
                panel_el.addClass('deco-panel');
                panel_el.html(panel.html());
            }

            $.deco.layout.panels[panel_id] = {
                el: panel_el,
                tiles: []
            };

            // Panel Tiles
            panel_el.find("[data-tile]").each(function () {

                // Tile name
                //
                // TODO: tile name should be passed as "data-tile-name"
                // attribute so we can avoid this magic.
                var tile_name = '';
                $($(this).parents('.deco-tile').attr('class').split(" ")).each(function (index, klass) {
                    var type_from_klass = klass.match(/^deco-([\w.\-]+)-tile$/);
                    if ((type_from_klass !== null) &&
                        (type_from_klass[1] !== 'selected') &&
                        (type_from_klass[1] !== 'new') &&
                        (type_from_klass[1] !== 'read-only') &&
                        (type_from_klass[1] !== 'helper') &&
                        (type_from_klass[1] !== 'original')) {
                        tile_name = type_from_klass[1];
                    }
                });

                // Tile configuration
                var tile = $.extend({
                    label: '',
                    value: '',
                    url: $(this).attr("data-tile")
                }, $.deco.tiles[tile_name]);

                // Tile value / content
                //
                // TODO: below solution is not really nice, since we will need
                // to change deco code for each new widget. also its impossible
                // to use deco outside plone because of this specific
                if ((tile.value === undefined) ||
                    tile.value === '') {

                    if (tile.tile_type === 'field') {

                        var tile_field = $("#" + tile.id, $.deco.document);

                        switch (tile.widget) {

                            case "z3c.form.browser.text.TextWidget":
                            case "z3c.form.browser.text.TextFieldWidget":
                                tile.value = tile_field.find('input').attr('value');
                                break;

                            case "z3c.form.browser.textarea.TextAreaWidget":
                            case "z3c.form.browser.textarea.TextAreaFieldWidget":
                                var lines = tile_field.find('textarea').attr('value').split('\n');
                                for (var i = 0; i < lines.length; i += 1) {
                                    tile.value += '<p>' + lines[i] + '<p>';
                                }
                                break;

                            case "plone.app.z3cform.wysiwyg.widget.WysiwygWidget":
                            case "plone.app.z3cform.wysiwyg.widget.WysiwygFieldWidget":
                                tile.value = tile_field.find('textarea').attr('value');
                                break;

                            default:
                                tile_field = '' +
                                    '<div class="discreet">' +
                                        'Placeholder for field:<br/>' +
                                        '<b>' + tile.label + '</b>' +
                                    '</div>';
                                break;
                        }

                        tile.value = '<div>' + tile.value + '</div>';

                    // Get data from app tile
                    } else {

                        var url = tile.url;
                        if ((tile.name === 'plone.app.deco.title') ||
                            (tile.name === 'plone.app.deco.description')) {
                            url += '?ignore_context=' + $.deco.options.ignore_context;
                        }

                        $.ajax({
                            type: "GET",
                            url: url,
                            success: function (value) {

                                // Get dom tree
                                var tile_domtree = $.deco.utils.getDomTreeFromHtml(value);

                                // Add head tags
                                $.deco.utils.addHeadTags(tile.url, tile_domtree);

                                // TODO: are we sure there is no better way to pass
                                // tileUrl?
                                tile.value = '' +
                                    '<p class="hiddenStructure tileUrl">' +
                                        tile.url +
                                    '</p>' +
                                     tile_domtree.find('.temp_body_tag').html();

                            }
                        });

                    }

                }

                // set value of tile
                $(this).html(tile.value);

                // add tile to panel list
                $.deco.layout.panels[panel_id].tiles.push(tile);

            });

        });


        // TODO: this should be part of deco.actions.js script
        //$.deco.loaded(function(e) {
        //
        //    // hide toolbar-left and show toolbar-deco
        //    $('.toolbar-left').hide();
        //    $('.toolbar-deco').show();

        //    // Add blur to the rest of the content using jQT expose
        //    // XXX: window.parent.$ !== $; this may need refactoring
        //    window.parent.$($.deco.options.panels).expose({
        //        closeOnEsc: false,
        //        closeOnClick: false
        //    });

        //});

        // TODO: at some point we have to call this this should trigger
        // 'decoLoaded' event then other scripts could register to this event
        // via $.deco.loaded
        $.deco.initialized();

        // Init panel
        // TODO: need to check what this does
        //$.deco.options.panels.decoLayout();
        //$.deco.undo.init();

    };



    // # Utils

    // ## Utils namespace
    $.deco.utils = $.deco.utils || {};


    // ## Get the dom tree of the specified content
    //
    // Remove doctype and replace html, head and body tag since the are
    // stripped when converting to jQuery object
    //
    // @id jQuery.deco.getDomTreeFromHtml
    // @param {String} content Html content
    // @return {Object} Dom tree of the html
    //
    $.deco.utils.getDomTreeFromHtml = function (content) {
        content = content.replace(/<!DOCTYPE[\w\s\- .\/\":]+>/, '');
        content = content.replace(/<html/, "<div class=\"temp_html_tag\"");
        content = content.replace(/<\/html/, "</div");
        content = content.replace(/<head/, "<div class=\"temp_head_tag\"");
        content = content.replace(/<\/head/, "</div");
        content = content.replace(/<body/, "<div class=\"temp_body_tag\"");
        content = content.replace(/<\/body/, "</div");
        return $($(content)[0]);
    };

    // ## Remove head tags based on tile url
    //
    // @id jQuery.deco.removeHeadTags
    // @param {String} url Url of the tile
    //
    $.deco.utils.removeHeadTags = function (url) {

        // Local variables
        var tile_type_id, html_id, headelements, i;

        // Calc delete url
        url = url.split('?')[0];
        url = url.split('@@');
        tile_type_id = url[1].split('/');
        url = url[0] + '@@delete-tile?type=' + tile_type_id[0] + '&id=' +
            tile_type_id[1] + '&confirm=true';
        html_id = tile_type_id[0].replace(/\./g, '-') + '-' + tile_type_id[1];

        // Remove head elements
        headelements = $.deco.options.tileheadelements[html_id];
        for (i = 0; i < headelements.length; i += 1) {
            $(headelements[i], $.deco.document).remove();
        }
        $.deco.options.tileheadelements[html_id] = [];

    };

    // ## Add head tags based on tile url and dom
    //
    // @id jQuery.deco.addHeadTags
    // @param {String} url Url of the tile
    // @param {Object} dom Dom object of the tile
    //
    $.deco.utils.addHeadTags = function (url, dom) {

        // Local variables
        var tile_type_id, html_id;

        // Calc url
        url = url.split('?')[0];
        url = url.split('@@');
        tile_type_id = url[1].split('/');
        html_id = tile_type_id[0].replace(/\./g, '-') + '-' + tile_type_id[1];
        $.deco.options.tileheadelements[html_id] = [];

        // Get head items
        dom.find(".temp_head_tag").children().each(function () {

            // Add element
            $.deco.options.tileheadelements[html_id].push(this);

            // Add head elements
            $('head', $.deco.document).append(this);
        });
    };

}(jQuery));


// Deco initialization
//
// XXX: this should be done outside this script
$(document).ready(function () {

    var layout = $('#form-widgets-ILayoutAware-content',
        window.parent.document);

    // Check if layout exists
    if (layout.length > 0) {

        // initialize deco
        $.deco.init(layout, window.parent.$.deco.options);

    }

});
