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

test("Display notification", function() {
    expect(0);

    // Show notification
    $.deco.notify({
        title: 'foo',
        message: 'bar'
    });
});