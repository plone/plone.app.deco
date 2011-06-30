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

        // Set content editable
        obj.attr('contentEditable', true);

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

}(jQuery));

