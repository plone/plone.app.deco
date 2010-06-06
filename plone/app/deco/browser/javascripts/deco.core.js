/**
 * This plugin is used to define the deco namespace
 *
 * @author              Rob Gietema
 * @version             0.1
 */
;(function($) {

    // Create the deco namespace
    $.deco = {};

    /**
     * Initialize the Deco UI
     *
     * @id jQuery.deco.init
     * @param {Object} options Options used to initialize the UI
     */
    $.deco.init = function(options) {
        options = $.extend({
            url: document.location.href,
            type: '',
            ignore_context: false
        }, options);

        // Initialize modules
        $.deco.initActions();
        $.deco.initNotify();

        // Get the url of the page
        var match = options.url.match(/^(.*)\/edit/);
        if (match) {
            options.url = match[1];
        }

        // Chop add
        var match = options.url.match(/^(.*)\/\+\+add\+\+(.*)$/);
        if (match) {
            options.url = match[1];
            options.type = match[2];
            options.ignore_context = true;
        }

        // Get the configuration from the backend
        $.ajax({
            type: "GET",
            url: options.url + "/@@deco-config" + (options.type == '' ? '' : "?type=" + options.type),
            success: function(configdata) {

                // Add global options
                $.deco.options = configdata;
                $.deco.options.url = options.url;
                $.deco.options.ignore_context = options.ignore_context;
                $.deco.options.tileheadelements = [];

                var content = $('#form-widgets-ILayout-content').val();

                // Check if no layout
                if (content == '') {

                    // Exit
                    return;
                }

                // Get dom tree
                content = $.deco.getDomTreeFromHtml (content);

                // Find panels
                content.find("link[rel=panel]").each(function () {
                    var target = $(this).attr("target");
                    var rev = $(this).attr("rev");

                    // If content, create a new div since the form data is in this panel
                    if (target == 'content') {
                        $("#content").before($(document.createElement("div"))
                            .attr("id", "content-edit")
                        );
                        target += '-edit';
                    }
                    $("#" + target).addClass('deco-panel');
                    $("#" + target).html(content.find("#" + rev).html());
                });

                // Init app tiles
                content.find("link[rel=tile]").each(function () {
                    var target = $(this).attr("target");
                    var href = $(this).attr("href");

                    // Get tile type
                    var tile_content = $('#' + target).parent();
                    var tiletype = '';
                    var classes = tile_content.parents('.deco-tile').attr('class').split(" ");
                    $(classes).each(function() {
                        var classname = this.match(/^deco-(.*)-tile$/);
                        if (classname != null) {
                            if ((classname[1] != 'selected') && (classname[1] != 'new') && (classname[1] != 'read-only') && (classname[1] != 'helper') && (classname[1] != 'original')) {
                                tiletype = classname[1];
                            }
                        }
                    });

                    // Get tile config
                    var tile_config;
                    for (var x = 0; x < $.deco.options.tiles.length; x++) {
                        var tile_group = $.deco.options.tiles[x];
                        for (var y = 0; y < tile_group.tiles.length; y++) {
                            if (tile_group.tiles[y].name == tiletype) {
                                tile_config = tile_group.tiles[y];
                            }
                        }
                    }

                    // Check if a field tile
                    if (tile_config.type == 'field') {

                        var fieldhtml = '';

                        switch (tile_config.widget) {
                            case "TextFieldWidget":
                                fieldhtml = '<' + tile_config.tag + '>' + $("#" + tile_config.id).find('input').attr('value') + '</' + tile_config.tag + '>';;
                                break;
                            case "TextAreaFieldWidget":
                                var lines = $("#" + tile_config.id).find('textarea').attr('value').split('\n');
                                for (var i = 0; i < lines.length; i++) {
                                    fieldhtml += '<' + tile_config.tag + '>' + lines[i] + '</' + tile_config.tag + '>';
                                }
                                break;
                            case "WysiwygFieldWidget":
                                fieldhtml = $("#" + tile_config.id).find('textarea').attr('value');
                                break;
                            default:
                                fieldhtml = '<span class="discreet">Placeholder for field:<br/><b>' + tile_config.label + '</b></span>';
                                break;
                        }
                        tile_content.html(fieldhtml);

                    // Get data from app tile
                    } else {
                        $.ajax({
                            type: "GET",
                            url: href + (tile_config.name == 'plone.app.standardtiles.title' || tile_config.name == 'plone.app.standardtiles.description' ? '?ignore_context=' + $.deco.options.ignore_context : ''),
                            success: function(value) {

                                // Get dom tree
                                value = $.deco.getDomTreeFromHtml (value);

                                // Add head tags
                                $.deco.addHeadTags(href, value);

                                tile_content.html('<span class="hiddenStructure tileUrl">' + href + '</span>' + value.find('.temp_body_tag').html());
                            }
                        });
                    }
                });

                // Init dialog
                $('#content').decoDialog();

                // Add toolbar div below content view and hide content view/contentActions
                $("#content-edit").before($(document.createElement("div"))
                    .addClass("deco-toolbar")
                );
                $("#content-views").hide();
                $(".contentActions").hide();
                $("#edit-bar").hide();

                // Add panel and toolbar to the options
                $.deco.options.panels = $(".deco-panel");
                $.deco.options.toolbar = $(".deco-toolbar");

                // Add page url to the options
                $.deco.options.url = options.url;

                // Init toolbar
                $.deco.options.toolbar.decoToolbar();

                // Init panel
                $.deco.options.panels.decoLayout();

                // Add blur to the rest of the content
                $("*").each(function() {

                    var obj = $(this);

                    // Check if block element
                    if (obj.css('display') == 'block') {

                        // Check if panel or toolbar
                        if (!obj.hasClass('deco-panel') && !obj.hasClass('deco-toolbar') && !obj.hasClass('deco-notifications')) {

                            // Check if inside panel or toolbar
                            if (obj.parents('.deco-panel, .deco-toolbar').length == 0) {

                                // Check if parent of a panel or toolbar
                                if (obj.find('.deco-panel, .deco-toolbar').length == 0) {

                                    // Check if parent has a child who is a panel or a toolbar
                                    if (obj.parent().find('.deco-panel, .deco-toolbar').length != 0) {

                                        // Add blur class
                                        obj.addClass('deco-blur');
                                    }
                                }
                            }
                        }
                    }
                });

                // Init upload
                $.deco.initUpload();
            }
        });
    };

    /**
     * Get the dom tree of the specified content
     *
     * @id jQuery.deco.getDomTreeFromHtml
     * @param {String} content Html content
     * @return {Object} Dom tree of the html
     */
    $.deco.getDomTreeFromHtml = function (content) {

        // Remove doctype and replace html, head and body tag since the are stripped when converting to jQuery object
        content = content.replace(/<!DOCTYPE[^>]+>/, '');
        content = content.replace(/<html/, "<div class=\"temp_html_tag\"");
        content = content.replace(/<\/html/, "</div");
        content = content.replace(/<head/, "<div class=\"temp_head_tag\"");
        content = content.replace(/<\/head/, "</div");
        content = content.replace(/<body/, "<div class=\"temp_body_tag\"");
        content = content.replace(/<\/body/, "</div");
        return $($(content)[0]);
    };

    /**
     * Remove head tags based on tile url
     *
     * @id jQuery.deco.removeHeadTags
     * @param {String} url Url of the tile
     */
    $.deco.removeHeadTags = function (url) {

        // Calc delete url
        url = url.split('?')[0];
        url = url.split('@@');
        var tile_type_id = url[1].split('/');
        url = url[0] + '@@delete-tile?type=' + tile_type_id[0] + '&id=' + tile_type_id[1] + '&confirm=true';
        var html_id = tile_type_id[0].replace(/\./g, '-') + '-' + tile_type_id[1];

        // Remove head elements
        var headelements = $.deco.options.tileheadelements[html_id];
        for (var i = 0; i < headelements.length; i++) {
            $(headelements[i]).remove();
        }
        $.deco.options.tileheadelements[html_id] = [];
    }

    /**
     * Add head tags based on tile url and dom
     *
     * @id jQuery.deco.addHeadTags
     * @param {String} url Url of the tile
     * @param {Object} dom Dom object of the tile
     */
    $.deco.addHeadTags = function (url, dom) {

        // Calc url
        url = url.split('?')[0];
        url = url.split('@@');
        var tile_type_id = url[1].split('/');
        var html_id = tile_type_id[0].replace(/\./g, '-') + '-' + tile_type_id[1];
        $.deco.options.tileheadelements[html_id] = [];

        // Get head items
        dom.find(".temp_head_tag").children().each(function () {

            // Add element
            $.deco.options.tileheadelements[html_id].push(this);

            // Add head elements
            $('head').append(this);
        });
    };

//#JSCOVERAGE_IF 0

    // Init Deco on load
    $(window).load(function () {

        // Check if layout exists
        if ($('#form-widgets-ILayout-content').length > 0) {

            // Init Deco
            $.deco.init();
        }

        // Check if tiledata is available and valid
        if (typeof(tiledata) !== 'undefined') {

            // Check action
            if (tiledata.action == 'cancel') {

                // Close dialog
                window.parent.jQuery.deco.dialog.close();

            } else if (tiledata.action == 'save') {

                // Check mode
                if (tiledata.mode == 'add') {

                    // Check url
                    if (typeof(tiledata.url) !== 'undefined') {

                        // Insert app tile
                        window.parent.jQuery.deco.addAppTile(tiledata.type, tiledata.url, tiledata.id);
                    }
                } else {

                    // Update app tile
                    window.parent.jQuery.deco.editAppTile(tiledata.url);
                }
            }
        }
    });

//#JSCOVERAGE_ENDIF

})(jQuery);
