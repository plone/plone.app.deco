module("editor", {
    setup: function () {
        $(document.body).append($('<div id="test">' +
            '<p id="line1">Some paragraph with text</p>' +
            '<p id="line2">Some more text</p>' +
            '</div>'));
        // Init editor
        tinyMCE.init({
                    mode : "exact",
                    elements : "test",
                    content_editable : true,
                    theme : "deco",
                    language_load : false
                });
        $.deco.document = window.document;  // Set document
    },
    teardown: function () {
        $('#test').remove();
    }
});

test("Apply block formatting", function() {
    expect(2);

    // Set selection within test paragraph
    $.textSelect('setRange', {
    	start : 5,
    	startElement : $('#line1'),
    	end : 14,
    	endElement : $('#line1')
    });
    
    // Set header tag
    tinyMCE.execCommand("FormatBlock", false, 'h1');

    // Check if the tag is replaced
    equals($('#line1').get(0).tagName.toLowerCase(), 'h1', "Header format was applied");
    equals($('#line1').html(), 'Some paragraph with text', "Children were cloned");
});

test("Apply inline formatting", function() {
    expect(1);

    // Set selection within test paragraph
    $.textSelect('setRange', {
        start : 5,
        startElement : $('#line1'),
        end : 14,
        endElement : $('#line1')
    });

    // Set header tag
    $.deco.applyFormat('string', '', 'inline');

    // Check if the tag is replaced
    equals($('#line1').html(), 'Some <strong>paragraph</strong> with text', "The strong tag was applied");
});

test("Apply block formatting with a classname", function() {
    ok(false, "not implemented");
});

test("Apply inline formatting with a classname", function() {
    ok(false, "not implemented");
});

test("Apply block formatting to a selection covering multiple block elements", function() {
    ok(false, "not implemented");
});

test("Apply inline formatting to a selection covering multiple block elements", function() {
    ok(false, "not implemented");
});

test("Apply inline formatting to a selection spanning partial elements", function() {
    // <p><b>some text</b> here</p>
    ok(false, "not implemented");
});

