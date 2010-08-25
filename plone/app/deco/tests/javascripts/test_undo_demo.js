function handler(state) {
  $("#undo-area").html(state);
}

function removeLI() {
  $("#undo-ul li").last().remove();
  undo.add($("#undo-area").html());
}

function addLI() {
  $("#undo-ul").append("<li>item " + $("#undo-ul li").size() + "</li>");
  undo.add($("#undo-area").html());
}

function doUndo() {
  undo.undo();
}

function doRedo() {
  undo.redo();
}

$(document).ready(function() {
    undo = new $.deco.undo.UndoManager(10, handler, $("#undo-area").html());
});


