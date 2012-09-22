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
    },

    'Check if events are fired when hiding a tile': function () {
        var tile = new $.deco.Tile($('#tile'));
        var hide = this.stub();
        var hidden = this.stub();
        $(document).bind('deco.tile.hide', hide);
        $(document).bind('deco.tile.hidden', hidden);
        tile.hide();
        assert(hide.called);
        assert(hidden.called);
    }

    // TODO: tests for dragstart, drag, dragend
});

buster.testCase("Column", {
    setUp: function() {
        $(document.body).html('<div id="column"></div>');
        $.plone = $.plone || {};
        $.plone.tiletype = $.plone.tiletype || {};
        $.plone.tiletype.get = $.plone.tiletype.get || function () {
            return function () {};
        };
    },

    tearDown: function() {
        $('#column').remove();
    },

    'Create a Column': function () {
        var column = new $.deco.Column($('#column'));
        assert.equals(column.el, $('#column'));
    },

    'Drop event should be bound to a visible Column': function () {
        this.stub($.deco, "dropTile");
        var column = new $.deco.Column($('#column'));
        column.show();
        column.el.trigger('drop');
        assert($.deco.dropTile.called);
        column.hide();
        column.el.trigger('drop');
        assert($.deco.dropTile.calledOnce);
    },

    'All tiles in column should be shown when column is shown': function () {
        $('#column').html('<div class="deco-tile"></div>');
        var column = new $.deco.Column($('#column'));
        var show = this.stub();
        $(document).bind('deco.tile.show', show);
        column.show();
        assert(show.called);
    },

    'All tiles in column should be hidden when column is hidden': function () {
        $('#column').html('<div class="deco-tile"></div>');
        var column = new $.deco.Column($('#column'));
        var hide = this.stub();
        $(document).bind('deco.tile.hide', hide);
        column.hide();
        assert(hide.called);
    },

    'Check if events are fired when showing a column': function () {
        var column = new $.deco.Column($('#column'));
        var show = this.stub();
        var shown = this.stub();
        $(document).bind('deco.column.show', show);
        $(document).bind('deco.column.shown', shown);
        column.show();
        assert(show.called);
        assert(shown.called);
    },

    'Check if events are fired when hiding a column': function () {
        var column = new $.deco.Column($('#column'));
        var hide = this.stub();
        var hidden = this.stub();
        $(document).bind('deco.column.hide', hide);
        $(document).bind('deco.column.hidden', hidden);
        column.hide();
        assert(hide.called);
        assert(hidden.called);
    }
});

buster.testCase("Row", {
    setUp: function() {
        $(document.body).html('<div id="row"></div>');
    },

    tearDown: function() {
        $('#row').remove();
    },

    'Create a Row': function () {
        var row = new $.deco.Row($('#row'));
        assert.equals(row.el, $('#row'));
    },

    'All columns in a row should be shown when row is shown': function () {
        $('#row').html('<div class="deco-column"></div>');
        var row = new $.deco.Row($('#row'));
        var show = this.stub();
        $(document).bind('deco.column.show', show);
        row.show();
        assert(show.called);
    },

    'All columns in a row should be hidden when row is hidden': function () {
        $('#row').html('<div class="deco-column"></div>');
        var row = new $.deco.Row($('#row'));
        var hide = this.stub();
        $(document).bind('deco.column.hide', hide);
        row.hide();
        assert(hide.called);
    },

    'Check if events are fired when showing a row': function () {
        var row = new $.deco.Row($('#row'));
        var show = this.stub();
        var shown = this.stub();
        $(document).bind('deco.row.show', show);
        $(document).bind('deco.row.shown', shown);
        row.show();
        assert(show.called);
        assert(shown.called);
    },

    'Check if events are fired when hiding a row': function () {
        var row = new $.deco.Row($('#row'));
        var hide = this.stub();
        var hidden = this.stub();
        $(document).bind('deco.row.hide', hide);
        $(document).bind('deco.row.hidden', hidden);
        row.hide();
        assert(hide.called);
        assert(hidden.called);
    }
});

buster.testCase("Panel", {
    setUp: function() {
        $(document.body).html('<div id="panel"></div>');
    },

    tearDown: function() {
        $('#panel').remove();
    },

    'Create a Panel': function () {
        var panel = new $.deco.Panel($('#panel'));
        assert.equals(panel.el, $('#panel'));
    },

    'When a panel is shown it should have the editing class': function () {
        var panel = new $.deco.Panel($('#panel'));
        assert.equals(panel.el.hasClass('deco-editing'), false);
        panel.show();
        assert(panel.el.hasClass('deco-editing'));
        panel.hide();
        assert.equals(panel.el.hasClass('deco-editing'), false);
    },

    'All rows in a panel should be shown when panel is shown': function () {
        $('#panel').html('<div class="deco-row"></div>');
        var panel = new $.deco.Panel($('#panel'));
        var show = this.stub();
        $(document).bind('deco.row.show', show);
        panel.show();
        assert(show.called);
    },

    'All rows in a panel should be hidden when panel is hidden': function () {
        $('#panel').html('<div class="deco-row"></div>');
        var panel = new $.deco.Row($('#panel'));
        var hide = this.stub();
        $(document).bind('deco.row.hide', hide);
        panel.hide();
        assert(hide.called);
    },

    'Check if events are fired when showing a panel': function () {
        var panel = new $.deco.Panel($('#panel'));
        var show = this.stub();
        var shown = this.stub();
        $(document).bind('deco.panel.show', show);
        $(document).bind('deco.panel.shown', shown);
        panel.show();
        assert(show.called);
        assert(shown.called);
    },

    'Check if events are fired when hiding a panel': function () {
        var panel = new $.deco.Panel($('#panel'));
        var hide = this.stub();
        var hidden = this.stub();
        $(document).bind('deco.panel.hide', hide);
        $(document).bind('deco.panel.hidden', hidden);
        panel.hide();
        assert(hide.called);
        assert(hidden.called);
    }
});

buster.testCase("Toolbar", {
    setUp: function() {
        $.plone = $.plone || {};
        $.plone.toolbar = this.stub();
        $.plone.toolbar.iframe_stretch = this.stub();
        $.plone.toolbar.iframe_shrink = this.stub();
        $.plone.toolbar.iframe_state = this.stub();
        $.plone.toolbar.iframe_state.height = this.stub();
        $.plone.toolbar.iframe_state.height.returns(20);
        $(document.body)
            .html('<div id="toolbar"></div><div data-panel=""></div>');
    },

    tearDown: function() {
        $('#toolbar').remove();
    },

    'Create a Toolbar': function () {
        var toolbar = new $.deco.Toolbar($('#toolbar'));
        assert.equals(toolbar.el, $('#toolbar'));
    },

    'When the toolbar is shown it should have the editing class': function () {
        var toolbar = new $.deco.Toolbar($('#toolbar'));
        assert.equals($('body').hasClass('deco-toolbar'), false);
        toolbar.show();
        assert($('body').hasClass('deco-toolbar-editing'));
        toolbar.hide();
        assert.equals($('body').hasClass('deco-editing'), false);
    },

    'All types should be shown when toolbar is shown': function () {
        $('#toolbar').html('<div class="plone-tiletype"></div>');
        var toolbar = new $.deco.Toolbar($('#toolbar'));
        var show = this.stub();
        $(document).bind('deco.tile.show', show);
        toolbar.show();
        assert(show.called);
    },

    'All types should be hidden when toolbar is hidden': function () {
        $('#toolbar').html('<div class="plone-tiletype"></div>');
        var toolbar = new $.deco.Toolbar($('#toolbar'));
        var hide = this.stub();
        $(document).bind('deco.tile.hide', hide);
        toolbar.hide();
        assert(hide.called);
    },

    'All panels should be shown when toolbar is shown': function () {
        var toolbar = new $.deco.Toolbar($('#toolbar'));
        var show = this.stub();
        $(document).bind('deco.panel.show', show);
        window.parent = this.stub().returns(window);
        toolbar.show();
        assert(show.called);
    },

    'All panels should be hidden when toolbar is hidden': function () {
        var toolbar = new $.deco.Toolbar($('#toolbar'));
        var hide = this.stub();
        $(document).bind('deco.panel.hide', hide);
        window.parent = this.stub().returns(window);
        toolbar.hide();
        assert(hide.called);
    },

    'Check if events are fired when showing the toolbar': function () {
        var toolbar = new $.deco.Toolbar($('#toolbar'));
        var show = this.stub();
        var shown = this.stub();
        $(document).bind('deco.toolbar.show', show);
        $(document).bind('deco.toolbar.shown', shown);
        toolbar.show();
        assert(show.called);
        assert(shown.called);
    },

    'Check if events are fired when hiding the toolbar': function () {
        var toolbar = new $.deco.Toolbar($('#toolbar'));
        var hide = this.stub();
        var hidden = this.stub();
        $(document).bind('deco.toolbar.hide', hide);
        $(document).bind('deco.toolbar.hidden', hidden);
        toolbar.hide();
        assert(hide.called);
        assert(hidden.called);
    },

    'Check the toggle method for toolbar': function () {
        var toolbar = new $.deco.Toolbar($('#toolbar'));
        toolbar.toggle();
        assert.equals(toolbar._hidden, false);
        toolbar.toggle();
        assert(toolbar._hidden);
    }
});


