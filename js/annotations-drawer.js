/* global document, Highcharts, module:true */
(function (factory) {
	if (typeof module === 'object' && module.exports) {
		module.exports = factory;
	} else {
		factory(Highcharts);
	}
}(function (H) {
	'use strict';

	var merge = H.merge,
		each = H.each,
		addEvent = H.addEvent,
		removeEvent = H.removeEvent;
	
	/**
		@description contains all the default options for the annotations drawer

		@returns {Object} annotations drawer option object
	**/
	function getDefaultOptions() {
		var shapes = ['circle', 'line', 'square', 'text'],
			types = ['circle', 'path', 'rect', null],
			params = [{
				r: 0,
				fill: 'rgba(255,0,0,0.4)',
				stroke: 'black'
			}, {
				d: ['M', 0, 0, 'L', 10, 10],
				fill: 'rgba(255,0,0,0.4)',
				stroke: 'black'
			}, {
				width: 10,
				height: 10,
				fill: 'rgba(255,0,0,0.4)',
				stroke: 'black'
			}];



		/* ****************************************************************************
		 * START steps events                                                        *
	    **************************************************************************** */

		/**
			contains event handlers called on mouse move, handlers resize shapes according to mouse position
		**/
		var steps = {
			'circle': function (e) {
				var ann = this,
					chart = ann.chart,
					bbox = chart.container.getBoundingClientRect(),
					x = e.clientX - bbox.left,
					y = e.clientY - bbox.top,
					dx = Math.abs(x - ann.options.x),
					dy = Math.abs(y - ann.options.y),
					radius = Math.sqrt(dx * dx + dy * dy);

				ann.options.shape.params = {
					r: radius,
					x: -radius,
					y: -radius
				};

				ann.shape.attr({
					r: radius
				});
			},

			'square': function (e) {
				var ann = this,
					chart = ann.chart,
					bbox = chart.container.getBoundingClientRect(),
					x = e.clientX - bbox.left,
					y = e.clientY - bbox.top,
					sx = ann.options.x,
					sy = ann.options.y,
					dx = x - sx,
					dy = y - sy,
					w = Math.round(dx) + 1,
					h = Math.round(dy) + 1,
					rect = {};
				
				rect.x = w < 0 ? w : 0;
				rect.width = Math.abs(w);
				rect.y = h < 0 ? h : 0;
				rect.height = Math.abs(h);

				ann.options.shape.params = {
					x: rect.x,
					y: rect.y,
					width: rect.width,
					height: rect.height
				};

				ann.shape.attr(rect);
			},

			'line': function (e) {
				var ann = this,
					chart = ann.chart,
					bbox = chart.container.getBoundingClientRect(),
					x = e.clientX - bbox.left,
					y = e.clientY - bbox.top,
					dx = x - ann.options.x,
					dy = y - ann.options.y,
					path = ['M', 0, 0, 'L', dx, dy];

				ann.options.shape.params = {
					params: {
						d: path
					}
				};

				ann.shape.attr({
					d: path
				});
			},

			'text': function () {}
		};

		/* ****************************************************************************
		 * END steps events                                                        *
	    **************************************************************************** */


		/* ****************************************************************************
		 * START stops events                                                        *
	    **************************************************************************** */

		var updateAnnotation = H.Annotation.prototype.update,

			/**
				contains event handlers called on document mouse up, handlers update the annotation
			**/
			stops = {
				'circle': updateAnnotation,
				'square': updateAnnotation,
				'line': updateAnnotation,
				'text': function (e) {
					var ann = this,
						chart = ann.chart,
						index = chart.annotationInputIndex = chart.annotationInputIndex || 1,
						input = document.createElement('span'),
						button;
						
					input.innerHTML = '<input type="text" class="annotation-' + index + '" placeholder="Add text"><button class=""> Done </button>';
					input.style.position = 'absolute';
					input.style.left = e.pageX + 'px';
					input.style.top = e.pageY + 'px';
					
					document.body.appendChild(input);
					input.querySelectorAll('input')[0].focus();
					button = input.querySelectorAll('button')[0];
					button.onclick = function () {
						var parent = this.parentNode;
						
						ann.update({
							title: {
								text: parent.querySelectorAll('input')[0].value
							}
						});
						parent.parentNode.removeChild(parent);
					};
					chart.annotationInputIndex++;
				}
			};

		/* ****************************************************************************
		 * END stops events                                                        *
	    **************************************************************************** */

		var buttons = [];
		each(shapes, function (shape, i) {
			buttons.push({
				annotationEvents: {
					step: steps[shape],
					stop: stops[shape]
				},
				annotation: {
					anchorX: 'left',
					anchorY: 'top',
					xAxis: 0,
					yAxis: 0,
					shape: {
						type: types[i],
						params: params[i]
					}
				},
				symbol: {
					shape: shape,
					size: 12,
					style: {
						'stroke-width': 2,
						'stroke': 'black',
						fill: 'red',
						zIndex: 121
					}
				},
				style: {
					fill: 'black',
					stroke: 'blue',
					strokeWidth: 2
				},
				size: 12,
				states: {
					selected: {
						fill: '#9BD'
					},
					hover: {
						fill: '#9BD'
					}
				}
			});
		});

		return {
			enabledButtons: true,
			buttons: buttons,
			buttonsOffsets: [0, 0]
		};
	}


	/* ****************************************************************************
	 * START AnnotationsDrawer class                                             *
    **************************************************************************** */

	/**
		@class AnnotationsDrawer
		@classdesc A tool for drawings annotations

		@param {Object} userOptions - options specified by a user
		@param {Object} chart - a chart object which an annotations drawer is hooked into
	**/
	function AnnotationsDrawer(userOptions, chart) {
		this.init(userOptions, chart);
	}

	AnnotationsDrawer.prototype = {
		init: function (userOptions, chart) {
			this.chart = chart;
			this.buttons = [];
			this.allowZoom = true;

			this.setOptions(userOptions);
		},

		/**
			@description merges options with the default options
			
			@param {Object} userOptions - options specified by a user
			@returns {undefined}
		**/
		setOptions: function (userOptions) {
			this.userOptions = userOptions;
			this.options = merge(getDefaultOptions(), userOptions);
		},

		/**
			@description renders all element of the annotations drawer

			@returns {undefined}
		**/
		render: function () {
			this.renderButtons();
			this.attachEvents();
		},

		/**
			@description calls a render method for each button

			@returns {undefined}
		**/
		renderButtons: function () {
			each(this.options.buttons, function (button, i) {
				this.buttons.push(this.renderButton(button, i));
			}, this);
		},

		/**
			@description renders, positions a button from the options, attaches on click event to the button

			@param {Object} mainButton - contains options for buttons
			@param {Number} i - index of the button which will be created
			@returns {undefined}
		**/
		renderButton: function (mainButton, i) {
			var annotationsDrawer = this,
				chart = this.chart,
				options = this.options,
				userOffset = options.buttonsOffsets,
				xOffset = chart.rangeSelector && chart.rangeSelector.inputGroup ? chart.rangeSelector.inputGroup.offset : 0,
				renderer = chart.renderer,
				symbol = mainButton.symbol,
				offset = 30,
				symbolSize = symbol.size,
				padding = 8 / 2, // since Highcahrts 5.0, padding = 8 is hardcoded
				buttonSize = mainButton.size - padding,
				x = chart.plotWidth + chart.plotLeft - ((i + 1) * offset) - xOffset - userOffset[0],
				y = chart.plotTop - (chart.rangeSelector ? 23 + buttonSize + padding : 0) + userOffset[1],
				onButtonClick = (mainButton.events && mainButton.events.click) || onButtonClick,
				selected = mainButton.states.selected,
				hovered = mainButton.states.hover,
				button;
				
			button = renderer.button(
				null,
				x,
				y,
				function (e) {
					annotationsDrawer.onButtonClick(e, i);
				},
				{},
				hovered,
				selected
				)
			.attr({
				width: buttonSize,
				height: buttonSize,
				zIndex: 10
			});

			symbol = renderer.symbol(
				symbol.shape,
				buttonSize - symbolSize / 2 + padding,
				buttonSize - symbolSize / 2 + padding,
				symbolSize,
				symbolSize
				)
			.attr(symbol.style)
			.add(button);

			button.attr(button.style).add();

			return [button, symbol];
		},


		/**
			@description on button click handler, changing states of the button and disable ability to zoom/pan chart

			@param {Object} e - event
			@param {Number} index - index of the clicked button
			@returns {undefined}
		**/
		onButtonClick: function (e, index) {
			var annotationsDrawer = this,
				buttons = annotationsDrawer.buttons;

			var button = buttons[index][0];

			if (button.state === 2) {
				annotationsDrawer.selected = -1;
				annotationsDrawer.allowZoom = true;
				button.setState(0);
			} else {
				if (annotationsDrawer.selected >= 0) {
					buttons[annotationsDrawer.selected][0].setState(0);
				}
				annotationsDrawer.allowZoom = false;
				annotationsDrawer.selected = index;
				button.setState(2);
			}
		},

		/**
			@description attaches events allowing drawing annotations

			@returns {undefined}
		**/
		attachEvents: function () {
			var chart = this.chart;

			/**
				@description calls a step method associated with the selected button

				@private
				@param {Object} e - event
				@returns {undefined}
			**/
			function drag(e) {
				var selected = chart.annotationsDrawer.selected;
				chart.annotationsDrawer.options.buttons[selected].annotationEvents.step.call(chart.drawAnnotation, e);
			}

			/**
				@description starts dragging state - creates annotation and adds an event which calls a step method on moouse move

				@private
				@param {Object} e - event
				@returns {undefined}
			**/
			function dragStart(e) {
				var bbox = chart.container.getBoundingClientRect(),
					clickX = e.clientX - bbox.left,
					clickY = e.clientY - bbox.top;

				if (!chart.isInsidePlot(clickX - chart.plotLeft, clickY - chart.plotTop) || chart.annotationsDrawer.allowZoom) {
					return;
				}

				var selected = chart.annotationsDrawer.selected;

				var options = merge(chart.annotationsDrawer.options.buttons[selected].annotation, {
					x: clickX,
					y: clickY,
					allowDragX: true,
					allowDragY: true
				});

				chart.addAnnotation(options);

				chart.drawAnnotation = chart.annotations.allItems[chart.annotations.allItems.length - 1];
				addEvent(document, 'mousemove', drag);
			}

			/**
				@description drops the dragging state and calls a button specific stop method

				@private
				@param {Object} e - event
				@returns {undefined}
			**/
			function drop(e) {
				removeEvent(document, 'mousemove', drag);

				// store annotation details
				if (chart.drawAnnotation) {
					var selected = chart.annotationsDrawer.selected;
					chart.annotationsDrawer.options.buttons[selected].annotationEvents.stop.call(chart.drawAnnotation, e);
				}
				chart.drawAnnotation = null;
			}
			addEvent(chart.container, 'mousedown', dragStart);
			addEvent(document, 'mouseup', drop);
		}
	};

	/* ****************************************************************************
	 * END AnnotationsDrawer class                                             *
    **************************************************************************** */


	/* ****************************************************************************
	 * START Highcharts wrappers                                                  *
    *****************************************************************************/


	H.Chart.prototype.callbacks.push(function (chart) {
		var annotationsOptions = chart.options.annotationsOptions;

		if (annotationsOptions && annotationsOptions.enabledButtons) {
			var annotationsDrawer = chart.annotationsDrawer = new AnnotationsDrawer(annotationsOptions, chart);

			annotationsDrawer.render();
		}
	});

	// when drawing annotation, don't zoom/select place
	H.wrap(H.Pointer.prototype, 'drag', function (c, e) {
		var annotationsDrawer = this.chart.annotationsDrawer;
		if (!annotationsDrawer || annotationsDrawer.allowZoom) {
			c.call(this, e);
		}
	});

	/* ****************************************************************************
	 * END Highcharts wrappers                                                  *
    *****************************************************************************/

	H.SVGRenderer.prototype.symbols.line = function (x, y, w, h) {
		var p = 2;
		return [
			'M', x + p, y + p, 'L', x + w - p, y + h - p
		];
	};

	H.SVGRenderer.prototype.symbols.text = function (x, y, w, h) {
		var p = 1;
		return [
			// 'M', 0, 0, 'L', 10, 0, 'M', 5, 0, 'L', 5, 5
			'M', x, y + p, 'L', x + w, y + p,
			'M', x + w / 2, y + p, 'L', x + w / 2, y + p + h
		];
	};
	// VML fallback
	if (H.VMLRenderer) {
		H.VMLRenderer.prototype.symbols.text = H.SVGRenderer.prototype.symbols.text;
		H.VMLRenderer.prototype.symbols.line = H.SVGRenderer.prototype.symbols.line;
	}
}));