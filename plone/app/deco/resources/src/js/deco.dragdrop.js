define(
'deco.dragdrop',
['jquery', 'deco', 'deco.tile'],
function($) {

  // Every dnd action runs through this to notify if they
  // can drop over the current area
  $.drop({
    tolerance: function(e, proxy, target ) {
      var doc = window.parent.document;
      var doctop = $(doc).scrollTop();
      var docleft = $(doc).scrollLeft();
      if ($(proxy.elem).hasClass('deco-column-proxy')) {
        if($(target.elem).hasClass('deco-column')){
          if (e.pageY + doctop > target.top && e.pageY + doctop < target.bottom &&
              e.pageX + docleft > target.left && e.pageX + docleft < target.right) {
            return 1;
          }
        }
      } else if($(proxy.elem).hasClass('deco-row-proxy')) {
        if ($(target.elem).hasClass('deco-row')) {
          if (e.pageX + doctop > target.left && e.pageX + doctop < target.right &&
              e.pageY + docleft > target.top - 20 && e.pageY + docleft < target.bottom + 20){
            return 1;
          }
        }
      } else if($(proxy.elem).hasClass('deco-tile-proxy') && $(target.elem).hasClass('deco-column')) {
        var drop = $.event.special.drop;
        if ((drop.contains(target, [e.pageX, e.pageY + $(doc).scrollTop()]) === true) &&
            (target.left < e.pageX) && (target.right > e.pageX)) {
          return 1;
        }
      }
      return 0;
    }
  });


  $.deco.dropTile = function(e, dd) {
    $(document).trigger('deco-tile-drag-dropped');
    var tile_el = $(dd.drag),
        preview_tile = $('.deco-tile-preview', window.parent.document),
        dragging_from_toolbar = $('[data-tile]', dd.drag).size() === 0;

    // only drop tile if there is preview tile somewhere
    if (preview_tile.size() > 0) {

      // if we drag from tile from toolbar we should open add_tile form in an
      // overlay. when sucessfully saved it should create new tile in deco grid
      // and remove preview_tile.
      if(dragging_from_toolbar) {
        var modal = $(dd.drag).data('patternModal');
        if(typeof(modal) !== "undefined") {
          modal.on('shown', function(ev) {
            $.iframe.stretch();
          });
          modal.on('hidden', function(ev) {
            preview_tile.remove();
            $.deco.getColumns(window.parent.document, function(col) {
              col.removeColumnInfo();
              col.addColumnInfo();
            });
          });
          $(document).ajaxSuccess(function(event, xhr, settings){
            if(typeof modal.$modal !== "function" && settings.url == $('#add_form', modal.$modal).attr('action')) {
              // blah
            }
          });
          modal.show();
          modal.on('after-ajax', function(ev) {
              $('#add_tile', modal.$modal).ajaxForm({
              //  target: '#output',
                delegation: true
              });
          });
        }
        /*
        $('<div/>').ploneOverlay({
          show: true,
          el: $(dd.drag).parents('form').attr('action') + '/' +
                    $('input[name="tiletype"]', dd.drag).attr('value'),
          formButtons: {
            '.modal-body input[name="buttons.cancel"]': $.fn.ploneOverlay.defaultAjaxSubmit({
                onSave: function(response, state, xhr, form, button) {
                  var overlay = this;
                  $(document).trigger('deco-tile-add-canceled');
                  // remove preview_tile
                  preview_tile.remove();
                  // destroy overlay
                  overlay.destroy();
                }
              }),
            '.modal-body input[name="buttons.save"]': $.fn.ploneOverlay.defaultAjaxSubmit({
                onSave: function(response, state, xhr, form, button) {
                  var overlay = this;

                  $(document).trigger('deco-tile-add-save');

                  // create new tile, place it after preview_tile and initialize it
                  var tile = $('<div/>')
                    .addClass('deco-tile')
                    .append($('<div/>')
                      .addClass('plone-tile')
                      .attr('data-tile', xhr.getResponseHeader('X-Tile-Url'))
                      .append(response.html()))
                    .insertAfter(preview_tile)
                    .decoTile();
                  tile.show();

                  // We'll save the layout because adding
                  // new tile actually stores data to the zodb
                  var decoToolbar = $($.plone.deco.defaults.toolbar).decoToolbar();
                  decoToolbar._editformDontHideDecoToolbar = true;
                  $($.plone.deco.defaults.form_save_btn, decoToolbar._editform).click();

                  // remove preview_tile
                  preview_tile.remove();
                  // destroy overlay
                  overlay.destroy();
                }
              })
          }
        });
        */

      } else {

        // move tile after preview tile and remove preview tile
        preview_tile.after(tile_el);

        // remove preview_tile
        preview_tile.remove();

        // notify user layout has changed and needs saving
        $(document).trigger('deco.toolbar.layoutchange');
      }
    }
  };


  // # Drop Column or Row
  $.deco.dropLayoutElement = function(e, dd) {
    if($(dd.proxy).hasClass('deco-layout-el')){
      $('.deco-preview', window.parent.document).removeClass('deco-preview');
      // trigger layout changed event
      $(document).trigger('deco.toolbar.layoutchange');
    }
  };

});
