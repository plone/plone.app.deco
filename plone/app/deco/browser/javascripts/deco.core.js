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
            type: ''
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
        }

        // Get the configuration from the backend
        $.ajax({
            type: "GET",
            url: options.url + "/@@deco-config" + (options.type == '' ? '' : "?type=" + options.type),
            success: function(configdata) {

                // Get the config data
                configdata = eval("(" + configdata + ")");

                // Add global options
                $.deco.options = configdata;
                $.deco.options.url = options.url;
                $.deco.options.tileheadelements = [];

                var content = $('#form-widgets-ILayout-layout').val();

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

                    // If region content, create a new div since the form data is in this panel
                    if (target == 'region-content') {
                        $("#region-content").before($(document.createElement("div"))
                            .attr("id", "region-content-edit")
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

                    $.ajax({
                        type: "GET",
                        url: href,
                        success: function(value) {

                            // Get dom tree
                            value = $.deco.getDomTreeFromHtml (value);

                            // Add head tags
                            $.deco.addHeadTags(href, value);

                            // Update tile
                            $('#' + target).parent().html('<span class="hiddenStructure tileUrl">' + href + '</span>' + value.find('.temp_body_tag').html());
                        }
                    });
                });

                // Init dialog
                $('#region-content').decoDialog();

                // Add toolbar div below content view and hide content view/contentActions
                $("#region-content-edit").before($(document.createElement("div"))
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
     * Remove head tags based on tile url
     *
     * @id jQuery.deco.removeHeadTags
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
        if ($('#form-widgets-ILayout-layout').length > 0) {

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
