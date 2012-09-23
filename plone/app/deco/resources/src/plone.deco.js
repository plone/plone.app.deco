// Plone integration of Deco Layout Editor
// =======================================
//
// Author: Rok Garbas
// Contact: rok@garbas.si
// Version: 1.0
// Depends:
//    - http://code.jquery.com/jquery.js
//    - https://github.com/malsup/form/blob/master/jquery.form.js
//    - https://github.com/plone/plone.app.deco/blob/master/plone/app/deco/resources/src/deco.js
//    - https://github.com/plone/plone.app.toolbar/blob/master/plone/app/toolbar/resources/src/plone.mask.js
// Description: 
// License:
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

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  undef:true, strict:true, trailing:true, browser:true */
/*global jQuery:false */


(function ($) {
"use strict";

// # Namespace
$.plone = $.plone || {};
$.plone.deco = $.plone.deco || {};


// # Defaults
$.plone.deco.defaults = $.extend({
  trigger: '#plone-toolbar ul.nav > li#plone-action-deco > a',
  toolbar: '#deco-toolbar',
  toolbar_save_btn: '#deco-toolbar-save',
  toolbar_cancel_btn: '#deco-toolbar-cancel',
  form: 'form#form,form[name="edit_form"]',
  form_save_btn: '#form-buttons-save',
  form_cancel_btn: '#form-buttons-cancel'
}, $.plone.deco.defaults || {});


$(document).on('deco.panel.show', function(e, decoPanel) {
  decoPanel.el.css({
    'width': '100%',
    'float': 'left',
    'background': '#FFFFFF',
    'min-height': '50px',
    'position': 'relative',
    'z-index': '450'
  });
});

$(document).on('deco.toolbar.layoutchange', function(e){
  $($.plone.deco.defaults.toolbar_save_btn)
    .addClass('btn-primary')
    .html('Save');
});

// # Load edit form when Deco toolbar displays
$(document).on('deco.toolbar.show', function(e, decoToolbar) {
  var defaults = $.plone.deco.defaults,
      editformLoaded = false;

  // edit form
  // TODO: redo ajaxForm with "new $.plone.overlay.Overlay"
  decoToolbar._editform = $('<div/>').hide().appendTo(decoToolbar.el)
      .load(decoToolbar._editformUrl + ' ' + defaults.form, function(data) {
        $('> form', decoToolbar._editform).ajaxForm({
          beforeSerialize: function(form, options) {
            var content = '';
            $.deco.getPanels(window.parent.document, function(panel) {
              panel.hide();
              var els = $('<div/>').append(panel.el.clone());
              // perform some cleanup just in case...
              els.find('.deco-row-drop,.deco-column-drop,.deco-delete,.deco-column-drag').remove();
              els.find('.plone-tile').html('');
              content += els.html();
              if (decoToolbar._editformDontHideDecoToolbar) {
                panel.show();
              }
            });
            $('textarea[name="form.widgets.ILayoutAware.content"]', form).val(
              $('textarea[name="form.widgets.ILayoutAware.content"]', form)
                .val().replace(/(<body[^>]*>((.|[\n\r])*)<\/body>)/im,
                  '<body>' + content + '</body>'));
          },
          success: function(response, status, xhr, form) {
            var response_body = $('<div/>').html((/<body[^>]*>((.|[\n\r])*)<\/body>/im).exec(response)[1]),
                response_form = $(defaults.form, response_body);
            if (response_form.size() === 0) {
              if (!decoToolbar._editformDontHideDecoToolbar) {
                // update panels in top frame
                $.deco.getPanels(window.parent.document, function(panel) {
                  var response_panel = $('[data-panel="' + panel.el.attr('data-panel') + '"]', response_body);
                  if (response_panel.size() !== 0) {
                    panel.el.html(response_panel.html());
                  } else {
                    panel.el.remove();
                  }
                });
                // hide deco toolbar
                decoToolbar.hide();
              } else {
                decoToolbar._editformDontHideDecoToolbar = false;
                // since we just saved, disable save button
              }
              $($.plone.deco.defaults.toolbar_save_btn)
                  .removeClass('btn-primary')
                  .html('Close');
              // TODO: display notification (eg. "Deco page saved!")
            } else {
              // TODO: open overlay and focus on fireld with error
              console.log('error in form');
            }
          }
        });
        editformLoaded = true;
        $(document).trigger('plone.deco.editformLoaded');
      });

  // bind save button of toolbar to click save button in edit form
  $(defaults.toolbar_save_btn, decoToolbar.el).off('click').on('click', function(e) {
    if($(this).hasClass('btn-primary')){
      // nothing to save, just close
      decoToolbar.hide();
    }
    e.preventDefault();
    e.stopPropagation();

    function saveToolbar() {
      $(defaults.form_save_btn, decoToolbar._editform).click();
    }

    if (editformLoaded === true) {
      saveToolbar();
    } else {
      $(document).on('plone.deco.editformLoaded', function() {
        $(document).off('plone.deco.editformLoaded');
        saveToolbar();
      });
    }
  });

  // bind cancel button of toolbar to cancel button in edit form
  $('#deco-toolbar-cancel', decoToolbar.el).off('click').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();

    function cancelToolbar() {
      $(defaults.form_cancel_btn, decoToolbar._editform).click();
    }

    if (editformLoaded === true) {
      cancelToolbar();
    } else {
      $(document).on('plone.deco.editformLoaded', function() {
        $(document).off('plone.deco.editformLoaded');
        cancelToolbar();
      });
    }
  });

  // load mask
  $.plone.mask.load();

});

$(document).on('deco.toolbar.hide', function(e, decoToolbar) {

  // close mask
  $.plone.mask.close();

});

// # Initialize Deco
$(document).ready(function() {
  var defaults = $.plone.deco.defaults;
  if ($(defaults.toolbar).size() !== 0) {
    var decoToolbar = $(defaults.toolbar).decoToolbar();
    $(defaults.trigger).off().on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      decoToolbar._editformUrl = $(this).attr('href');
      decoToolbar.toggle();
    });
  }
});

}(jQuery));
