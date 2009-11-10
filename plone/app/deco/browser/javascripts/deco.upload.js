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
                $.deco.addTile('image', '<img src="++resource++plone.app.deco.images/files.png" border="0" />');
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

                        // New image
                        var img;

                        // Check if first
                        if (first) {

                            // Set image
                            img = $(".deco-selected-tile").children(".deco-tile-content").children("img")

                            // Set first to false
                            first = false;

                        // Not the first
                        } else {

                            // Create new tile
                            var newtile = $(document.createElement("div"))
                                    .addClass("movable removable deco-tile deco-image-tile")
                                    .append($(document.createElement("div"))
                                        .addClass("deco-tile-content")
                                        .append($(document.createElement("img"))
                                            .attr("border", 0)
                                        )
                                    )
                            // Insert new tile
                            $(".deco-selected-tile").after(newtile);
                            newtile.decoInitTile();

                            // Get image object
                            img = newtile.children(".deco-tile-content").children("img");
                        }

                        // Set image values
                        img.get(0).src = file.getAsDataURL();
                        img.css('opacity', 0.5);

                        // Create new ajax request
                        var xhr = new XMLHttpRequest();

                        // Set progress handler
                        xhr.upload.log = img
                        xhr.upload.addEventListener("progress", function (event) {
                            if (event.lengthComputable) {
                                var percentage = Math.round((event.loaded * 100) / event.total);
                                if (percentage < 100) {
                                    // console.log(percentage);
                                }
                            }
                        }
                        , false);

                        // Added load handler
                        xhr.addEventListener("load", function (event) {

                            // Get response
                            var response = eval('(' + event.target.responseText + ')');

                            // Check if error
                            if (response.status == 1) {

                                // Raise error
                                $.deco.notify({
                                    type: "error",
                                    title: "Error",
                                    message: response.message
                                });

                            // No error
                            } else {

                                // Set url and alt and fadein
                                $(event.target.upload.log).attr({
                                    'src': response.url,
                                    'alt': response.title
                                })
                                .animate({"opacity": 1}, { duration: "slow" });
                            }
                        }
                        , false);

                        // Set error handler
                        xhr.upload.addEventListener("error", function (error) {
                            $.deco.notify({
                                type: "error",
                                title: "Error",
                                message: "Error uploading file: " + error
                            });
                        }
                        , false);

                        // Set boundary
                        var boundary = "AJAX---------------------------AJAX";

                        // Open xhr and set content type
                        xhr.open("POST", $.deco.options.url + "/@@deco-upload", true);
                        xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);

                        // Add start boundary
                        var data = "--" + boundary + "\r\n";

                        // Add file
                        data += 'Content-Disposition: form-data; ';
                        data += 'name="uploadfile"; ';
                        data += 'filename="'+ file.fileName + '"' + "\r\n";
                        data += "Content-Type: " + file.mediaType;
                        data += "\r\n\r\n";
                        data += file.getAsBinary() + "\r\n";

                        // Add end boundary
                        data += "--" + boundary + "--" + "\r\n";

                        // Sent data
                        xhr.sendAsBinary(data);
                    } else {

                        // Notify unsupported
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
