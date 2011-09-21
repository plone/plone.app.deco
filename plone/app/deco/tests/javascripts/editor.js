module("editor", {
    setup: function () {
        $(document.body).append($('<div id="test">' +
            '<p id="line1">Some paragraph with text</p>' +
            '<p id="line2">Some more text</p>' +
            '</div>'));
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
    $.deco.applyFormat('h1', '', 'block');

    // Check if the tag is replaced
    equals($('#line1').get(0).tagName.toLowerCase(), 'h1', "Header format was applied");
    equals($('#line1').html(), 'Some paragraph with text', "Children were cloned");
});

test("Apply inline formatting", function() {
});

test("Apply block formatting with a classname", function() {
});

test("Apply inline formatting with a classname", function() {
});

test("Apply block formatting to a selection covering multiple block elements", function() {
});

test("Apply inline formatting to a selection covering multiple block elements", function() {
});

test("Apply inline formatting to a selection spanning partial elements", function() {
    // <p><b>some text</b> here</p>
});

