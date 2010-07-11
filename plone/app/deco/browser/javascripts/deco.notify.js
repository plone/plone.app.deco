/**
 * This plugin is used to display notifications
 *
 * @author Rob Gietema
 * @version 0.1
 */
"use strict";

/*global jQuery: false, window: false */
/*jslint white: true, browser: true, onevar: true, undef: true, nomen: true,
eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true,
immed: true, strict: true, maxlen: 80, maxerr: 9999 */

(function ($) {

    // Define deco namespace if it doesn't exist
    if (typeof($.deco) === "undefined") {
        $.deco = {};
    }

    /**
     * Initialize the notify module
     *
     * @id jQuery.deco.initNotify
     */
    $.deco.initNotify = function () {

        // Check if not already initialized
        if ($(".deco-notification").length === 0) {

            // Append notification container to body element
            $("body").append(
                $(document.createElement("div"))
                    .addClass("deco-notifications")
            );
        }
    };

    /**
     * Display a notification
     *
     * @id jQuery.deco.notify
     * @param {Object} options Object containing all the options of the action
     */
    $.deco.notify = function (options) {

        // Extend default settings
        options = $.extend({
            type: "info",
            title: "",
            message: "",
            fadeSpeed: "slow",
            duration: 3000
        }, options);

        // Local variables
        var last_notification, offset_top, elm;

        // Get last notification
        last_notification = $(".deco-notifications").children("div:last");

        // Calculate new offset top
        offset_top = last_notification.length > 0 ?
            parseInt(last_notification.css("top"), 10) +
            last_notification.height() + 10 : 0;

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
                        .addClass("deco-notification-type " +
                            "deco-notification-type-" + options.type)
                    )

                    // Add close icon
                    .append($(document.createElement("div"))
                        .addClass("deco-notification-close")

                        // On click fadeout and remove notification
                        .click(function () {
                            $(this).parents(".deco-notification")
                                .data('close', true)
                                .fadeOut(options.fadeSpeed, function () {
                                    $(this).remove();
                                });
                        })
                    )

                    // Add notification text
                    .append($(document.createElement("div"))
                        .addClass("deco-notification-text")
                        .append($(document.createElement("div"))
                            .addClass("deco-notification-title")
                            .html(options.title)
                        )
                        .append($(document.createElement("div"))
                            .addClass("deco-notification-message")
                            .html(options.message)
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
                .fadeIn(options.fadeSpeed, function () {
                    elm = $(this);

                    // Set timeout to hide notification
                    window.setTimeout(function () {

                        // If not mouseover fadeout and remove the message
                        if (elm.data("mouseover") === false) {
                            elm.fadeOut(options.fadeSpeed, function () {
                                elm.remove();
                            });
                        }
                        elm.data("timeout", true);
                    }, options.duration);

                    // Set initial state
                    elm.data("timeout", false);
                    elm.data('mouseover', false);
                    elm.data('close', false);
                })

                // Bind mouseover event
                .mouseover(function () {

                    // If not close pressed
                    if ($(this).data("close") === false) {

                        // Clear fadeout timeout and fade to full opacity
                        window.clearTimeout($(this).data('fade'));
                        $(this).stop();
                        $(this).fadeTo(options.fadeSpeed, 1);
                        $(this).data('mouseover', true);
                    }
                })

                // Bind mouseleave event
                .bind("mouseleave", function () {

                    // Get element
                    elm = $(this);

                    // If timeout has passed and close not pressed
                    if ((elm.data("timeout") === true) &&
                        (elm.data("close") === false)) {

                        // Fadeout and remove the notification
                        elm.fadeOut(options.fadeSpeed, function () {
                            elm.remove();
                        });
                    }

                    // Set mouseover state
                    $(this).data('mouseover', false);
                })
            );
    };
}(jQuery));
