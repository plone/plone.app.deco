define(
'deco.column',
['jquery', 'deco'],
function($) {

  $.deco.Column = function(el) {
    var self = this;
    self.el = el;
    self.doc = window.parent.document;
    self.del_container = null;
    self.del_el = null;
    self.el.events_registered = false;
  };


  $.deco.Column.prototype = {
    show: function() {
      var self = this;

      // initialize height on column otherwise empty
      // column will have no height and can't be dropped on
      self.calculateHeight();

      // Make sure to register these events only once by element
      // This add and remove column delete, drop info on drag
      if (!self.el.events_registered) {
        self.el.events_registered = true;
        $(document).on('deco-tile-drag-start', function(){
          self.removeColumnInfo();
        });
        $(document).on('deco-tile-drag-end', function(){
          self.addColumnInfo();
        });
      }

      // trigger deco.column.show event
      $(document).trigger('deco.column.show', [self]);

      // create drop place for tiles
      self.el.on('drop', $.deco.dropTile);

      // show tiles
      $.deco.getTiles(self.el, function(item) { item.show(); });

      // trigger deco.column.shown event
      $(document).trigger('deco.column.shown', [self]);

      self.addColumnInfo();
    },


    hide: function() {
      var self = this;

      self.clearHeight();

      // trigger deco.column.hide event
      $(document).trigger('deco.column.hide', [self]);

      // remove drop events
      self.el.off('drop');

      // hide tiles
      $.deco.getTiles(self.el, function(item) { item.hide(); });

      // trigger deco.column.hidden event
      $(document).trigger('deco.column.hidden', [self]);

      self.removeColumnInfo();
    },


    clearHeight: function(){
      // XXX part of height hack
      // XXX this is to clear height styles
      this.el.attr('style', '');
    },


    calculateHeight: function(){
      var self = this;
      // XXX setting default height here so we can drop elements
      // XXX can't figure out a way to make this work with css
      var row_height = self.el.parent().height();
      var column_height = self.el.height();
      if ((column_height < row_height) ||
          (self.el.attr('height') && column_height > row_height)) {
        // get row height and set to it.
        self.el.css('height', row_height);
      }
    },


    removeColumnInfo: function(){
      /* remove delete column info */
      var self = this;
      if (self.del_container !== null) {
        self.del_container.remove();
      }
      self.el.removeClass('deco-predelete');
      self.el.removeClass('deco-column-empty');
    },


    addColumnInfo: function(){
      /* for adding delete column info to column if needed */
      var self = this;
      if (self.el.find('.deco-tile-preview').length > 0) {
        return;
      }
      if($('.plone-tile', self.el).length === 0){
        self.del_container = $('<div class="deco-delete">Drag tiles here </div>');
        if($('.deco-column', self.doc).length > 1){
          // not able to delete last column
          self.del_el = $('<a href="#" title="delete column">or delete</a>');
          self.del_container.append(self.del_el);
          self.del_el.click(function(){
            $(this).parents('.deco-column').decoColumn().destroy();
            return false;
          });
          self.del_el.hover(function(){
            self.el.addClass('deco-predelete');
          }, function(){
            self.el.removeClass('deco-predelete');
          });
          self.el.append(self.del_container);
          self.el.addClass('deco-column-empty');
        }
      }
    },


    destroy: function(){
      var self = this;
      var row = self.el.parent().decoRow();

      // check if we need to delete row
      var newcolumn = self.el.siblings('.deco-column');
      var lastcolumn = false;
      if (newcolumn.length === 0) {
        lastcolumn = true;
      } else {
        // has sibligs, we need to add to grid with so it fills in space
        newcolumn = newcolumn.eq(0);
        var newcolumnobj = newcolumn.decoColumn();
        newcolumnobj.setWidth(self.getWidth() + newcolumnobj.getWidth());
      }

      if (lastcolumn) {
        row.el.remove();
      } else {
        self.el.remove();
      }
      // This is done so we can re-calculate layout
      $.deco.getPanels(window.parent.document, function(panel) {
        panel.hide();
        panel.show();
      });
      $(document).trigger('deco.toolbar.layoutchange');
    },


    getWidth: function() {
      var item = $(this.el);
      var itemClass = item.attr("class");
      if (itemClass.length) {
        var regex_match = itemClass.match(/\bdeco-span(\d+)/);
        if (regex_match.length > 1) {
          return parseInt(regex_match[1], 10);
        } else {
          // perhaps it's missing, not sure, but let's not error.
          return 1;
        }
      }
    },


    setWidth: function (newWidth) {
      var item = $(this.el);
      var itemClass = item.attr("class");
      if (itemClass) {
        var regex_match = itemClass.match(/\bdeco-span(\d+)/);
        item.removeClass(regex_match[0]);
        item.addClass('deco-span' + newWidth);
      }

    }
  };

});
