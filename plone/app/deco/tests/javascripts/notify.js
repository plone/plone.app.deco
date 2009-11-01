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
    equals($(".deco-notifications").length, 1, "Notifications div was added");
});

test("Display notification", function() {
    expect(4);

    // Show notification
    $.deco.notify({
        title: "notificationtest",
        message: "bar",
        fadeSpeed: 0,
        duration: 0
    });
    var notificationtest = $(".deco-notifications > div");

    equals(notificationtest.length, 1, "Notification was added");
    equals(notificationtest.find(".deco-notification-type").hasClass("deco-notification-type-info"), true, "Type of the notification is set");
    equals(notificationtest.find(".deco-notification-title").html(), "notificationtest", "Title of the notification is set");
    equals(notificationtest.find(".deco-notification-message").html(), "bar", "Title of the notification is set");
});

test("Click close", function() {
    expect(1);
    stop();

    // Show notification
    $.deco.notify({
        title: "closetest",
        message: "bar",
        fadeSpeed: 0,
        duration: 1000
    });
    var closetest = $(".deco-notifications > div:last");

    // Click the close button
    closetest.find(".deco-notification-close").trigger("click");

    // Add a small delay so the window can be fadeout
    window.setTimeout(function () {
        equals($(".deco-notifications").html().indexOf('closetest'), -1, "Notification was removed after close button is pressed");
        start();
    }, 10)
});

test("Mouseover", function() {
    expect(2);
    stop();
    // Show notification
    $.deco.notify({
        title: "mousetest",
        message: "bar",
        fadeSpeed: 0,
        duration: 10
    });
    var notification = $(".deco-notifications > div:last");

    // Click the close button
    notification.trigger("mouseover");

    // Add a small delay so the window can be fadein
    equals(notification.data("mouseover"), true, "Mouseover event is handled");


    // Add a small delay so the window can be fadein
    window.setTimeout(function () {

        // Trigger mouse leave
        notification.trigger("mouseleave");
        equals($(".deco-notifications").html().indexOf('mousetest'), -1, "Notification was removed after mouseleave");
        start();
    }, 20);
});