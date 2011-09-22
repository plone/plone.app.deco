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

    // Create the deco namespace
    $.deco = {
        "loaded": false,
        "nrOfTiles": 0,
        "tileInitCount": 0
    };

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
        $.deco.undo.snapshot();
    };

    /**
     * Initialize the Deco UI
     *
     * @id jQuery.deco.init
     * @param {Object} options Options used to initialize the UI
     */
    $.deco.init = function (options) {
        options = $.extend({
            url: window.parent.document.location.href,
            type: '',
            ignore_context: false
        }, options);

        // Set document
        $.deco.document = window.parent.document;

        // Local variables
        var match;

        // Initialize modules
        $.deco.initActions();

        // Get the url of the page
        match = options.url.match(/^([\w#!:.?+=&%@!\-\/]+)\/edit$/);
        if (match) {
            options.url = match[1];
        }

        // Chop add
        match = options.url
            .match(/^([\w#:.?=%@!\-\/]+)\/\+\+add\+\+([\w#!:.?+=&%@!\-\/]+)$/);
        if (match) {
            options.url = match[1];
            options.type = match[2];
            options.ignore_context = true;
        }

        // Get the configuration from the backend
        $.ajax({
            type: "GET",
            url: options.url + "/@@deco-config" +
                (options.type === '' ? '' : "?type=" + options.type),
            success: function (configdata) {

                // Local variables
                var content;

                // Add global options
                $.deco.options = configdata;
                $.deco.options.url = options.url;
                $.deco.options.ignore_context = options.ignore_context;
                $.deco.options.tileheadelements = [];

                content = $('#form-widgets-ILayoutAware-content').val();

                // Check if no layout
                if (content === '') {

                    // Exit
                    return;
                }

                // Get dom tree
                content = $.deco.getDomTreeFromHtml(content);

                // Find panels
                content.find("link[rel=panel]").each(function () {

                    // Local variables
                    var target, rev;

                    target = $(this).attr("target");
                    rev = $(this).attr("rev");

                    $("#" + target, $.deco.document)
                        .addClass('deco-panel');
                    $("#" + target, $.deco.document)
                        .html(content.find("#" + rev).html());
                });

                // Init app tiles
                $.deco.nrOfTiles = content.find("link[rel=tile]").size();

                content.find("link[rel=tile]").each(function () {

                    // Local variables
                    var target, href, tile_content, tiletype, classes, url,
                        tile_config, x, tile_group, y, fieldhtml, lines, i;

                    target = $(this).attr("target");
                    href = $(this).attr("href");

                    // Get tile type
                    tile_content = $('#' + target, $.deco.document).parent();
                    tiletype = '';
                    classes = tile_content.parents('.deco-tile').attr('class')
                        .split(" ");
                    $(classes).each(function () {

                        // Local variables
                        var classname;

                        classname = this.match(/^deco-([\w.\-]+)-tile$/);
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

                    // Get tile config
                    for (x = 0; x < $.deco.options.tiles.length; x += 1) {
                        tile_group = $.deco.options.tiles[x];
                        for (y = 0; y < tile_group.tiles.length; y += 1) {

                            // Set settings value
                            if (tile_group.tiles[y].tile_type === 'field') {
                                switch (tile_group.tiles[y].widget) {
                                case "z3c.form.browser.text.TextWidget":
                                case "z3c.form.browser.text.TextFieldWidget":
                                case "z3c.form.browser.textarea.TextAreaWidget":
                                case "z3c.form.browser.textarea.TextAreaFieldWidget":
                                case "plone.app.z3cform.wysiwyg.widget.WysiwygWidget":
                                case "plone.app.z3cform.wysiwyg.widget.WysiwygFieldWidget":
                                    tile_group.tiles[y].settings = false;
                                    break;
                                default:
                                    tile_group.tiles[y].settings = true;
                                }
                            }
                            if (tile_group.tiles[y].name === tiletype) {
                                tile_config = tile_group.tiles[y];
                            }
                        }
                    }

                    // Check if a field tile
                    if (tile_config.tile_type === 'field') {

                        fieldhtml = '';

                        switch (tile_config.widget) {
                        case "z3c.form.browser.text.TextWidget":
                        case "z3c.form.browser.text.TextFieldWidget":
                            fieldhtml = '<div>' +
                                $("#" + tile_config.id)
                                      .find('input').attr('value') + '</div>';
                            break;
                        case "z3c.form.browser.textarea.TextAreaWidget":
                        case "z3c.form.browser.textarea.TextAreaFieldWidget":
                            lines = $("#" + tile_config.id)
                                        .find('textarea')
                                        .attr('value').split('\n');
                            for (i = 0; i < lines.length; i += 1) {
                                fieldhtml += '<div>' + lines[i] + '</div>';
                            }
                            break;
                        case "plone.app.z3cform.wysiwyg.widget.WysiwygWidget":
                        case "plone.app.z3cform.wysiwyg.widget.WysiwygFieldWidget":
                            fieldhtml = $("#" + tile_config.id)
                                            .find('textarea').attr('value');
                            break;
                        default:
                            fieldhtml = '<div class="discreet">Placeholder ' +
                                'for field:<br/><b>' + tile_config.label +
                                '</b></div>';
                            break;
                        }
                        tile_content.html(fieldhtml);

                    // Get data from app tile
                    } else {
                        url = href;
                        if (tile_config.name ===
                            'plone.app.standardtiles.title' ||
                            tile_config.name ===
                            'plone.app.standardtiles.description') {
                            url += '?ignore_context=' +
                                $.deco.options.ignore_context;
                        }
                        $.ajax({
                            type: "GET",
                            url: url,
                            success: function (value) {

                                // Get dom tree
                                value = $.deco.getDomTreeFromHtml(value);

                                // Add head tags
                                $.deco.addHeadTags(href, value);

                                tile_content
                                    .html('<p class="hiddenStructure ' +
                                        'tileUrl">' + href + '</p>' +
                                        value.find('.temp_body_tag').html());

                                $.deco.tileInitCount += 1;

                                if ($.deco.tileInitCount >= $.deco.nrOfTiles) {
                                    $.deco.initialized();
                                }
                            }
                        });
                    }
                });

                // Init overlay
//                $('#content.deco-original-content',
//                  $.deco.document).decoOverlay();

                // Add toolbar div below menu
                $("body").prepend($(document.createElement("div"))
                    .addClass("deco-toolbar")
                );

                // Add panel and toolbar to the options
                $.deco.options.panels = $(".deco-panel", $.deco.document);
                $.deco.options.toolbar = $(".deco-toolbar");

                // Add page url to the options
                $.deco.options.url = options.url;

                // Init toolbar
                $.deco.options.toolbar.decoToolbar();

                // Init panel
                $.deco.options.panels.decoLayout();

                // Add blur to the rest of the content
                $("*", $.deco.document).each(function () {

                    // Local variables
                    var obj;

                    obj = $(this);

                    // Check if block element
                    if (obj.css('display') === 'block') {

                        // Check if panel or toolbar
                        if (!obj.hasClass('deco-panel') &&
                            !obj.hasClass('deco-toolbar') &&
                            !obj.hasClass('deco-notifications') &&
                            obj.attr('id') !== 'plone-cmsui-menu') {

                            // Check if inside panel or toolbar
                            if (obj.parents('.deco-panel, .deco-toolbar')
                                .length === 0) {

                                // Check if parent of a panel or toolbar
                                if (obj.find('.deco-panel, .deco-toolbar')
                                    .length === 0) {

                                    // Check if parent has a child who is a
                                    // panel or a toolbar
                                    if (obj.parent()
                                        .find('.deco-panel, .deco-toolbar')
                                        .length !== 0) {

                                        // Add blur class
                                        obj.addClass('deco-blur');
                                    }
                                }
                            }
                        }
                    }
                });

                // Init upload
                // $.deco.initUpload();
                $.deco.undo.init();
            }
        });
    };

    /**
     * Get the dom tree of the specified content
     *
     * @id jQuery.deco.getDomTreeFromHtml
     * @param {String} content Html content
     * @return {Object} Dom tree of the html
     */
    $.deco.getDomTreeFromHtml = function (content) {

        // Remove doctype and replace html, head and body tag since the are
        // stripped when converting to jQuery object
        content = content.replace(/<!DOCTYPE[\w\s\- .\/\":]+>/, '');
        content = content.replace(/<html/, "<div class=\"temp_html_tag\"");
        content = content.replace(/<\/html/, "</div");
        content = content.replace(/<head/, "<div class=\"temp_head_tag\"");
        content = content.replace(/<\/head/, "</div");
        content = content.replace(/<body/, "<div class=\"temp_body_tag\"");
        content = content.replace(/<\/body/, "</div");
        return $($(content)[0]);
    };

    /**
     * Remove head tags based on tile url
     *
     * @id jQuery.deco.removeHeadTags
     * @param {String} url Url of the tile
     */
    $.deco.removeHeadTags = function (url) {

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

    /**
     * Add head tags based on tile url and dom
     *
     * @id jQuery.deco.addHeadTags
     * @param {String} url Url of the tile
     * @param {Object} dom Dom object of the tile
     */
    $.deco.addHeadTags = function (url, dom) {

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
