/**
 * This plugin is used to set an element to be editable.
 *
 * @author Rob Gietema
 * @version 0.1
 * @licstart  The following is the entire license notice for the JavaScript
 *            code in this page.
 *
 * Copyright (C) 2011 Plone Foundation
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

    var DOM = tinymce.DOM;

    window.parent.tinymce.create('tinymce.themes.PloneTheme', {
        init: function(ed, url) {
            var t = this,
                s = ed.settings;
            t.editor = ed;
        },

        renderUI: function(o) {
            return {
                deltaHeight: 0
            };
        },

        getInfo: function() {
            return {
                longname: 'Deco theme',
                author: 'Four Digits',
                authorurl: 'http://www.fourdigits.nl',
                version: tinymce.majorVersion + "." + tinymce.minorVersion
            }
        }
    });

    window.parent.tinymce.ThemeManager.add('deco', window.parent.tinymce.themes.PloneTheme);

    // Define deco namespace if it doesn't exist
    if (typeof($.deco) === "undefined") {
        $.deco = {};
    }

    // Define the editor namespace
    $.deco.editor = {
    };

    /**
    * Create a new instance of the deco editor.
    *
    * @constructor
    * @id jQuery.fn.decoEditor
    * @return {Object} Returns a new deco editor object.
    */
    $.fn.decoEditor = function () {
        var obj;

        // Get element
        obj = $(this);

        // Generate random id
        var random_id = 1 + Math.floor(100000 * Math.random());
        while ($("#deco-rich-text-init-" + random_id,
               $.deco.document).length > 0) {
            random_id = 1 + Math.floor(100000 * Math.random());
        }
        $(this).attr('id', 'deco-rich-text-init-' + random_id);

        // Init rich editor
        window.parent.tinyMCE.init({
            mode : "exact",
            elements : "deco-rich-text-init-" + random_id,
            content_editable : true,
            theme : "deco",
            language_load : false,
            formats : {
                strong : {inline : 'strong'},
                h1 : {block : 'h1', remove : 'all'}
            }
        });

        // Set editor class
        obj.addClass('deco-rich-text');
    }

    /**
     * Exec a command on the editor
     *
     * @id jQuery.deco.execCommand
     * @param {String} command Command to execute
     * @param {String} ui UI to use
     * @param {String} value Vale of the command
     */
    $.deco.execCommand = function (command, ui, value) {

        // Exec command
        $.deco.document.execCommand(command, ui, value);
    };

    /**
     * Apply formatting to the current selection
     *
     * @id jQuery.deco.applyFormat
     * @param {String} tag Tag which needs to be applied
     * @param {String} className Classname which needs to be applied can be
     *                           emtpy
     * @param {String} display Display of the format (either inline or block)
     */
    $.deco.applyFormat = function (tag, className, display) {
        var range = $.textSelect('getRange');
        if (display == 'block') {
            var elem = $('<h1>');
            var orig = range.startElement.parentNode;
            for (var i = 0; i < orig.attributes.length; i++) {
                var a = orig.attributes[i];
                elem.attr(a.name, a.value);
            }
            elem.html($(orig).html());
            $(orig).replaceWith(elem);
        }
    };

}(jQuery));

