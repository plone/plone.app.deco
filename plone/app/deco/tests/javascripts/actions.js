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
            return 'custom exec';
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
    equals($.deco.actionManager.actions["advanced"].exec(), 'custom exec', "Add custom exec function");
    equals($.deco.actionManager.shortcuts.length, 1, "Shortcut is registered");
});

test("decoExecAction", function() {
    expect(1);

    // We'll create a div element first
    var div = $(document.createElement('div')).html('foo');

    // We'll register an action
    $.deco.registerAction("execaction", {

        exec: function () {
            div.html('bar');
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
        $(document.createElement('div'))
            .addClass('styletest')
            .append(
                $(document.createElement('span'))
                    .html('foo')
                    .addClass('Apple-style-span')
            )
    );

    // Clean up the html
    $.deco.fixWebkitSpan();
    equals($('.styletest').html(), "foo", "Remove webkit style spans");
});