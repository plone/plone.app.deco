/**
 * This plugin is used to create the deco undo stack, and enable
 * undo/redo actions. The JS defines two classes, one for internal use
 * ($.deco.undo.Stack) and the public one $.deco.unto.UndoManager. The
 * latter needs to be initialized (form the deco core), using:
 *  - stack size (max undo history) 
 *  - reference to a handler that is called with the state as argument on undo/redo
 *  - current state (optional)
 *
 * The state can be anyting, but a feasible use is a DOM snippet as
 * state, that can be re-applied to an element on undo/redo.  Check
 * out plone.app.deco/plone/app/deco/tests/javascipts/test_undo.html
 * for an example wiring.
 *
 * Currently for deco the 'public' methods of the module are 'init',
 * 'undo', 'redo', 'hasInitial' and 'snapshot'. The undo manager
 * always needs an intial state (to be able to redo the undo...). A
 * state can be added with the jQuery.deco.undo.snapshot
 * method. Always take the snapshot AFTER the change in the DOM.
 *
 * @author D.A.Dokter
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

    // Declare deco.undo namespace
    $.deco.undo = function () {};

    /**
     * Initialize undo manager.
     * @id jQuery.deco.undo.init
     */
    $.deco.undo.init = function () {

        function handler(state) {

            for (var i = 0; i < state.length; i += 1) {
                $("#" + state[i].target).html(state[i].source);
            }
        }

        $.deco.undo.undoManager =  new $.deco.undo.UndoManager(10, handler);
    };


    /**
     * Create a snapshot of the current situation, and add it to the
     * undo manager.
     * @id jQuery.deco.undo.snapshot
     */
    $.deco.undo.snapshot = function () {
        var state = [];
        $(".deco-panel").each(function () {
            state.push({"target": $(this).attr("id"),
                  "source": $(this).html()});
        });
        if (typeof($.deco.undo.undoManager) === "undefined") {
            $.deco.undo.init();
        }

        $.deco.undo.undoManager.add(state);
    };


    /**
     *
     */
    $.deco.undo.hasInitial = function () {
        if ($.deco.undo.undoManager.stack.size() > 0) {
            return true;
        } else {
            return false;
        }
    };


    /**
     * Undo.
     * @id jQuery.deco.undo.undo
     */
    $.deco.undo.undo = function () {
        $.deco.undo.undoManager.undo();
    };


    /**
     * Redo.
     * @id jQuery.deco.undo.redo
     */
    $.deco.undo.redo = function () {
        $.deco.undo.undoManager.redo();
    };


    /**
     * Stack constructor, taking optional size parameter.
     * @id jQuery.deco.undo.Stack
     * @param {Integer} stackSize Maximum number of items on the stack.
     */
    $.deco.undo.Stack = function (stackSize) {
        if (typeof(stackSize) === "undefined") {
            this.maxsize = 10;
        } else {
            this.maxsize = stackSize;
        }

        this.stack = [];
    };

    /**
     * Return current stack size.
     * @id jQuery.deco.undo.Stack.size
     */
    $.deco.undo.Stack.prototype.size  = function () {
        return this.stack.length;
    };

    /**
     * FIFO stack push, that removes object at other end if the stack
     * grows bigger than the size set.
     * @id jQuery.deco.undo.Stack.add
     * @param {Object} obj Object to push onto the stack.
     */
    $.deco.undo.Stack.prototype.add = function (obj) {

        if (this.stack.length >= this.maxsize) {
            this.stack.pop();
        }

        this.stack.unshift(obj);
    };

    /**
     * Get the object at the given index. Note that new states (added
     * through jQuery.deco.undo.Stack.add) are added (using shift) at index 0.
     * @id jQuery.deco.undo.Stack.get
     */
    $.deco.undo.Stack.prototype.get = function (i) {
        return this.stack[i];
    };

    /**
     * Undo manager, handling calls to undo/redo. This implementation
     * uses full DOM snippets.
     * @id jQuery.deco.undo.UndoManager
     * @param {Integer} stackSize max undo history
     * @param {Function} handler for undo/redo, taking state as argument
     * @param {Object} currentState Current state
     */
    $.deco.undo.UndoManager = function (stackSize, handler, currentState) {
      
        this.stack = new $.deco.undo.Stack(stackSize);
        this.pointer = 0;
        this.handler = handler;
        if (typeof(currentState) !== "undefined") {
            this.stack.add(currentState);
        }
    };

    /**
     * Add state to manager.
     * @id jQuery.deco.undo.UndoManager.add
     * @param {Object} state State to add.
     */
    $.deco.undo.UndoManager.prototype.add = function (state) {
      
        this.stack.add(state);
    };

    /**
     * Undo last action, by restoring last state.
     * @id jQuery.deco.undo.UndoManager.undo
     */
    $.deco.undo.UndoManager.prototype.undo = function  () {

        var state = this.stack.get(this.pointer + 1);

        if (state) {
            this.handler(state);
            this.pointer += 1;
        } else {
          // Alert there's no (more) states.
        }
    };

    /**
     * Redo last action, by calling handler with previous state.
     * @id jQuery.deco.undo.UndoManager.redo
     */
    $.deco.undo.UndoManager.prototype.redo = function () {

        var state = this.stack.get(this.pointer - 1);

        if (state) {
            this.handler(state);
            this.pointer -= 1;
        } else {
            // Alert there's no (more) states.
        }
    };

}(jQuery));
