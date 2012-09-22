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

    'Styles should be restored when a tile is shown and hidden': function () {
        var tile = new $.deco.Tile($('#tile'));
        $('#tile').css('color', 'black');
        tile.show();
        assert.equals(tile._originalStyles, 'color: black;');
        tile.hide();
        assert.match($('#tile').attr('style'), 'color: black');
    },

    'When a tile is shown it should have a move cursor': function () {
        var tile = new $.deco.Tile($('#tile'));
        tile.show();
        assert.equals($('#tile').css('cursor'), 'move');
        tile.hide();
        assert.match($('#tile').attr('style'), 'cursor: inherit');
    },

    'When a tile is shown it should call the show handler': function () {
        var tile = new $.deco.Tile($('#tile'));
        tile.tile.show = tile.tile.show || this.spy();
        tile.show();
        assert(tile.tile.show.called);
    },

    'When a tile is hidden it should call the hide handler': function () {
        var tile = new $.deco.Tile($('#tile'));
        tile.tile.hide = tile.tile.hide || this.spy();
        tile.hide();
        assert(tile.tile.hide.called);
    },

    'Check if events are fired when showing a tile': function () {
        var tile = new $.deco.Tile($('#tile'));
        var show = this.stub();
        var shown = this.stub();
        $(document).bind('deco.tile.show', show);
        $(document).bind('deco.tile.shown', shown);
        tile.show();
        assert(show.called);
        assert(shown.called);
    }
});
