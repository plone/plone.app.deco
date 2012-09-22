/*global buster:false, assert: false */
"use strict";

buster.testCase("Namespace", {
    'namespace exists': function () {
        assert.defined($.deco);
    }
});

buster.testCase("Helper Methods", {
    setUp: function() {
        $(document.body).html('<div id="container"></div>');
    },

    tearDown: function() {
        $('#container').remove();
    },

//    'getTiles should call the callback on all tiles': function () {
//    }
});
