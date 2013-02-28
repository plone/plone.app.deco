define(
'deco',
['jquery'],
function($) {

  // create a namespace for deco functionality
  $.deco = {
    NUM_GRID_COLUMNS: 12
  };


  // helper methods
  //
  // Create methods that can be used to apply a callback to all the layout
  // elements of the given type. The callback gets, as a parameter, the
  // layout data associated with the element it's being called on.
  //
  // IE: $.deco.getToolbars(callback(data))
  //
  $.deco.getTiles = function(el, callback) {
    $('.deco-tile', el).each(function() {
      callback($(this).decoTile());
    });
  };
  $.deco.getColumns = function(el, callback) {
    $('.deco-column', el).each(function() {
      callback($(this).decoColumn());
    });
  };
  $.deco.getRows = function(el, callback) {
    $('.deco-row', el).each(function() {
      callback($(this).decoRow());
    });
  };
  $.deco.getPanels = function(el, callback) {
    $('[data-panel]', el).each(function() {
      callback($(this).decoPanel());
    });
  };
  $.deco.getTileType = function(el, callback) {
    $('.plone-tiletype', el).each(function() {
      callback($(this).decoTile());
    });
  };
});

