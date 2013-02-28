define(
function() {

  // create a namespace for deco functionality
  $.deco = {
    NUM_GRID_COLUMNS: 12
  };


  $.each(['Toolbar','Panel','Row','Column','Tile'], function(i, name) {
    // jQuery integration
    //
    // There should be a method for every layout type that gets
    // data stored on the object for that particular type.
    //
    $.fn['deco' + name] = function() {
      var el = $(this),
          dataName = 'deco-' + name.toLowerCase(),
          data = el.data(dataName);
      if (data === undefined) {
        data = new $.deco[name](el);
        el.data(dataName, data);
      }
      return data;
    };

    // helper methods
    //
    // Create methods that can be used to apply a callback to all the layout
    // elements of the given type. The callback gets, as a parameter, the
    // layout data associated with the element it's being called on.
    //
    // IE: $.deco.getToolbar(callback(data))
    //
    $.deco['get' + name] = function(el, callback) {
      $('.deco-' + name.toLowerCase(), el).each(function() {
        callback($(this)['deco' + name]());
      });
    };
  });

});

