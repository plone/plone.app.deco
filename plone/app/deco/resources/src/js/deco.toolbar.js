define(
["js/deco"],
function() {

  $.deco.Toolbar = function(el) {
    this.el = el;
    this.add_column_btn = $('#plone-deco-addcolumn', el);
    this.add_row_btn = $('#plone-deco-addrow', el);
    this.doc = window.parent.document;
  };

  $.deco.Toolbar.prototype = {
    setupDnD: function(el, options){
      options = options || {};
      options = $.extend({
        type: 'column',
        placeholdercss: function(el){ return {}; },
        halfcondition: function(el){ return {}; },
        create: function(dd){},
        drop: function(e, dd){},
        last_sel: 'last-child'
      }, options);

      var type = options.type;
      var css = options.placeholdercss;
      var halfcondition = options.halfcondition;
      var doc = window.parent.document;

      $('.deco-' + type, doc).on('drop', $.deco.dropLayoutElement);

      el.off('dragstart').drag('start', function(e, dd) {
        $.iframe.stretch();
        // create drop targets
        $('.deco-' + type, doc).each(function() {
          $('<div class="deco-' + type + '-drop"/>')
            .css(css(this, false))
            .insertAfter(this);
        });
        $('.deco-' + type + ':' + options.last_sel, doc).each(function() {
          $('<div class="deco-' + type + '-drop"/>')
            .css(css(this, true))
            .insertAfter(this);
        });

        // create proxy element which is going to be dragged around append
        // it to body of top frame.
        var proxy = $('<div/>')
          .addClass('deco-' + type + '-proxy')
          .addClass('deco-layout-el')
          .appendTo($('body'));

        // returning an element from 'dragstart' event is what makes proxy,
        // otherwise original element is used.
        return proxy;

      }, { distance: 10 });

      el.drag(function(e, dd) {
        // proxy tile follows mouse
        $(dd.proxy).css({
          top: dd.offsetY,
          left: dd.offsetX
        });

        if ($(dd.drop).hasClass('deco-preview')) {
          return;
        }

        if ($(dd.drop).length === 1) {
          // we're on a drop target; figure out where to put the preview
          if (halfcondition(e, dd)) {
            // 2nd half; add if it's not there yet
            if (!$(dd.drop).next().is('.deco-preview')) {
              options.create(dd, "after");
            }
          } else {
            // 1st half; add if it's not there yet
            if (!$(dd.drop).prev().is('.deco-preview')) {
              options.create(dd, "before");
            }
          }
        }

        // Keep track of which column was temporarily shortened
        // to make way for the preview. If it's different than
        // before, restore the size of the previous one.
        if (type === 'column') {
          var lastDrop = $(window.document).data('deco-last-drop');
          if ($(lastDrop).hasClass('deco-column') && (!$(dd.drop).length) || !$(lastDrop).is(dd.drop)) {
            $('.deco-preview', window.parent.document).remove();
            if ($(lastDrop).hasClass('deco-column')) {
              var decoCol = $(lastDrop).decoColumn();
              var width = decoCol.getWidth();
              if (width < $.deco.NUM_GRID_COLUMNS) {
                decoCol.setWidth(width + 1);
              }
            }
          }
          $(window.document).data('deco-last-drop', dd.drop);
        }

      });

      el.off('dragend').drag('end', function(e, dd) {
        $(window.document).data("deco-last-drop", false);
        $('.deco-preview', doc).removeClass('deco-preview');
        $(dd.proxy).remove();
        $.iframe.shrink();
        $('.deco-' + type + '-drop', doc).remove();
      });
    },


    show: function() {
      var self = this;
      self._hidden = false;

      // trigger deco.toolbar.show event
      $(document).trigger('deco.toolbar.show', [self]);

      // show toolbar tiles
      $.deco.getTileType(self.el, function(item) { item.show(); });

      // mark document as being edited
      $('body').addClass('deco-toolbar-editing');

      // show panels
      $.deco.getPanels(window.parent.document, function(item) { item.show(); });

      // set up column drag/drop
      self.setupDnD(self.add_column_btn, {
        type: 'column',
        create: function(dd, side) {
          // Remove any previous previews.
          $('.deco-preview', window.parent.document).remove();

          var newColumn = $('<div/>')
            .addClass('deco-column deco-preview deco-span1');

          // calculate total width and find the biggest column
          var totalSize = 0;
          var biggestSize = 0;
          var biggestCol = null;
          var columns = $(dd.drop).parent().children(".deco-column");
          columns.splice(columns.index(dd.drop), newColumn);
          columns.each(function() {
              var decoCol = $(this).decoColumn();
              var width = decoCol.getWidth();
              totalSize += width;
              if (width > biggestSize) {
                biggestCol = $(this);
                biggestSize = width;
              }
          });

          // decrease size of biggest column
          if (totalSize >= $.deco.NUM_GRID_COLUMNS) {
              var lastDrop = $(window.document).data('deco-last-drop');
              if (biggestSize > 1 && !biggestCol.is(lastDrop)) {
                  var decoCol = $(biggestCol).decoColumn();
                  var width = decoCol.getWidth();
                  decoCol.setWidth(width - 1);
              }
          }

          if (side === "after") {
            newColumn.insertAfter($(dd.drop));
          } else {
            newColumn.insertBefore($(dd.drop));
          }
          newColumn.decoColumn().show();
          $(document).trigger('deco.toolbar.layoutchange');
          return newColumn;
        },
        placeholdercss: function(el, last){
          el = $(el);
          return {
            height: el.height(),
            left: el.position().left + (last ? el.width() : 0),
            top: el.position().top
          };
        },
        halfcondition: function(e, dd) {
          return (e.pageX > $(dd.drop).offset().left + $(dd.drop).width() / 2);
        }
      });

      // set up row drag/drop
      self.setupDnD(self.add_row_btn, {
        type: 'row',
        init: 'decoRow',
        last_sel: 'last',
        create: function(dd, side) {
          // Remove any previous previews.
          $('.deco-preview', window.parent.document).remove();

          var row = $('<div/>')
            .addClass('deco-row deco-preview');

          if (side === "after") {
            row.insertAfter($(dd.drop));
          } else {
            row.insertBefore($(dd.drop));
          }
          row.decoRow().show();

          // Make sure there's a column in the row
          $('<div/>')
            .addClass('deco-column deco-span' + $.deco.NUM_GRID_COLUMNS)
            .appendTo(row)
            .decoColumn().show();

          $(document).trigger('deco.toolbar.layoutchange');
          return row;
        },
        placeholdercss: function(el, last){
          el = $(el);
          return {
            width: el.width(),
            left: el.position().left,
            top: el.position().top + (last ? el.position().top : 0)
          };
        },
        halfcondition: function(e, dd) {
          return (e.pageY > $(dd.drop).offset().top + $(dd.drop).height() / 2);
        }
      });

      // show toolbar
      $.iframe.stretch();
      self.el.slideDown('slow', function() {
        $.iframe.shrink();
        $.iframe.is_stretched = true;
      });

      // trigger deco.toolbar.shown event
      $(document).trigger('deco.toolbar.shown', [self]);
    },


    hide: function() {
      var self = this;
      self._hidden = true;

      // trigger deco.toolbar.hide event
      $(document).trigger('deco.toolbar.hide', [self]);

      // hide toolbar tiles
      $.deco.getTileType(self.el, function(item) { item.hide(); });

      // remove editing marker class
      $('body').removeClass('deco-toolbar-editing');

      // hide panels
      $.deco.getPanels(window.parent.document, function(item) { item.hide(); });

      // hide toolbar
      self.el.slideUp('slow', function() {
        $.iframe.is_stretched = true;
        $.iframe.shrink();
      });

      // trigger deco.toolbar.hidden event
      $(document).trigger('deco.toolbar.hidden', [self]);
    },


    toggle: function() {
      var self = this;
      if (self._hidden === false) {
        self.hide();
      } else {
        self.show();
      }
    }
  }; 
});
