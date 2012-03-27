//
// This script is used to create toolbar for deco, where all available tiles
// are listed. It depends on iframize.js and deco.js.
//
//
// @author Rob Gietema, Rok Garbas
// @version 0.1
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
/*global $:false, jQuery:false */


(function ($) {
    "use strict";

    // # Namespace {{{
    $.plone = $.plone || {};
    // }}}

    // # Base URL {{{
    //
    // TODO: below url represents content url and should be set somewhere
    // by plone. eg. $.plone.app.content_url
    // for now we have to do magic below to get clean url
    var base_url = document.location.href
            .split('#')[0].split('?')[0].replace(/\/$/, '');

    // on add form we need to pass which content type we are adding so
    // we get appropriate configuration options
    //
    // TODO: not sure if this is needed since we use deco editor after
    // content is created
    var content_type = '';
    var match = base_url.match(/^([\w#:.?=%@!\-\/]+)\/\+\+add\+\+([\w#!:.?+=&%@!\-\/]+)$/);
    if (match) {
        content_type = '?type=' + match[2];
    }
    // }}}

    // # Options {{{
    $.plone.globals = $.extend(true, {
        toolbar_iframe_id: 'plone-toolbar',
    }, $.plone.globals || {});

    $.plone.tmp = $.extend(true, {
        toolbar_deco_klass: 'toolbar-left-deco',
        toolbar_form_klass: 'plone-toolbar-form',
        panel_data_attr:    'data-panel',
        url_options:        base_url + '/@@deco-config' + content_type,
        url_form:           base_url + '/edit',
        url_form_filter:    '#visual-portal-wrapper',
        buttons_order:      [
                            'toolbar-button-deco-save',
                            'toolbar-button-deco-cancel',
                            'toolbar-button-deco-properties',
                            'toolbar-button-deco-add-tile'
                            ], 
        buttons:            {
            // ## Save button
            'toolbar-button-deco-save': {
                group: "leftactions",
                id: "toolbar-button-deco-save",
                title: "Save",
                exec: function(button) {
                    button.el.click(function (e) {
                        alert("TODO");
                        return false;
                    });
                }
            },
            // ## Cancel button
            'toolbar-button-deco-cancel': {
                group: "leftactions",
                id: "toolbar-button-deco-cancel",
                title: "Cancel",
                exec: function(button) {
                    var toolbar_deco = $("#plone-toolbar").ploneDecoToolbar();
                    button.el.click(function (e) {
                       toolbar_deco.deactivate();
                       return false;
                    });
                }
            },
            // ## Properties button
            'toolbar-button-deco-properties': {
                group: "leftactions",
                id: "toolbar-button-deco-properties",
                title: "Properties",
                exec: function(button) {
                    var toolbar_deco = $("#plone-toolbar").ploneDecoToolbar();
                    button.el.click(function (e) {
                       toolbar_deco.activate_form();
                       return false;
                    });
                }
            },
            // ## Add Tile ... button
            'toolbar-button-deco-add-tile': {
                group: 'rightactions',
                id: 'toolbar-button-deco-add-tile',
                title: '<span>Add tile...</span><span> &#9660;</span>',
                buttons: []
            }
        }
    }, $.plone.tmp || {});
    // }}}

    // # Deco Toolbar {{{
    $.plone.DecoToolbar = function(t) { this.init(t); return this; };
    $.plone.DecoToolbar.prototype = {
        init: function(iframe) {
            var self = this;
            self.el = iframe.el;
            self.iframe = iframe;

            // initialize panels
            $('[data-panel]', window.parent.document).each(function(i, panel) {
                $(panel).decoPanel();
            });

            // initialize buttons
            $('.nav > li > a', self.iframe.el).each(function() {
                $(this).decoNewTileButton({
                    url: $(this).attr('href'),
                    state_dragging: function() {
                        this.el.css({
                            opacity: '0.6',
                            background: 'Yellow',
                            width: '8em',
                            height: '4em'
                            });
                        },
                    state_preview: function() {
                        this.el.css({
                            width: '100%',
                            opacity: '0.6',
                            background: 'Yellow',
                            height: '4em'
                            });
                        },
                    state_dropped: function() {
                        this.el.css({
                            border: '1px solid red',
                            width: '100%',
                            opacity: '1',
                            background: 'Yellow',
                            height: '4em'
                            });
                        }
                    }, iframe);
            });
        },
        activate: function() {
            var self = this;

            // activate panels
            $('[data-panel]', window.parent.document).each(function(i, panel) {
                panel = $(panel).decoPanel();
                panel.activate();
                // expose each panel
                // TODO: expose option should be hardcoded
                panel.el_wrapper.css({
                    'background': '#FFFFFF',
                    'min-height': '50px',
                    'z-index': 410
                    });
            });

            // expose deco toolbar
            self.el.expose({
                closeOnClick: false,
                closeOnEsc: false,
                zIndex: '400',
                opacity: '0.6',
                color: '#333'
                });

            // stretch iframe
            self.iframe.stretch();
        },
        deactivate: function() {
            var self = this;

            self.el.html('');

            $('body', self.toolbar.document).removeClass('toolbar-deco');

            $('[' + self.options.panel_data_attr + ']').each(function(i, panel) {
                panel = $(panel).decoPanel();

                // close expose / hide mask
                $.mask.close();

                panel.el_wrapper.css({
                    'background': 'transparent',
                    'z-index': 'auto',
                    'min-height': '0'
                });

                // deactivate
                panel.deactivate();
            });
            //self.toolbar.shrink();
        }
    };
    // }}}

    // # jQuery integration {{{
    $.fn.ploneDecoToolbar = function() {
        var el = $(this),
            iframe = window.parent.$('#' + $.plone.globals.toolbar_iframe_id).iframize('deco-toolbar'),
            deco_toolbar = iframe.el.data('deco-toolbar');

        if (deco_toolbar === undefined) {
            deco_toolbar = new $.plone.DecoToolbar(iframe);
            iframe.el_iframe.data('deco-toolbar', deco_toolbar);
        }

        deco_toolbar.activate();

        return deco_toolbar;
    };
    // }}}

}(jQuery));
