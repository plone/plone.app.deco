//
// This plugin is used to initialize deco.
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


(function ( window, $, document ) {
    "use strict";

    // # Namespace {{{
    $.plone = $.plone || {};
    $.plone.deco = $.plone.deco || {};
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
    // contet is created
    var content_type = '';
    var match = base_url.match(/^([\w#:.?=%@!\-\/]+)\/\+\+add\+\+([\w#!:.?+=&%@!\-\/]+)$/);
    if (match) {
        content_type = '?type=' + match[2];
    }
    // }}}

    // # Options {{{
    $.plone.deco.options = $.extend(true, {
        toolbar_id:         '#plone-toolbar',
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
    }, $.plone.deco.options || {});
    // }}}

    // # Deco Toolbar {{{
    $.plone.deco.Toolbar = function(t) { this.init(t); return this; };
    $.plone.deco.Toolbar.prototype = {
        init: function(toolbar) {
            var self = this;
            self.buttons = [];
            self.toolbar = toolbar;
            self.options = $.plone.deco.options;
            self.el = $('<div/>')
                    .addClass(self.options.toolbar_deco_klass)
                    .insertAfter($('.toolbar-left', toolbar.document));
            self.el_form = $('<div/>')
                    .addClass(self.options.toolbar_form_klass)
                    .appendTo($('body', toolbar.document))
                    .hide();

            // load edit form and tiles options a
            $.when(
                $.get(self.options.url_form),
                $.get(self.options.url_options)
            ).done(function(_form, _options) {
                var options = $.extend(true, {}, _options[0]),
                    buttons = $.extend(true, {}, self.options.buttons,
                        options.buttons);

                // TODO: merge css/js with head toolbar frame
                self.el_form.append($('#form', $(_form[0])
                        .filter(self.options.url_form_filter)));

                // create ordered list of buttons
                $.each($.extend({}, self.options.buttons_order,
                        options.buttons_order), function(i, id) {
                    self.buttons.push(buttons[id]);
                });

                // initialize panels
                $('[' + self.options.panel_data_attr + ']').each(
                    function(i, panel) {
                        $(panel).decoPanel(
                            options.panels[$(this).attr(
                                self.options.panel_data_attr)]);
                    });

                // add tiles to the list
                $.each(options.tiles, function(i, tile) {
                    options.tiles[i].exec = function(button) {
                        button.el.decoTileButton({
                            url: tile.url,
                            content: 'Default text', //tile.default_content,
                            state_dragging: function() {
                                this.el.css({
                                    'min-width': '20em',
                                    'min-height': '5em',
                                    'background': '#00A0DA',
                                    '-webkit-border-radius': '5px',
                                    '-moz-border-radius': '5px',
                                    '-o-border-radius': '5px',
                                    'border-radius': '5px',
                                    'opacity': '0.4'
                                });
                            },
                            state_preview: function() { 
                                this.el.html('').css({
                                    'min-height': '3em',
                                    'border': '2px dotted #555555',
                                    '-webkit-border-radius': '5px',
                                    '-moz-border-radius': '5px',
                                    '-o-border-radius': '5px',
                                    'border-radius': '5px',
                                    'opacity': '0.4'
                                });
                            }
                        }, self.toolbar);
                    };
                });
                self.buttons[$.inArray('toolbar-button-deco-add-tile',
                    self.options.buttons_order)].buttons = options.tiles;

                self.el.trigger('toolbar_deco_loaded');
            });
        },
        activate: function() {
            var self = this,
                buttons = new $.toolbar.Groups(self.buttons, self.toolbar.options);
            self.el.html('');
            self.el.append(buttons.render());

            $('body', self.toolbar.document).addClass('toolbar-deco');
            // add min-width to panels wrappers

            $('[' + self.options.panel_data_attr + ']').each(function(i, panel) {
                panel = $(panel).decoPanel();

                // expose each panel
                // TODO: expose option should be hardcoded

                panel.el_wrapper
                    .css({
                        'background': '#FFFFFF',
                        'min-height': '50px'
                        })
                    .expose({
                        closeOnClick: false,
                        closeOnEsc: false,
                        zIndex: 400,
                        opacity: '0.6',
                        color: '#333'
                        });

                // activate each panel
                panel.activate();
            });

            //self.toolbar.stretch();
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

    // jQuery integration {{{
    $.fn.ploneDecoToolbar = function() {
        var el = $(this),
            toolbar = $($.plone.deco.options.toolbar_id).toolbar(),
            toolbar_deco = toolbar.el.data('toolbar-deco');

        if (toolbar_deco === undefined) {
            toolbar_deco = new $.plone.deco.Toolbar(toolbar);
            toolbar.el.data('toolbar-deco', toolbar_deco);
        }

        return toolbar_deco;
    };
    // }}}

    // Trigger deco toolbar {{{
    // TODO: this should be moved into exec of edit button
    var toolbar = $($.plone.deco.options.toolbar_id).toolbar(),
        toolbar_deco_loaded = false;
    $(toolbar.el).bind('toolbar_loaded', function() {
        $('#toolbar-button-edit', toolbar.document).click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            var toolbar_deco = $(this).ploneDecoToolbar();
            if (toolbar_deco_loaded === true) {
                toolbar_deco.activate();
            } else {
                toolbar_deco.el.bind('toolbar_deco_loaded', function() {
                    toolbar_deco.activate();
                    toolbar_deco_loaded = true;
                });
            }
        });
    });
    // }}}

}( window.parent ? window.parent : window,
   window.parent ? window.parent.jQuery : window.jQuery,
   window.parent ? window.parent.document : window.document ));
