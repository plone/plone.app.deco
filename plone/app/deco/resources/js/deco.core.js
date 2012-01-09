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

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  regexp:true, undef:true, strict:true, trailing:true, browser:true */
/*global $:false, jQuery:false */


(function ($) {
    "use strict";

    // # Namespace
    $.deco = $.deco || {};

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


    // TODO
    // garbas: above is code which i didn't look yet
    // needs to be commented and removed if needed


    // # Deco initialization
    //
    // - get configuration options
    // - 
    $.deco.init = function () {

        // tile
        function initTile(tile) {
            tile.html($.deco.tiles_instances[tile.attr('data-tile')]);
        }

        // panel
        function initPanel(panel) {

            var panel_id = panel.attr("data-panel");

            // we only process panels that are shown on page
            if ($.deco.panels[panel_id] === undefined) {
                return true;  // continue
            }

            panel.find("[data-tile]").each(function () {
                initTile($(this));
            });

            $.deco.panels[panel_id].html(panel.html());
        }

        // layout
        function initLayout() {

            // collect panels from page we are visiting so that will enable
            // deco editor for them
            $.deco.panels = {};
            $('[data-panel]', window.parent.document).each(function(i, el) {

                // in case of Cancel button is pressed we need a quick way to
                // get to get into old state, thats why we store clone of the
                // original panel
                var panel_el = $(el);
                panel_el.data('original_panel', panel_el.clone());

                // add it to the list of panels
                $.deco.panels[panel_el.attr('data-panel')] = panel_el;

            });

            $.deco.layout = $.deco.getDomTreeFromHtml(
                    $.deco.editform_fields['form.widgets.ILayoutAware.content']);

            $.deco.layout.find("[data-panel]").each(function () {
                initPanel($(this));
            });

            $(document).trigger('decoInitialized');

            $.deco.document = window.parent.document;
            $.deco.layout.decoLayout();
        }


        // check if need to get configuration and editform
        if (($.deco.editform === undefined) || ($.deco.options === undefined)) {

            // TODO: this should be url without any query string or hash values
            // best here would be to use some js library like URL.js or even better
            // would be to set 
            var url = window.parent.document.location.href;

            // on add form we need to pass which content type we are adding so
            // we get appropriate configuration options
            var content_type = '';
            var match = url.match(/^([\w#:.?=%@!\-\/]+)\/\+\+add\+\+([\w#!:.?+=&%@!\-\/]+)$/);
            if (match) { content_type = '?type=' + match[2]; }

            $.when(
                $.get(url + '/edit'),
                $.get(url + '/@@deco-config' + content_type)
            ).done(function(editform, options) {

                // editform
                $.deco.editform = $('#form', $.deco.getDomTreeFromHtml(editform[0]));

                $.deco.editform_fields = {};
                $.each($.deco.editform.serializeArray(), function (i, item) {
                    $.deco.editform_fields[item.name] = item.value;
                });

                // options
                $.deco.options = options[0];

                // tiles_instances
                $.deco.tiles_instances = $.parseJSON(
                    window.parent.$('#deco-tiles-instances').val());

                initLayout();
            });

        } else {
            initLayout();
        }

    };


    // # Triggering deco
    //
    // Initialize deco when edit button is pressed
    $('#toolbar-button-edit').click(function (e) {
        $.deco.init();
        return false;
    });

}(jQuery));
