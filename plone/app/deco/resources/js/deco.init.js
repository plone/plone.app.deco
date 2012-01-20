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


(function ( window, $, document ) {
    "use strict";

    // # Namespace
    $.deco = $.deco || {};


    // # Deco initialization
    //
    // - get configuration options
    // - 
    $.deco.init = function () {

        $.drop({ mode: true });

        // create mask and place it over page, but below toolbar.
        // TODO: mask properties should be configurable via deco options
        $.mask.load({
            zIndex: 400,  // right below toolbar z-index
            opacity: 0.6,
            color: '#FFF',
            closeOnEsc: false,
            closeOnClick: false
        });

        // check if need to get configuration and editform
        if (($.deco.editform === undefined) || ($.deco.options === undefined)) {

            // TODO: this should be url without any query string or hash values
            // best here would be to use some js library like URL.js
            var url = document.location.href;

            // on add form we need to pass which content type we are adding so
            // we get appropriate configuration options
            //
            // TODO: not sure if this is needed since we use deco editor after
            // contet is created
            var content_type = '';
            var match = url.match(/^([\w#:.?=%@!\-\/]+)\/\+\+add\+\+([\w#!:.?+=&%@!\-\/]+)$/);
            if (match) { content_type = '?type=' + match[2]; }

            $.when(
                $.get(url + '/edit'),
                $.get(url + '/@@deco-config' + content_type)
            ).done(function(editform, options) {

                // we load edit form upfront to make deco editing more snappy
                $.deco.editform = $(editform[0]).filter('#form');

                // options
                $.deco.options = $.deco.options || {};
                $.extend($.deco.options, options[0]);

                // trigger event that deco is initialized
                $(document).trigger('decoInitialized');
            });

        } else {

            // deco was already initialized, trigger decoInitialized event
            $(document).trigger('decoInitialized');
        }

    };


    // # Triggering deco
    //
    // Initialize deco when edit button is pressed
    var toolbar_document = $('iframe#plone-toolbar').contents();
    $('#toolbar-button-edit', toolbar_document).click(function (e) {
        $.deco.init();
        return false;
    });

}( window.parent ? window.parent : window,
   window.parent ? window.parent.jQuery : window.jQuery,
   window.parent ? window.parent.document : window.document ));
