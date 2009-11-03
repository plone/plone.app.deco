/**
 * This plugin is used to display a dialog
 *
 * @author Rob Gietema
 * @version 0.1
 */
;(function($) {

    // Define deco namespace if it doesn't exist
    if (typeof($.deco) == "undefined") {
        $.deco = {};
    }

    // Define the dialog namespace
    $.deco.dialog = {
    };

    /**
     * Create a new instance of a deco dialog.
     *
     * @constructor
     * @id jQuery.fn.decoDialog
     * @return {Object} Returns a jQuery object of the matched elements.
     */
    $.fn.decoDialog = function() {

        // Loop through matched elements
        return this.each(function() {

            // Get current object
            var obj = $(this);

            // Init dialog
            obj
                .hide()
                .css({
                    'width': '800px',
                    'left': (($(window).width() - 800) / 2)
                })
                .addClass("deco-dialog")

            // Add lightbox
            $(document.body).prepend($(document.createElement("div"))
                .addClass("deco-dialog-blocker")
            );

            // Clear actions
            $(".formFields").children("input").hide();
            $(".formFields")
                .append($(document.createElement("input"))
                    .attr({
                        'type': 'button',
                        'value': 'Ok'
                    })
                    .addClass('button-field context')
                    .click(function () {
                        $.deco.dialog.close();
                    })
                )
        });
    };

    /**
     * Open the dialog
     *
     * @id jQuery.deco.dialog.open
     * @param {String} mode Mode of the dialog
     * @param {Object} tile_config Configuration of the tile
     */
    $.deco.dialog.open = function(mode, tile_config) {

        // Get form
        var form = $(".deco-dialog").find("form");

        if (mode == 'all') {

            // Get form tabs
            var formtabs = form.find(".formTabs");

            // Show form tabs
            form.find(".formTab").removeClass('deco-hidden');

            // Show all fields
            form.find("fieldset").children().removeClass('deco-hidden');

            // Hide all fieldsets
            form.find('fieldset').addClass('hidden');

            // Deselect all tabs
            formtabs.find('a').removeClass('selected');

            // Remove first and last tab
            formtabs.children('.firstFormTab').removeClass('firstFormTab');
            formtabs.children('.lastFormTab').removeClass('lastFormTab');

            // Hide layout field
            form.find('#formfield-form-widgets-ILayout-layout').parent('.row').addClass('deco-hidden');

            // Hide field which are on the wysiwyg area
            var tile_group;
            for (var x = 0; x < $.deco.options.tiles.length; x++) {
                if ($.deco.options.tiles[x].name == 'fields') {
                    tile_group = $.deco.options.tiles[x];
                }
            }
            for (var x = 0; x < tile_group.tiles.length; x++) {
                var field_tile = tile_group.tiles[x];
                if ($.deco.options.panels.find(".deco-" + field_tile.name + "-tile").length != 0) {
                    $(document.getElementById(field_tile.id)).parent('.row').addClass('deco-hidden');
                }
            };

            // Hide tab if fieldset has no visible items
            form.find("fieldset").each(function () {
                if ($(this).children("div:not(.deco-hidden)").length == 0) {
                    $('a[href=#fieldsetlegend-' + $(this).attr('id').split('-')[1] + ']').parent().addClass('deco-hidden');
                }
            });

            // Get visible tabs
            var visible_tabs = formtabs.children(':not(.deco-hidden)');

            // Add first and last form tab
            visible_tabs.eq(0).addClass('firstFormTab');
            visible_tabs.eq(visible_tabs.length - 1).addClass('lastFormTab');

            // Select first tab
            visible_tabs.eq(0).children('a').addClass('selected');
            form.find('#fieldset-' + visible_tabs.eq(0).children('a').attr('href').split('-')[1]).removeClass('hidden');

        } else if (mode == 'field') {

            // Get fieldset and field
            var field = $("#" + tile_config.id);
            var fieldset = field.parents("fieldset");

            // Hide all fieldsets
            form.find('fieldset').addClass('hidden');

            // Show current fieldset
            fieldset.removeClass('hidden');

            // Hide all fields in current fieldset
            fieldset.children().addClass('deco-hidden');

            // Show current field
            field.parents(".row").removeClass('deco-hidden');

            // Hide form tabs
            form.find(".formTabs").addClass('deco-hidden');
        }
        $(".deco-dialog-blocker").show();
        var offset_top = parseInt($(".deco-dialog").css('top'));
        $(".deco-dialog")
            .css({'top': offset_top - 300})
            .show()
            .animate({'top': offset_top}, 300);
    };

    /**
     * Close the dialog
     *
     * @id jQuery.deco.dialog.close
     */
    $.deco.dialog.close = function() {
        $(".deco-dialog-blocker").hide();
        $(".deco-dialog").hide();
        $(".deco-iframe-dialog").remove();
    };

    /**
     * Open an iframe dialog
     *
     * @id jQuery.deco.dialog.openIframe
     * @param {String} url of the iframe
     */
    $.deco.dialog.openIframe = function(url) {

        $(".deco-dialog-blocker").show();
        
        $(document.body).append($(document.createElement("iframe"))
            .css({
                'position': 'absolute',
                'width': '800px',
                'height': '600px',
                'top': '0px',
                'z-index': '3000',
                'left': (($(window).width() - 800) / 2),
                'border': '0px'
            })
            .attr({
                'src': url
            })
            .addClass("deco-iframe-dialog")
        );
    };

})(jQuery);
