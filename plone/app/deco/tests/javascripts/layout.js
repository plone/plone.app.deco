// Create executed property
$.deco.executed = [];

$.deco.options = {
    tiles: [
    { "label" : "Fields",
    "name" : "fields",
    "tiles" : [ { "available_actions" : [ "tile-align-block",
              "tile-align-right",
              "tile-align-left"
            ],
          "category" : "fields",
          "default_value" : null,
          "favorite" : false,
          "label" : "Title",
          "name" : "plone.app.standardtiles.title",
          "read_only" : false,
          "rich_text" : true,
          "settings" : false,
          "tile_type" : "app",
          "weight" : 10
        },
        { "available_actions" : [ "tile-align-block",
              "tile-align-right",
              "tile-align-left"
            ],
          "category" : "fields",
          "default_value" : null,
          "favorite" : false,
          "label" : "Description",
          "name" : "plone.app.standardtiles.description",
          "read_only" : false,
          "rich_text" : true,
          "settings" : false,
          "tile_type" : "app",
          "weight" : 20
        }
      ],
    "weight" : 30
    } 
    ]
};

$.fn.decoEditor = function() {
    $.deco.executed.push("decoEditor");
};

// Create ajax stub function
$.ajax = function (options) {
    options.success();
};


module("layout", {
    setup: function () {
        // We'll create a div element for the overlay
        $(document.body)
            .append($('<div data-panel="content"></div><div data-panel="portal-column-one"><div class="deco-grid-row"><div class="deco-grid-cell"><div class="deco-tile deco-plone.app.standardtiles.title-tile"><div class="deco-tile-content"><span data-tile="./@@plone.app.standardtiles.field?field=title">Samuel L. Ipsum</span></div></div></div></div></div>'));
        $(document.body)
            .append(
                $(document.createElement("div"))
                    .addClass("deco-toolbar")
            );
        $(document.body).append($('<div id="formfield-form-widgets-IDublinCore-title"><input type="text" /></div>'));
        $.deco.options.panels = $("[data-panel]");
        $.deco.options.toolbar = $(".deco-toolbar");

        // Empty executed
        $.deco.executed = [];
        $.deco.document = document;
    },
    teardown: function () {
        $("[data-panel=content]").remove();
        $("[data-panel=portal-column-one]").remove();
        $("#formfield-form-widgets-IDublinCore-title").remove();
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
    expect(4);

    // Init panel
    $.deco.options.panels.decoLayout();
    // simulate app tile init
    $('[data-tile]').before($('<p class="hiddenStructure tileUrl">./@@plone.app.standardtiles.field?field=title</p>'));
    var saved_html = $.deco.getPageContent();
    equals($.deco.getPageContent().indexOf('<div data-panel="content">') != -1, true, "getPageContent is round-tripable");
    equals($.deco.getPageContent().indexOf('<div data-panel="portal-column-one">') != -1, true, "getPageContent is round-tripable");
    equals(saved_html.indexOf('<span data-tile="./@@plone.app.standardtiles.field?field=title"></span>') != -1, true, "getPageContent preserves tiles");
    equals($("#formfield-form-widgets-IDublinCore-title input").val(), "Samuel L. Ipsum", "title value preserved in form");
});
