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

module("dialog", {
    setup: function () {
        // We'll create a div element for the dialog
        $.deco.options.panels = $(document.body);
        var dialog = $(document.createElement("div"))
            .append($(document.createElement("form"))
                .append($(document.createElement("ul"))
                    .addClass("formTabs")
                    .append($(document.createElement("li"))
                        .addClass("formTab firstFormTab")
                        .append($(document.createElement("a"))
                            .addClass("selected")
                            .attr("href", "#fieldsetlegend-default")
                        )
                    )
                    .append($(document.createElement("li"))
                        .addClass("formTab")
                        .append($(document.createElement("a"))
                            .attr("href", "#fieldsetlegend-1")
                        )
                    )
                    .append($(document.createElement("li"))
                        .addClass("formTab lastFormTab")
                        .append($(document.createElement("a"))
                            .attr("href", "#fieldsetlegend-2")
                        )
                    )
                )
                .append($(document.createElement("fieldset"))
                    .attr("id", "fieldset-default")
                    .append($(document.createElement("div"))
                        .attr("id", "title-field")
                    )
                )
                .append($(document.createElement("fieldset"))
                    .attr("id", "fieldset-1")
                    .append($(document.createElement("div"))
                        .attr("id", "some-field")
                    )
                )
                .append($(document.createElement("fieldset"))
                    .attr("id", "fieldset-2")
                    .append($(document.createElement("div"))
                        .attr("id", "formfield-form-widgets-ILayout-layout")
                    )
                )
                .append($(document.createElement("div"))
                    .addClass("formControls")
                    .append($(document.createElement("input")))
                )
            )
            .attr("id", "content");
        $(document.body).append(dialog);
        $(document.body)
            .append($(document.createElement("div"))
                .addClass("deco-title-tile")
            );
        dialog.decoDialog();
    },
    teardown: function () {
        $("#content").remove();
        $(".deco-dialog-blocker").remove();
        $(".deco-title-tile").remove();
    }
});

test("Initialisation", function() {
    expect(1);

    ok($.deco.dialog, "$.deco.dialog");
});

test("decoDialog", function() {
    expect(3);

    // Init dialog
    $("#content").find(".button-field").trigger("click");

    equals($(".deco-dialog").length, 1, "Dialog added");
    equals($(".deco-dialog-blocker").length, 1, "Dialog blocker added");
    equals($("#content").find("input:visible").length, 0, "Inputs are hidden");
});

test("dialog.open", function() {
    expect(20);

    $.deco.dialog.open("all", {});

    equals($("a[href=#fieldsetlegend-default]").hasClass("selected"), false, "First tab is deselected");
    equals($("a[href=#fieldsetlegend-default]").parent().hasClass("firstFormTab"), false, "First tab marker is removed");
    equals($("a[href=#fieldsetlegend-default]").parent().hasClass("deco-hidden"), true, "First tab is hidden");

    equals($("a[href=#fieldsetlegend-1]").hasClass("selected"), true, "Second tab is selected");
    equals($("a[href=#fieldsetlegend-1]").parent().hasClass("firstFormTab"), true, "Second tab has firstTab marker");
    equals($("a[href=#fieldsetlegend-1]").parent().hasClass("lastFormTab"), true, "Second tab has lastTab marker");
    equals($("a[href=#fieldsetlegend-1]").parent().hasClass("deco-hidden"), false, "Second tab is shown");

    equals($("a[href=#fieldsetlegend-2]").parent().hasClass("lastFormTab"), false, "Last tab marker is removed");
    equals($("a[href=#fieldsetlegend-2]").parent().hasClass("deco-hidden"), true, "Last tab is hidden");

    equals($('#formfield-form-widgets-ILayout-layout').hasClass('deco-hidden'), true, "Row with layoutfield is hidden");

    equals($('#fieldset-1').hasClass('hidden'), false, "Second fieldset is shown");

    $.deco.dialog.close();
    equals($(".deco-dialog-blocker:visible").length, 0, "Dialog blocker removed");
    equals($("#content:visible").length, 0, "Dialog removed");

    $.deco.dialog.open("field", {id: "title-field"});

    equals($('#fieldset-default').hasClass('hidden'), false, "First fieldset is shown");
    equals($('#fieldset-1').hasClass('hidden'), true, "Second fieldset is hidden");
    equals($('#fieldset-2').hasClass('hidden'), true, "Third fieldset is shown");

    equals($('#title-field').hasClass('deco-hidden'), false, "Title field is shown");

    equals($('.formTabs').hasClass('deco-hidden'), true, "Tabs are hidden");

    $(".formControls input[value=Ok]").trigger("click");
    equals($(".deco-dialog-blocker:visible").length, 0, "Dialog blocker removed");
    equals($("#content:visible").length, 0, "Dialog removed");
});

test("dialog.openIframe", function() {
    expect(3);

    $.deco.dialog.openIframe("about:blank");
    equals($(".deco-iframe-dialog").length, 1, "Iframe dialog added");

    $.deco.dialog.close();
    equals($(".deco-dialog-blocker:visible").length, 0, "Dialog blocker removed");
    equals($(".deco-iframe-dialog").length, 0, "Iframe dialog removed");
});
