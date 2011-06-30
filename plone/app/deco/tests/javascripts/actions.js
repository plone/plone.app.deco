// Create tinyMCE stub object
var tinyMCE = {
    execCommand: function (cmd) {
        tinyMCE.lastexecuted = cmd;
    },
    lastexecuted: ''
};

// Create last executed method
$.deco.lastexecuted = "";

// Create getPageContent stub function
$.deco.getPageContent = function () {
    return "test content";
};

// Create addTile stub function
$.deco.addTile = function () {
    $.deco.lastexecuted = "addTile";
};

// Create getDefaultValue stub function
$.deco.getDefaultValue = function () {
    return "test value";
};

// Create overlay stub object
$.deco.overlay = {
    open: function () {
        $.deco.lastexecuted = "overlay.open";
    },
    openIframe: function () {
        $.deco.lastexecuted = "overlay.openIframe";
    }
};

module("actions", {
    setup: function () {
    },
    teardown: function () {
        // Reset last executed
        $.deco.lastexecuted = "";

        // Reset tinymce stub
        tinyMCE.lastexecuted = "";
    }
});

test("Basic requirements", function() {
    expect(4);

    ok($.deco, "$.deco");
    ok($.deco.actionManager, "$.deco.actionManager");
    ok($.deco.actionManager.actions, "$.deco.actionManager.actions");
    ok($.deco.actionManager.shortcuts, "$.deco.actionsManager.shortcuts");
});

test("registerAction", function() {
    expect(6);

    // We register a simple action first without any options
    $.deco.registerAction("simple", {});

    ok($.deco.actionManager.actions["simple"], "Register simple action");
    equals($.deco.actionManager.actions["simple"].visible(), true, "The actions should be visible by default")

    // We register a more advanced action
    $.deco.registerAction("advanced", {

        exec: function () {
            return "custom exec";
        },

        shortcut: {
            ctrl:true,
            alt: false,
            shift: false,
            key: "t"
        },
        
        visible: function () {
            return false;
        }
    });

    ok($.deco.actionManager.actions["advanced"], "Register advanced action");
    equals($.deco.actionManager.actions["advanced"].visible(), false, "Add custom visible function");
    equals($.deco.actionManager.actions["advanced"].exec(), "custom exec", "Add custom exec function");
    equals($.deco.actionManager.shortcuts.length, 1, "Shortcut is registered");
});

test("decoExecAction", function() {
    expect(1);

    // We'll create a div element first
    var div = $(document.createElement("div")).html("foo");

    // We'll register an action
    $.deco.registerAction("execaction", {
        exec: function () {
            div.html("bar");
        }
    });

    // Now set the action for the div and call the action
    div.data("action", "execaction");
    div.decoExecAction();
    equals(div.html(), "bar", "Add custom visible function");
});

test("fixWebkitSpan", function() {
    expect(1);

    // We'll create a div element containing a span with the Apple style span
    $(document.body).append(
        $(document.createElement("div"))
            .addClass("styletest")
            .append(
                $(document.createElement("span"))
                    .html("foo")
                    .addClass("Apple-style-span")
            )
    );

    // Clean up the html
    $.deco.fixWebkitSpan();
    equals($(".styletest").html(), "foo", "Remove webkit style spans");

    // Clean up after test
    $(".styletest").remove();
});

test("initActions", function() {
    expect(39);

    // Init the actions
    $.deco.initActions();

    $.deco.actionManager.actions["strong"].exec();
    equals(tinyMCE.lastexecuted, "Bold", "Strong action");

    $.deco.actionManager.actions["em"].exec();
    equals(tinyMCE.lastexecuted, "Italic", "Emphasis action");

    $.deco.actionManager.actions["ul"].exec();
    equals(tinyMCE.lastexecuted, "InsertUnorderedList", "Unordered list action");

    $.deco.actionManager.actions["ol"].exec();
    equals(tinyMCE.lastexecuted, "InsertOrderedList", "Ordered list action");

    $.deco.actionManager.actions["undo"].exec();
    equals(tinyMCE.lastexecuted, "Undo", "Undo action");

    $.deco.actionManager.actions["redo"].exec();
    equals(tinyMCE.lastexecuted, "Redo", "Redo action");

    $.deco.actionManager.actions["paragraph"].exec();
    equals(tinyMCE.lastexecuted, "FormatBlock", "Paragraph action");

    $.deco.actionManager.actions["heading"].exec();
    equals(tinyMCE.lastexecuted, "FormatBlock", "Heading action");

    $.deco.actionManager.actions["subheading"].exec();
    equals(tinyMCE.lastexecuted, "FormatBlock", "Subheading action");

    $.deco.actionManager.actions["discreet"].exec();
    equals(tinyMCE.lastexecuted, "mceSetCSSClass", "Discreet action");

    $.deco.actionManager.actions["literal"].exec();
    equals(tinyMCE.lastexecuted, "FormatBlock", "Literal action");

    $.deco.actionManager.actions["quote"].exec();
    equals(tinyMCE.lastexecuted, "mceSetCSSClass", "discreet action");

    $.deco.actionManager.actions["callout"].exec();
    equals(tinyMCE.lastexecuted, "mceSetCSSClass", "Callout action");

    $.deco.actionManager.actions["highlight"].exec();
    equals(tinyMCE.lastexecuted, "mceSetCSSClass", "Highlight action");

    $.deco.actionManager.actions["sub"].exec();
    equals(tinyMCE.lastexecuted, "Subscript", "Sub action");

    $.deco.actionManager.actions["sup"].exec();
    equals(tinyMCE.lastexecuted, "Superscript", "Sup action");

    $.deco.actionManager.actions["remove-format"].exec();
    equals(tinyMCE.lastexecuted, "RemoveFormat", "Remove format action");

    $.deco.actionManager.actions["pagebreak"].exec();
    equals(tinyMCE.lastexecuted, "mceSetCSSClass", "Pagebreak action");

    $.deco.actionManager.actions["justify-left"].exec();
    equals(tinyMCE.lastexecuted, "mceSetCSSClass", "Justify left action");

    $.deco.actionManager.actions["justify-center"].exec();
    equals(tinyMCE.lastexecuted, "mceSetCSSClass", "Justify center action");

    $.deco.actionManager.actions["justify-right"].exec();
    equals(tinyMCE.lastexecuted, "mceSetCSSClass", "Justify right action");

    $.deco.actionManager.actions["justify-justify"].exec();
    equals(tinyMCE.lastexecuted, "mceSetCSSClass", "Justify justify action");

    // Create selected tile div
    $(document.body).append(
        $(document.createElement("div"))
            .addClass("deco-selected-tile")
    );

    $(".deco-selected-tile").addClass('deco-tile-align-right deco-tile-align-left')
    $.deco.actionManager.actions["tile-align-block"].exec();
    equals($(".deco-selected-tile").hasClass('deco-tile-align-right'), false, "Align right is removed after tile align block action");
    equals($(".deco-selected-tile").hasClass('deco-tile-align-left'), false, "Align left is removed after tile align block action");

    $(".deco-selected-tile").addClass('deco-tile-align-right')
    $.deco.actionManager.actions["tile-align-left"].exec();
    equals($(".deco-selected-tile").hasClass('deco-tile-align-right'), false, "Align right is removed after tile align left action");
    equals($(".deco-selected-tile").hasClass('deco-tile-align-left'), true, "Align left is added after tile align left action");

    $.deco.actionManager.actions["tile-align-right"].exec();
    equals($(".deco-selected-tile").hasClass('deco-tile-align-left'), false, "Align left is removed after tile align right action");
    equals($(".deco-selected-tile").hasClass('deco-tile-align-right'), true, "Align right is added after tile align right action");

    // Clean up
    $(".deco-selected-tile").remove();

    // Create save button and register event
    $(document.body).append(
        $(document.createElement("input"))
            .attr({
                id: "form-buttons-save",
                type: "button"
            })
            .click(function () {
                $(this).val('saved');
            })
    );
    $.deco.actionManager.actions["save"].exec();
    equals($("#form-buttons-save").val(), 'saved', "Test saving action");
    $("#form-buttons-save").remove();

    // Create cancel button and register event
    $(document.body).append(
        $(document.createElement("input"))
            .attr({
                id: "form-buttons-cancel",
                type: "button"
            })
            .click(function () {
                $(this).val('cancelled');
            })
    );
    $.deco.actionManager.actions["cancel"].exec();
    equals($("#form-buttons-cancel").val(), 'cancelled', "Test cancel action");
    $("#form-buttons-cancel").remove();

    $.deco.actionManager.actions["page-properties"].exec();
    equals($.deco.lastexecuted, "overlay.open", "Test page properties action");

    // We'll create a format menu
    $(document.body).append(
        $(document.createElement("select"))
            .addClass("formattest")
            .append(
                $(document.createElement("option"))
                    .attr("value", "strong")
                    .data("action", "strong")
            )
    );

    $.deco.actionManager.actions["format"].exec($(".formattest"));
    equals(tinyMCE.lastexecuted, "Bold", "Format action");

    // Cleanup
    $(".formattest").remove();

    // We'll create an insert menu
    $(document.body).append(
        $(document.createElement("select"))
            .addClass("inserttest")
            .append(
                $(document.createElement("option"))
                    .attr("value", "none")
            )
            .append(
                $(document.createElement("option"))
                    .attr("value", "text")
            )
            .append(
                $(document.createElement("option"))
                    .attr("value", "title")
            )
            .append(
                $(document.createElement("option"))
                    .attr("value", "pony")
            )
    );

    // Create selected tile
    $(document.body).append(
        $(document.createElement("div"))
            .addClass("deco-selected-tile")
    );

    var selectedtile = $(".deco-selected-tile");
    $.deco.options = {
        panels: $(document.body),
        tiles: [{
            'name': 'fields',
            'label': 'Fields',
            'tiles': [
                {
                    'name': 'title',
                    'type': 'field'
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

    equals($.deco.actionManager.actions["insert"].exec($(".inserttest")), false, "Test insert menu when none is selected.");

    // Set insert menu to text and exec insert again
    $(".inserttest").val("text");
    $.deco.actionManager.actions["insert"].exec($(".inserttest"));
    equals($.deco.lastexecuted, "addTile", "Test if addTile is called");
    equals($(".inserttest").val(), "none", "Test if menu is reset after insert of text tile");

    $(".inserttest").val("title");
    $.deco.actionManager.actions["insert"].exec($(".inserttest"));
    equals($.deco.lastexecuted, "addTile", "Test if addTile is called");
    equals($(".inserttest").val(), "none", "Test if menu is reset after insert of field tile");

    $(".inserttest").val("pony");
    $.deco.actionManager.actions["insert"].exec($(".inserttest"));
    equals($.deco.lastexecuted, "overlay.openIframe", "Test if openIframe is called");
    equals($(".inserttest").val(), "none", "Test if menu is reset after insert of app tile");

    // Cleanup
    $(".inserttest").remove();
    selectedtile.remove();
});

test("Shortcuts", function() {
    expect(2);

    var event = jQuery.Event("keypress");
    $(document).trigger(event);
    equals(tinyMCE.lastexecuted, "", "Test none existing shortcut.");

    event.ctrlKey = true;
    event.altKey = false;
    event.shiftKey = false;
    event.charCode = "B".charCodeAt(0);
    $(document).trigger(event);
    equals(tinyMCE.lastexecuted, "Bold", "Test strong shortcut.");
});
