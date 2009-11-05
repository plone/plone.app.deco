// Create executed property
$.deco.executed = [];

// Create initActions stub function
$.deco.initActions = function () {
    $.deco.executed.push("initActions");
};

// Create initNotify stub function
$.deco.initNotify = function () {
    $.deco.executed.push("initNotify");
};

// Create decoDialog stub function
$.fn.decoDialog = function () {
    $.deco.executed.push("decoDialog");
};

// Create decoToolbar stub function
$.fn.decoToolbar = function() {
    $.deco.executed.push("decoToolbar");
};

// Create decoLayout stub function
$.fn.decoLayout = function() {
    $.deco.executed.push("decoLayout");
};

// Create ajax stub function
$.ajax = function (options) {
    options.success("{test: 1}");
};

module("core", {
    setup: function () {
        // We'll create a div element for the dialog
        $(document.body)
            .append(
                $(document.createElement("div"))
                    .attr("id", "region-content")
            );
        $(document.body)
            .append(
                $(document.createElement("div"))
                    .attr("id", "portal-column-one")
            );
        $(document.body)
            .append($(document.createElement("textarea"))
                .attr('id', 'form-widgets-ILayout-layout')
                .val('<html><div class="deco-panel" id="region-content">region-content text</div><div class="deco-panel" id="portal-column-one">portal-column-one text</div></html>')
            );
        $(document.body).append($(document.createElement("div")).attr("id", "content-views"));
        $(document.body).append($(document.createElement("div")).addClass("contentActions"));
        $(document.body).append($(document.createElement("div")).attr("id", "edit-bar"));

        // Empty executed
        $.deco.executed = [];
    },
    teardown: function () {
        $("#region-content").remove();
        $("#region-content-edit").remove();
        $("#portal-column-one").remove();
        $(".deco-toolbar").remove();
        $("#form-widgets-ILayout-layout").remove();
        $("#content-views").remove();
        $(".contentActions").remove();
        $("#edit-bar").remove();
        $(".deco-blur").removeClass("deco-blur");
    }
});

test("Initialisation", function() {
    expect(1);

    ok($.deco, "$.deco");
});

test("Init without data", function() {
    expect(4);

    // Empty data
    $("#form-widgets-ILayout-layout").val('');

    $.deco.init({url: 'http://nohost/test/edit'});
    equals($("#region-content").html(), "", 'Region content is still empty');
    equals($("#portal-column-one").html(), "", 'Portal column one is still empty');
    equals($.deco.executed.indexOf("initActions") != -1, true, 'Init actions is called');
    equals($.deco.executed.indexOf("initNotify") != -1, true, 'Init notify is called');
});

test("Init with data", function() {
    expect(16);

    $.deco.init({url: 'http://nohost/test/edit'});

    equals($("#region-content-edit").html(), "region-content text", 'Region content is populated');
    equals($("#portal-column-one").html(), "portal-column-one text", 'Portal column one is populated');

    equals($("#region-content-edit").hasClass('deco-panel'), true, 'Region content has deco-panel class');
    equals($("#portal-column-one").hasClass('deco-panel'), true, 'Portal column one has deco-panel class');

    equals($.deco.options.test, 1, 'Options are stored');
    equals($.deco.options.url, 'http://nohost/test', 'Url is stripped of /edit');

    equals($.deco.executed.indexOf("decoDialog") != -1, true, 'Dialog init is called');

    equals($(".deco-toolbar").length, 1, 'Toolbar div is added');

    equals($("#content-views:hidden").length, 1, 'Content views are hidden');
    equals($(".contentActions:hidden").length, 1, 'Content actions are hidden');
    equals($("#edit-bar:hidden").length, 1, 'Edit bar is hidden');

    equals($.deco.options.panels.length, 2, "Two panels are stored on the options");
    equals($.deco.options.toolbar.length, 1, "Toolbar is stored on the options");

    equals($.deco.executed.indexOf("decoToolbar") != -1, true, "Toolbar init is called");

    equals($(".deco-panel").hasClass('deco-blur'), false, "Panels are not blurred");
    equals($(".deco-toolbar").hasClass('deco-blur'), false, "Toolbar is not blurred");
});
