//
// This plugin is used to create and edit deco layout.
//
// @author Rob Gietema, Rok Garbas
// @version 1.0
// @licstart  The following is the entire license notice for the JavaScript
//            code in this page.
//
// Copyright (C) 2010 Plone Foundation
//
// This program is free software; you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation; either version 2 of the License.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
// more details.
//
// You should have received a copy of the GNU General Public License along with
// this program; if not, write to the Free Software Foundation, Inc., 51
// Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//
// @licend  The above is the entire license notice for the JavaScript code in
//          this page.
//

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  regexp:true, undef:true, strict:true, trailing:true, browser:true */
/*global $:false, jQuery:false, alert:false */

(function ( window, $, document ) {
    "use strict";

    // # Namespace {{{
    //
    // Ensure that deco namespace is there
    $.deco = $.deco || { version: '1.0' };
    // }}}

    // # Options {{{
    $.deco.options = $.extend(true, {
        panel_data_attr: 'data-panel'
    }, $.deco.options || {});
    // }}}

    // # Panels {{{
    //
    // get instances of panels from current document
    $.deco.panels = function(panels, options) {

        // merge options
        options = $.extend($.deco.options, options);

        // panel query 
        var panel_query = '',
            panel_data_attr = options.panel_data_attr;
        if (typeof(panels) === 'string') {
            panel_query = '[' + panel_data_attr + '="' + panels + '"]';
        } else if (panels === undefined) {
            panel_query = '[' + panel_data_attr + ']';
        } else if ($(panels).size() !== 0) {
            $(panels).each(function(i, panel) {
                if (panel_query !== '') { panel_query += ','; }
                panel_query += '[' + panel_data_attr + '="' + panel + '"]';
            });
        }

        // get panels and instantiate them
        panels = [];
        $('body').find(panel_query).each(function(i, el) {
            panels.push($(el).decoPanel(options));
        });

        // return array of panel instances
        return $(panels);
    };
    // }}}

}( window.parent ? window.parent : window,
   window.parent ? window.parent.jQuery : window.jQuery,
   window.parent ? window.parent.document : window.document ));
