module("notify", {
    setup: function () {
    },
    teardown: function () {
    }
});

test("Initialisation", function() {
    expect(1);

    // Initialise
    $.deco.initNotify();
    equals($(".deco-notifications").length, 1, "Notification div was added")
});
