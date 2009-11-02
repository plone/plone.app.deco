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
