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

buster.testCase("Tile", {
    setUp: function() {
        $(document.body).html('<div id="tile"></div>');
    },

    tearDown: function() {
        $('#tile').remove();
    },

    'Create a Tile': function () {
        $.plone = $.plone || {};
        $.plone.tiletype = $.plone.tiletype || {};
        $.plone.tiletype.get = $.plone.tiletype.get || function () {
            return function () {};
        };

        var tile = new $.deco.Tile($('#tile'));
        assert.defined(tile.tile);
        assert.defined(tile.tile.type);
        assert.equals(tile.tile.type, {});
        assert.equals(tile.el, $('#tile'));
    },

    'Create a Tile with data-tile attribute': function () {
        $.fn.ploneTile = $.fn.ploneTile || this.spy();
        $('#tile').html('<div data-tile="test"></div>');
        var tile = new $.deco.Tile($('#tile'));
        assert($.fn.ploneTile.called);
        assert.equals(tile.el, $('#tile'));
    }
});
