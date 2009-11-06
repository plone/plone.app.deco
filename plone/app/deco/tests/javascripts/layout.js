// Create executed property
$.deco.executed = [];

module("layout", {
    setup: function () {
        // We'll create a div element for the dialog
        $(document.body)
            .append(
                $(document.createElement("div"))
                    .attr("id", "region-content")
            );
        $(document.body)
            .append(
                $(document.createElement("div"))
                    .attr("id", "portal-column-one")
            );
        $(document.body)
            .append($(document.createElement("textarea"))
                .attr('id', 'form-widgets-ILayout-layout')
                .val('<html><div class="deco-panel" id="region-content">region-content text</div><div class="deco-panel" id="portal-column-one">portal-column-one text</div></html>')
            );

        // Empty executed
        $.deco.executed = [];
    },
    teardown: function () {
        $("#region-content").remove();
        $("#region-content-edit").remove();
        $("#portal-column-one").remove();
        $("#form-widgets-ILayout-layout").remove();
    }
});

test("Initialisation", function() {
    expect(4);

    ok($.deco, "$.deco");
    ok($.deco.layout, "$.deco");
    ok($.deco.layout.widthClasses, "$.deco");
    ok($.deco.layout.positionClasses, "$.deco");
});

test("Init without data", function() {
    expect(0);

});
