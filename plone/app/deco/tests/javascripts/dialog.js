module("dialog", {
    setup: function () {
    },
    teardown: function () {
    }
});

test("Initialisation", function() {
    expect(1);

    ok($.deco.dialog, "$.deco.dialog");
});

test("decoDialog", function() {
    // expect(1);

    // We'll create a div element for the dialog
    var dialog = $(document.createElement("div"))
        .append($(document.createElement("div"))
            .addClass("formFields")
            .append($(document.createElement("input")))
        );
    $(document.body).append(dialog);

    // Init dialog
    dialog.decoDialog();
    dialog.find(".button-field").trigger("click");

    equals($(".deco-dialog").length, 1, "Dialog added");
    equals($(".deco-dialog-blocker").length, 1, "Dialog blocker added");
    equals(dialog.find("input:visible").length, 0, "Inputs are hidden");
});
