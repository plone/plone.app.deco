var DOM = tinymce.DOM;

tinymce.create('tinymce.themes.PloneTheme', {
    init : function(ed, url) {
        var t = this, s = ed.settings;
        t.editor = ed;
    },

    renderUI : function(o) {
        return {
            deltaHeight : 0
        };
    },

    getInfo : function() {
        return {
            longname : 'Plone theme',
            author : 'Four Digits',
            authorurl : 'http://www.fourdigits.nl',
            version : tinymce.majorVersion + "." + tinymce.minorVersion
        }
    }
});

tinymce.ThemeManager.add('plone', tinymce.themes.PloneTheme);
