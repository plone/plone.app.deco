require(
['jquery', 'deco.init'],
function($) {

    // # Namespace
    $.plone = $.plone || {};
    $.plone.deco = $.plone.deco || {};


    // # Defaults
    $.plone.deco.defaults = $.extend({
      trigger: '#plone-toolbar li#plone-action-deco > a',
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
      $($.plone.deco.defaults.toolbar_cancel_btn).show();
    });

    // # Load edit form when Deco toolbar displays
    $(document).on('deco.toolbar.show', function(e, decoToolbar) {
      var defaults = $.plone.deco.defaults,
          editformLoaded = false;

      // edit form
      // TODO: redo ajaxForm with "new $.plone.overlay.Overlay"
      decoToolbar._editform = $('<div/>').hide().appendTo($('body', window.parent.document))
          .load(decoToolbar._editformUrl + ' ' + defaults.form, function(data) {
            $('> form', decoToolbar._editform).ajaxForm({
              beforeSerialize: function(form, options) {
                var content = '';
                $.deco.getPanels(window.parent.document, function(panel) {
                  panel.hide();
                  var els = $('<div/>').append(panel.el.clone());
                  // perform some cleanup just in case...
                  els.find('.deco-tile-preview,.deco-tile-proxy,.deco-row-drop,.deco-column-drop,.deco-delete,.deco-column-drag').remove();
                  els.find('.deco-column').attr('style', '');
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
                  $($.plone.deco.defaults.toolbar_cancel_btn).hide();
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
        e.preventDefault();
        e.stopPropagation();

        // if there have been no changes, then the save button displays 'Close' and
        // should not need to perform any further actions, and should behave the
        // same as a cancel
        if(!$(this).hasClass('btn-primary')){
          decoToolbar.hide();
          $(defaults.form_cancel_btn, decoToolbar._editform).click();
          return;
        }

        function saveToolbar() {
          $(defaults.form_save_btn, decoToolbar._editform).click();
          decoToolbar.hide();
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

      $('#deco-toolbar-properties').click(function(e) {
        e.preventDefault();
        e.stopPropagation();

        var modal = $(e.target).data('patternModal');
        modal.on('after-ajax', function(ev) {
          var hidechrome = function() {
              $('#portal-top', modal.$modal).hide();
              $('#portal-footer-wrapper', modal.$modal).hide();
              $('#viewlet-above-content', modal.$modal).hide();
              $('#viewlet-below-content', modal.$modal).hide();
              $('#edit-bar' , modal.$modal).hide();
              $('h1.documentFirstHeading' , modal.$modal).hide();
              $('p.discreet' , modal.$modal).hide();
          };

          hidechrome();

          $(document).ajaxSuccess(function(event, xhr, settings){
            if(typeof modal.$modal !== "function" && settings.url == $('#form', modal.$modal).attr('action')) {
              // blah
            }
          });
        });
      });


      // load mask
      // $.mask.load();

    });

    $(document).on('deco.toolbar.hide', function(e, decoToolbar) {

      // close mask
      // $.mask.close();

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

      require(['jquery', 'js/patterns/modal.js'], function($) {
        $('#deco-toolbar-properties').modal();
        /*$('.module #from').ajaxForm({
          delegation: true
        });
        */

        $('#deco-toolbar div.plone-tiletype').each(function(i, el) {
          var elidsel = '#' + $(el).attr('id');
          var aurl = $(el).parents('form').attr('action')
                      + '/' + $('input[name="tiletype"]', el).attr('value');
          $(elidsel).modal({ajaxUrl:aurl});
        });
        /*$('.module #add_form').ajaxForm({
          delegation: true
        });
        */
      });

      // $('#deco-toolbar-properties').ploneOverlay({
      //   onShow: function() {
      //     $(this).dropdown('toggle');
      //     // let's hide this since you're supposed to edit with GUI
      //     $('#formfield-form-widgets-ILayoutAware-content').hide();
      //   },
      //   formButtons: {
      //     '.modal-body input[name="form.buttons.cancel"]': $.fn.ploneOverlay.defaultAjaxSubmit(),
      //     '.modal-body input[name="form.buttons.save"]':
      //         $.fn.ploneOverlay.defaultAjaxSubmit({
      //           onSave: function(response, state, xhr, form, button) {
      //             // need redirect to different url after successfull submitting
      //             window.parent.location.href = this.getBaseURL(xhr.responseText);
      //           }
      //         })
      //   }
      // });
    });

});
