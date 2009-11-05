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

module("toolbar", {
    setup: function () {
        $(document.body).append($(document.createElement("div")).addClass("deco-toolbar"));
    },
    teardown: function () {
        $(".deco-toolbar").remove();
    }
});

test("Initialisation", function() {
    expect(2);

    ok($.deco.toolbar, "$.deco.toolbar");
    ok($.deco.toolbar.events, "$.deco.toolbar.events");
});

test("decoToolbar", function() {
    expect(0);

});
