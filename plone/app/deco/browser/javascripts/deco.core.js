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
        }, options);

        // Get the url of the page
        var url = document.location.href;
        var match = url.match(/^(.*)\/edit/)
        if (match) {
            url = match[1];
        }

        // Get the configuration from the backend
        $.ajax({
            type: "GET",
            url: url + "/@@deco-config",
            success: function(configdata) {

                // Get the config data
                configdata = eval("(" + configdata + ")");

                // Add global options
                $.deco.options = configdata;

                var content = $('#form-widgets-ILayout-layout').attr('value');

                // Remove doctype and replace html, head and body tag since the are stripped when converting to jQuery object
                content = content.replace(/<!DOCTYPE[^>]+>/, '');
                content = content.replace(/<html/, "<div");
                content = content.replace(/<\/html/, "</div");
                content = content.replace(/<head/, "<div");
                content = content.replace(/<\/head/, "</div");
                content = content.replace(/<body/, "<div");
                content = content.replace(/<\/body/, "</div");
                content = $($(content)[0]);

                // Find panels
                content.find(".deco-panel").each(function () {
                    var id = $(this).attr("id");

                    // If region content, create a new div since the form data is in this panel
                    if (id == 'region-content') {
                        $("#region-content").before($(document.createElement("div"))
                            .attr("id", "region-content-edit")
                        );
                        id += '-edit';
                    }
                    $("#" + id).addClass('deco-panel');
                    $("#" + id).html($(this).html());
                });

                // Init dialog
                $('#region-content').decoDialog();

                // Add toolbar div below content view and hide content view/contentActions
                $("#region-content-edit").before($(document.createElement("div"))
                    .addClass("deco-toolbar")
                );
                $("#content-views").hide();
                $(".contentActions").hide();

                // Add panel and toolbar to the options
                $.deco.options.panels = $(".deco-panel");
                $.deco.options.toolbar = $(".deco-toolbar");

                // Add page url to the options
                $.deco.options.url = url;

                // Init toolbar
                $.deco.options.toolbar.decoToolbar();

                // Init panel
                $.deco.options.panels.decoLayout();

                // Add blur to the rest of the content
                $(document.body).addClass("deco-blur");
            }
        });
    };

    /**
     * Uninitialize the Deco UI
     *
     * @id jQuery.deco.uninit
     */
    $.deco.uninit = function() {

        // Deinit the toolbar
        $.deco.options.toolbar.decoToolbar.uninit();

        // Check if content is initialized
        if ($.deco.options.content) {

            // Deinit the layout
            $.deco.options.panels.decoLayout.uninit();
        }
    };
})(jQuery);
