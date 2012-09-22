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
        $.plone = $.plone || {};
        $.plone.tiletype = $.plone.tiletype || {};
        $.plone.tiletype.get = $.plone.tiletype.get || function () {
            return function () {};
        };
        $.fn.ploneTile = $.fn.ploneTile || this.spy();
    },

    tearDown: function() {
        $('#tile').remove();
    },

    'Create a Tile': function () {
        var tile = new $.deco.Tile($('#tile'));
        assert.defined(tile.tile);
        assert.defined(tile.tile.type);
        assert.equals(tile.tile.type, {});
        assert.equals(tile.el, $('#tile'));
    },

    'Create a Tile with data-tile attribute': function () {
        $('#tile').html('<div data-tile="test"></div>');
        var tile = new $.deco.Tile($('#tile'));
        assert($.fn.ploneTile.called);
        assert.equals(tile.el, $('#tile'));
    },

    'When a tile is shown all styles should be saved': function () {
        var tile = new $.deco.Tile($('#tile'));
        $('#tile').css('color', 'black');
        tile.show();
        assert.equals(tile._originalStyles, 'color: black;');
    }
});
