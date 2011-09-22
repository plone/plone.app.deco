/**
 * textSelect jQuery Plug-in
 * 
 * Copyright (c) 2011, Simon Chong
 * 
 * Licensed under The MIT License which can be obtained from <http://www.opensource.org>
 * 
 * textSelect is a jQuery Plug-in enables easy manipulation of text using the browsers native text selection.
 * 
 * It was created to bridge the gap between the DOM Range and Selection objects that are missing in Internet Explorer up until version 9.
 */
(function ($) {

	var internal = {
		clear : function () {
			if (window.getSelection) { // all browsers, except IE before version 9
				var selection = window.getSelection();
				selection.removeAllRanges();
			} else if (document.selection.createRange) { // Internet Explorer
				document.selection.empty();
			}
		},
		getTextNode : function (element) {
			var domObj = $(element).first().get(0);

			if (window.getSelection && domObj.childNodes) {
				var nodes = domObj.childNodes;
				for ( var i = 0; i < nodes.length; i++) {
					var node = nodes[i];
					if (node.nodeType === 3) {
						return node;
					}
				}
			} else if (document.selection) {
				return domObj;
			}
			return false;
		},
		getElement: function (element){
			return $(element).first().get(0);
		}
	};

	var methods = {
		getRange : function () {

			var rangeRtn = {
				start : 0,
				startElement : null,
				end : 0,
				endElement : null
			};

			if (window.getSelection) {
				// All browsers, except IE before version 9
				var selection = window.getSelection();
				var rangeObj = selection.getRangeAt(0);

				rangeRtn.start = rangeObj.startOffset;
				rangeRtn.startElement = rangeObj.startContainer;
				rangeRtn.end = rangeObj.endOffset;
				rangeRtn.endElement = rangeObj.endContainer;

			} else if (document.selection) {
				// Internet Explorer before version 9
				var rangeRtnObj = document.selection.createRange();
				var startRange = rangeRtnObj.duplicate();
				var endRange = rangeRtnObj.duplicate();

				startRange.collapse(true); // Make the rangeRtn point to just the beginning
				endRange.collapse(false);// Make the rangeRtn point to just the end

				rangeRtn.startElement = startRange.parentElement(); // There is the element where the selection starts
				rangeRtn.endElement = endRange.parentElement(); // There is the element where the selection ends

				// Create a rangeRtn encapsulating the element where the start point sits
				var startElPos = rangeRtnObj.duplicate();
				startElPos.moveToElementText(startRange.parentElement());
				// Set the end point so that the rangeRtn starts from the first element and ends where it the selection starts
				startElPos.setEndPoint('EndToStart', startRange);

				// Get the offset from the first element
				rangeRtn.start = startElPos.text.length;

				// Create a rangeRtn encapsulating the element where the end point sits
				var endElPos = rangeRtnObj.duplicate();
				endElPos.moveToElementText(endRange.parentElement());
				// Set the end point so that the rangeRtn starts from the last element and ends where it the selection ends
				endElPos.setEndPoint('EndToStart', endRange);

				// Get the offset from the end element
				rangeRtn.end = endElPos.text.length;
			}

			return rangeRtn;

		},
		setRange : function (range) {

			internal.clear();

			if (typeof range !== 'object') {
				return;
			}

			var startNode = false;
			var endNode = false;



			if (window.getSelection) { // all browsers, except IE before version 9

				var selection = window.getSelection();
				var rangeObj = document.createRange();
				
				if (range.startElement !== undefined) {
					startNode = internal.getTextNode(range.startElement);
				}

				if (range.endElement !== undefined) {
					endNode = internal.getTextNode(range.endElement);
				}

				if (range.start !== undefined && startNode) {

					rangeObj.setStart(startNode, range.start);
				}

				if (range.end !== undefined && endNode) {
					rangeObj.setEnd(endNode, range.end);
				}

				selection.addRange(rangeObj);

			} else if (document.selection) { // Internet Explorer

				var rangeObj = document.body.createTextRange();
				
				if (range.startElement !== undefined) {
					startNode = internal.getElement(range.startElement);
				}

				if (range.endElement !== undefined) {
					endNode = internal.getElement(range.endElement);
				}


				if (range.start && startNode) {
					var startRange = rangeObj.duplicate();
					startRange.moveToElementText(startNode);
					startRange.move('character', range.start);

					rangeObj.setEndPoint('StartToStart', startRange);
				}

				if (range.end && endNode) {
					var endRange = rangeObj.duplicate();
					endRange.moveToElementText(endNode);
					endRange.move('character', range.end);

					rangeObj.setEndPoint('EndToEnd', endRange);
				}
				
				rangeObj.select();
			}
			return this;
		},
		select : function () {

			internal.clear(); // required for IE9 it won't select the whole element otherwise

			for ( var i = 0; i < this.length; i++) {
				var element = this[i];

				if (window.getSelection) {
					// All browsers, except IE before version 9
					var selection = window.getSelection();
					var textNode = element.firstChild; // get the text node

					if (textNode && textNode.data.length > 1) {
						var rangeObj = document.createRange();
						rangeObj.selectNode(element);
						selection.addRange(rangeObj);
					}
				} else {
					// Internet Explorer before version 9
					var rangeObj = document.body.createTextRange();
					rangeObj.moveToElementText(element);
					rangeObj.select();
				}
			}
			return this;
		},
		clear : function () {
			internal.clear();
			return this;
		},
		remove : function () {

			if (window.getSelection) { // all browsers, except IE before version 9
				var selection = window.getSelection();
				try {
					selection.deleteFromDocument();
				} catch (e) {
					// TODO: When select is empty or it fails to delete
				}
				/*
				 * The deleteFromDocument does not work in Opera. Work around this bug.
				 */
				if (!selection.isCollapsed) {
					var selRange = selection.getRangeAt(0);
					selRange.deleteContents();
				}

				/*
				 * The deleteFromDocument works in IE, but a part of the new content becomes selected prevent the selection
				 */
				if (selection.anchorNode) {
					selection.collapse(selection.anchorNode, selection.anchorOffset);
				}
			} else if (document.selection) { // Internet Explorer
				document.selection.clear();

			}
			return this;
		},
		toString : function () {
			if (window.getSelection) { // all browsers, except IE before version 9
				var selRange = window.getSelection();
				return selRange.toString();
			} else if (document.selection) { // Internet Explorer
				var textRange = document.selection.createRange();
				return textRange.text;
			}

		}
	};

	$.textSelect = $.fn.textSelect = function (method) {
		// Method calling logic
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else {
			return methods['toString'].apply(this, Array.prototype.slice.call(arguments, 1));
		}
	};

})(jQuery);