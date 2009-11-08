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
                $.deco.addTile('upload', '<img src="++resource++plone.app.deco.images/files.png" border="0" />');
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

                // Check filetypes
                var first = true;
                for (var i = 0; i < files.length; i++) {

                    // Get file
                    var file = files.item(i);

                    // Check if supported mimetype
                    if (file.mediaType.indexOf('image') == 0) {

                        // Check if first supported
                        if (first) {

                            // Set tile type
                            $(".deco-selected-tile").removeClass("deco-upload-tile");
                            $(".deco-selected-tile").addClass("deco-image-tile");

                            // Set image
                            var img = $(".deco-selected-tile").children(".deco-tile-content").children("img")
                            img.get(0).src = file.getAsDataURL();
                            img.css('opacity', 0.5);

                            // Set first to false
                            first = false;
                        } else {

                            // Todo
                        }
                    } else {
                        $.deco.notify({
                            type: "warning",
                            title: "Warning",
                            message: "The filetype of file " + file.fileName + " is unsupported"
                        });
                    }
                }

                // Remove tile if no supported filetypes
                if (first) {
                    $(".deco-selected-tile").find(".deco-close-icon").trigger("click");
                }
            },
            false
        );
    };
})(jQuery);
