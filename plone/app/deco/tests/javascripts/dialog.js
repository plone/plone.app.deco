module("dialog", {
    setup: function () {
        // We'll create a div element for the dialog
        var dialog = $(document.createElement("div"))
            .append($(document.createElement("form"))
                .append($(document.createElement("ul"))
                    .addClass("formTabs")
                    .append($(document.createElement("li"))
                        .addClass("formTab firstFormTab")
                        .append($(document.createElement("a"))
                            .addClass("selected")
                        )
                    )
                    .append($(document.createElement("li"))
                        .addClass("formTab")
                        .append($(document.createElement("a")))
                    )
                    .append($(document.createElement("li"))
                        .addClass("formTab lastFormTab")
                        .append($(document.createElement("a")))
                    )
                )
                .append($(document.createElement("fieldset"))
                    .attr("id", "fieldset-default")
                    .append($(document.createElement("div"))
                        .addClass("row")
                        .append($(document.createElement("div"))
                            .attr("id", "title-field")
                        )
                    )
                )
                .append($(document.createElement("div"))
                    .addClass("formFields")
                    .append($(document.createElement("input")))
                )
            )
            .attr("id", "region-content");
        $(document.body).append(dialog);
        $(document.body)
            .append($(document.createElement("div"))
                .addClass("deco-title-tile")
            );
    },
    teardown: function () {
        $("#region-content").remove();
    }
});

test("Initialisation", function() {
    expect(1);

    ok($.deco.dialog, "$.deco.dialog");
});

test("decoDialog", function() {
    expect(3);

    // Init dialog
    var dialog = $("#region-content");
    dialog.decoDialog();
    dialog.find(".button-field").trigger("click");

    equals($(".deco-dialog").length, 1, "Dialog added");
    equals($(".deco-dialog-blocker").length, 1, "Dialog blocker added");
    equals(dialog.find("input:visible").length, 0, "Inputs are hidden");
});

test("dialog.open", function() {
    expect(0);
    var optionsBackup = typeof($.deco.options) == "undefined" ? {} : $.deco.options;
    $.deco.options = {
        panels: $(document.body),
        tiles: [{
            'name': 'fields',
            'label': 'Fields',
            'tiles': [
                {
                    'name': 'title',
                    'type': 'field',
                    'id': 'title-field'
                },
                {
                    'name': 'pony',
                    'type': 'app'
                },
                {
                    'name': 'text',
                    'type': 'structure'
                },
            ]
        }]
    };

    $("#region-content").decoDialog();
    $.deco.dialog.open("all", {});

    // TODO

    $.deco.dialog.close();
    equals($(".deco-dialog-blocker:visible").length, 0, "Dialog blocker removed");
    equals($("#region-content:visible").length, 0, "Dialog removed");

    $.deco.dialog.open("field", {});

    // TODO

    $.deco.dialog.close();
    equals($(".deco-dialog-blocker:visible").length, 0, "Dialog blocker removed");
    equals($("#region-content:visible").length, 0, "Dialog removed");

    $.deco.options = optionsBackup;
});

test("dialog.openIframe", function() {
    expect(3);

    $.deco.dialog.openIframe("about:blank");
    equals($(".deco-iframe-dialog").length, 1, "Iframe dialog added");

    $.deco.dialog.close();
    equals($(".deco-dialog-blocker:visible").length, 0, "Dialog blocker removed");
    equals($(".deco-iframe-dialog").length, 0, "Iframe dialog removed");
});
