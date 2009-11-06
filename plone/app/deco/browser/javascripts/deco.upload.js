/**
 * This plugin is used to upload files and images.
 *
 * @author Rob Gietema
 * @version 0.1
 */
;(function($) {

    // Define deco namespace if it doesn't exist
    if (typeof($.deco) == "undefined") {
        $.deco = {};
    }

    /**
     * Initialize the upload module
     *
     * @id jQuery.deco.initUpload
     */
    $.deco.initUpload = function() {

        // Bind dragover
        $(".deco-panel").bind("dragover", function (e) {

            // Check if drag not already loaded
            if ($(".deco-panel-dragging").length == 0) {

                // Deselect tiles
                $(".deco-selected-tile")
                    .removeClass("deco-selected-tile")
                    .children(".deco-tile-content").blur();

                // Set actions
                $.deco.options.toolbar.trigger("selectedtilechange");
                $.deco.options.panels.decoSetResizeHandleLocation();

                // Add dummy tile
                $.deco.addTile('upload', 'hoeba');
            }
        });

        //$(".deco-panel").bind(
        document.addEventListener(
            "drop",
            function (event) {
                var dt = event.dataTransfer;
                files = dt.files;

                // Prevent default actions
                event.stopPropagation();
                event.preventDefault();

                // Drop tile
                $(document).trigger("mousedown");
            },
            false
        );
    };
})(jQuery);
