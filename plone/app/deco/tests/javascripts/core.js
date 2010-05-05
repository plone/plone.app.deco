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

// Create initUpload stub function
$.deco.initUpload = function () {
    $.deco.executed.push("initUpload");
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
                    .attr("id", "content")
            );
        $(document.body)
            .append(
                $(document.createElement("div"))
                    .attr("id", "portal-column-one")
            );
        $(document.body)
            .append($(document.createElement("textarea"))
                .attr('id', 'form-widgets-ILayout-content')
                .val('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"><head><link rel="layout" href="./@@test-layout" /><link rel="panel" rev="content" target="content" /><link rel="panel" rev="portal-column-one" target="portal-column-one" /></head><body><div class="deco-panel" id="content">content text</div><div class="deco-panel" id="portal-column-one">portal-column-one text</div></body></html>')
            );
        $(document.body).append($(document.createElement("div")).attr("id", "content-views"));
        $(document.body).append($(document.createElement("div")).addClass("contentActions"));
        $(document.body).append($(document.createElement("div")).attr("id", "edit-bar"));

        // Empty executed
        $.deco.executed = [];
    },
    teardown: function () {
        $("#content").remove();
        $("#content-edit").remove();
        $("#portal-column-one").remove();
        $(".deco-toolbar").remove();
        $("#form-widgets-ILayout-content").remove();
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
    $("#form-widgets-ILayout-content").val('');

    $.deco.init({url: 'http://nohost/test/edit'});
    equals($("#content").html(), "", 'Region content is still empty');
    equals($("#portal-column-one").html(), "", 'Portal column one is still empty');
    equals($.deco.executed.indexOf("initActions") != -1, true, 'Init actions is called');
    equals($.deco.executed.indexOf("initNotify") != -1, true, 'Init notify is called');
});

test("Init with data", function() {
    expect(17);

    $.deco.init({url: 'http://nohost/test/edit'});

    equals($("#content-edit").html(), "content text", 'Region content is populated');
    equals($("#portal-column-one").html(), "portal-column-one text", 'Portal column one is populated');

    equals($("#content-edit").hasClass('deco-panel'), true, 'Region content has deco-panel class');
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

    equals($.deco.executed.indexOf("initUpload") != -1, true, 'Init upload is called');
});

test("Add/remove head tags", function() {
    expect(2);

    // Add head tag
    $.deco.addHeadTags('http://nohost/site/@@example.deco.pony/tile-1', $.deco.getDomTreeFromHtml('<html><head><link href="test.css" media="screen" type="text/css" rel="stylesheet"/></head></html>'));
    equals($("head link[href=test.css]").length, 1, 'Stylesheet is added to the head');

    // Remove head tag
    $.deco.removeHeadTags('http://nohost/site/@@example.deco.pony/tile-1');
    equals($("head link[href=test.css]").length, 0, 'Stylesheet is removed from the head');
});
