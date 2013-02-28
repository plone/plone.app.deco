define(
'deco.init',
['jquery', 'deco', 'deco.dragdrop', 'deco.toolbar', 'deco.panel', 'deco.row', 'deco.column', 'deco.tile'],
function($){

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
  });


});
