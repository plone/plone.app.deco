// Create executed property
$.deco.executed = [];

$.deco.options = {
    "tiles": [{
        'name': 'fields',
        'label': 'Fields',
        'tiles': [
            {
                "name": "title",
                "label": "Title",
                "type": "field",
                "id": "title-field",
                "available_actions": ["strong"]
            },
            {
                "name": "description",
                "type": "field",
                "label": "Description",
                "id": "description-field",
                "available_actions": []
            }
        ]
    },
    {
        'name': 'app',
        'label': 'App',
        'tiles': [
            {
                'name': 'pony',
                "label": "Pony",
                'type': 'app'
            },
            {
                'name': 'text',
                "label": "Text",
                'type': 'structure'
            },
        ]
    },
    {
        'name': 'other',
        'label': 'Other',
        'tiles': []
    }],
    "default_available_actions": [
        "save",
        "cancel",
        "page-properties",
        "format",
        "insert"
    ]
};

module("layout", {
    setup: function () {
        // We'll create a div element for the overlay
        $(document.body)
            .append(
                $(document.createElement("div"))
                    .attr("id", "content")
                    .addClass("deco-panel")
                    .append(
                        $(document.createElement("div"))
                            .addClass("deco-text-tile deco-tile")
                            .html("text content")
                            .append(
                                $(document.createElement("div"))
                                    .addClass("deco-tile-content")
                                    .append(
                                        $(document.createElement("p"))
                                            .html("text content")
                                    )
                            )
                    )
            );
        $(document.body)
            .append(
                $(document.createElement("div"))
                    .attr("id", "portal-column-one")
                    .addClass("deco-panel")
            );
        $(document.body)
            .append(
                $(document.createElement("div"))
                    .addClass("deco-toolbar")
            );

        $.deco.options.panels = $(".deco-panel");
        $.deco.options.toolbar = $(".deco-toolbar");

        // Empty executed
        $.deco.executed = [];
        $.deco.document = document;
    },
    teardown: function () {
        $("#content").remove();
        $("#content-edit").remove();
        $("#portal-column-one").remove();
        $("#form-widgets-ILayoutAware-layout").remove();
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

    // Init panel
    $.deco.options.panels.decoLayout();

});
