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
    $.plone.defaults = $.extend(true, {
        deco_toolbar_activated: {},
        deco_toolbar_deactivated: {},
        deco_panels_activated: {
            'background': '#FFFFFF',
            'min-height': '50px',
            'position': 'relative',
            'z-index': '450'
        },
        deco_panels_deactivated: {
            'background': 'transparent',
            'z-index': 'auto',
            'min-height': '0'
        }
    }, $.plone.defaults || {});
    // }}}

    // # Deco Toolbar {{{
    $.plone.DecoToolbar = function(t) { this.init(t); return this; };
    $.plone.DecoToolbar.prototype = {
        init: function(iframe) {
            var self = this;
            self.visible = false;
            self.el = iframe.el;
            self.iframe = iframe;
            self.iframe_toolbar = window.parent.$('iframe[name=' + window.name + ']').iframize('toolbar');

            // initialize panels
            self.panels = $('[data-panel]', window.parent.document);
            self.panels.each(function() { $(this).decoPanel(); });

            // initialize tiletypes
            self.tiletypes = $('[data-tiletype]', self.el);
            self.tiletypes.each(function() { $(this).decoTile(); });

            $(document).on('click', function(e) {
                if (self.visible === true) {
                    e.preventDefault();
                    e.stopPropagation();
                    //self.deactivate();
                }
            });
        },
        activate: function() {
            var self = this;
            self.visible = true;
            self.el.show();

            // activate panels
            self.panels.each(function(i, panel) {
                panel = $(panel).decoPanel();
                panel.el.css($.plone.defaults.deco_panels_activated);
            });

            // activate deco toolbar
            self.el.css($.plone.defaults.deco_toolbar_activated);

            // stretch iframe for additional toolbar height
            self.iframe.el_iframe.height(
                self.iframe_toolbar.el_iframe.height() +
                self.el.outerHeight(true));

            $.plone.mask.load();
        },
        deactivate: function() {
            var self = this;
            self.visible = false;
            self.el.hide();

            self.panels.each(function(i, panel) {
                panel = $(panel).decoPanel();
                panel.finalize();
                panel.el.css($.plone.defaults.deco_panels_deactivated);
            });

            // activate deco toolbar
            self.el.css($.plone.defaults.deco_toolbar_deactivated);

            // shrink iframe
            self.iframe.el_iframe(
                self.iframe_toolbar.el_iframe.height());

            $.plone.mask.close();
        }
    };
    // }}}

    // # jQuery integration {{{
    $.fn.ploneDecoToolbar = function() {
        var el = $(this),
            iframe = window.parent.$('iframe[name=' + window.name + ']').iframize('deco-toolbar'),
            deco_toolbar = iframe.el_iframe.data('deco-toolbar');

        if (deco_toolbar === undefined) {
            deco_toolbar = new $.plone.DecoToolbar(iframe);
            iframe.el_iframe.data('deco-toolbar', deco_toolbar);
        }

        return deco_toolbar;
    };
    // }}}

}(jQuery));
