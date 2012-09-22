/*global buster:false, assert: false */
"use strict";

buster.testCase("Core tests", {
    'namespace exists': function () {
        assert.defined($.deco);
    }
});
