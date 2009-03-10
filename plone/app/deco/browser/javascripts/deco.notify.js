/**
 * This plugin is used to display notifications
 *
 * @author Rob Gietema
 * @version 0.1
 */
;(function($) {

    // Initialize the notification plugin
    $(document).ready(function() {

        // Check if not already initialized
        if ($(".deco-notification").length == 0) {

            // Append notification container to body element
            $("body").append(
                $(document.createElement("div"))
                    .addClass("deco-notifications")
            )
        }
    });

    /**
     * Display a notification
     *
     * @id jQuery.deco.notify
     * @param {String} type Notification type; info, warning, error.
     * @param {String} title Title of the notification.
     * @param {String} message Message of the notification.
     */
    $.deco.notify = function(type, title, message) {

        // Get last notification
        var last_notification = $(".deco-notifications").children("div:last");

        // Calculate new offset top
        var offset_top = last_notification.length > 0 ? parseInt(last_notification.css("top")) + last_notification.height() + 10 : 0;

        // Add notification
        $(".deco-notifications")

            // Add notification div
            .append($(document.createElement("div"))
                .addClass("deco-notification")

                // Add notification header
                .append($(document.createElement("div"))
                    .addClass("deco-notification-header")
                )

                // Add notification content
                .append($(document.createElement("div"))
                    .addClass("deco-notification-content")

                    // Add type icon
                    .append($(document.createElement("div"))
                        .addClass("deco-notification-type deco-notification-type-" + type)
                    )

                    // Add close icon
                    .append($(document.createElement("div"))
                        .addClass("deco-notification-close")

                        // On click fadeout and remove notification
                        .click(function() {
                            $(this).parents(".deco-notification")
                                .data('close', true)
                                .fadeOut("slow", function() {
                                    $(this).remove();
                                })
                        })
                    )

                    // Add notification text
                    .append($(document.createElement("div"))
                        .addClass("deco-notification-text")
                        .append($(document.createElement("div"))
                            .addClass("deco-notification-title")
                            .html(title)
                        )
                        .append($(document.createElement("div"))
                            .addClass("deco-notification-message")
                            .html(message)
                        )
                    )
                )

                // Add notification footer
                .append($(document.createElement("div"))
                    .addClass("deco-notification-footer")
                )

                // Hide notification so it can be fadein
                .hide()

                // Position notification
                .css("top", offset_top)

                // Fadein the notification
                .fadeIn("slow", function() {
                    var elm = $(this);

                    // Set timeout to hide notification
                    window.setTimeout(function() {

                        // If not mouseover fadeout and remove the message
                        if (elm.data("mouseover") == false) {
                            elm.fadeOut("slow", function() {
                                elm.remove();
                            });
                        }
                        elm.data("timeout", true);
                    }, 3000);

                    // Set initial state
                    elm.data("timeout", false);
                    elm.data('mouseover', false);
                    elm.data('close', false);
                })

                // Bind mouseover event
                .mouseover(function() {

                    // If not close pressed
                    if ($(this).data("close") == false) {

                        // Clear fadeout timeout and fade to full opacity
                        window.clearTimeout($(this).data('fade'));
                        $(this).stop();
                        $(this).fadeTo("slow", 1);
                        $(this).data('mouseover', true);
                    }
                })

                // Bind mouseleave event
                .bind("mouseleave", function() {

                    // Get element
                    elm = $(this);

                    // If timeout has passed and close not pressed
                    if ((elm.data("timeout") == true) && (elm.data("close") == false)) {

                        // Fadeout and remove the notification
                        elm.fadeOut("slow", function() {
                            elm.remove();
                        });
                    }

                    // Set mouseover state
                    $(this).data('mouseover', false);
                })
            )
    };
})(jQuery);
