module("actions", {
    setup: function () {
    },
    teardown: function () {
    }
});

test("Basic requirements", function() {
    expect(4)

    ok($.deco, "$.deco");
    ok($.deco.actionManager, "$.deco.actionManager");
    ok($.deco.actionManager.actions, "$.deco.actionManager.actions");
    ok($.deco.actionManager.shortcuts, "$.deco.actionsManager.shortcuts");
});

test("registerAction", function() {
    expect(6)

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
    expect(28);

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


});
