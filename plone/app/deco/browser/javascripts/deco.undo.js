/**
 * This plugin is used to create the deco undo stack, and enable undo/redo actions.
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

    $.deco.undo = function() {};

    /**
     * Stack constructor, taking optional size paramater.
     */
    $.deco.undo.Stack = function (stackSize) {
      if (typeof(stackSize) === "undefined") {
        this.maxsize = 10;
      } else {
        this.maxsize = stackSize;
      }

      this.stack = Array();
    };

    $.deco.undo.Stack.prototype.size  = function() {
        return this.stack.length;
    };

    /**
     * FIFO stack push, that removes object at other end if the stack grows bigger than
     * the size set.
     */
    $.deco.undo.Stack.prototype.add = function(obj) {

      if (this.stack.length >= this.maxsize) {
        this.stack.pop();
      }

      this.stack.unshift(obj);
    };

    $.deco.undo.Stack.prototype.get = function(i) {
      return this.stack[i];
    };

    /**
     * Undo manager, handling calls to undo/redo. This implementation uses full DOM
     * snippets.
     */
    $.deco.undo.UndoManager = function(stackSize, handler, currentState) {
      
      this.stack = new $.deco.undo.Stack(stackSize);
      this.pointer = 0;
      this.handler = handler;
      this.stack.add(currentState);
    };

    /**
     * Add state to manager.
     */
    $.deco.undo.UndoManager.prototype.add = function(state) {
      
      this.stack.add(state);
    }

    /**
     * Undo last action, by restoring last state.
     */
    $.deco.undo.UndoManager.prototype.undo = function() {
      
      var state = this.stack.get(this.pointer + 1);

      if (state) {
        this.handler(state);
        this.pointer++;
      } else {
        // Alert there's no (more) states.
      }
    };

    /**
     * Redo last action, by restoring previous state.
     */
    $.deco.undo.UndoManager.prototype.redo = function() {

      var state = this.stack.get(this.pointer - 1);

      if (state) {
        this.handler(state);
        this.pointer--;
      } else {
        // Alert there's no (more) states.
      }
    };

}(jQuery));