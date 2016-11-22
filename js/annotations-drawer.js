(function (H) {

	var merge = H.merge,
		each = H.each,
		addEvent = H.addEvent,
		removeEvent = H.removeEvent;
	
	function getDefaultOptions() {
		var buttons = [],
			shapes = ['circle', 'line', 'square', 'text'],
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
			}],
			annotationEvents = defaultButtonAnnotationEvents;

			steps = [annotationEvents.getRadius, annotationEvents.getPath, annotationEvents.getRect, annotationEvents.getText],
			stops = [annotationEvents.getRadiusAndUpdate, annotationEvents.getPathAndUpdate, annotationEvents.getRectAndUpdate, annotationEvents.showInput];
			
		each(shapes, function (s, i) {
			buttons.push({
				annotationEvents: {
					step: steps[i],
					stop: stops[i]
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
					shape: s,
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


	var defaultButtonAnnotationEvents = {
		getRadius: function (e) {
			var ann = this,
				chart = ann.chart,
				bbox = chart.container.getBoundingClientRect(),
				x = e.clientX - bbox.left,
				y = e.clientY - bbox.top,
				xAxis = chart.xAxis[ann.options.xAxis],
				yAxis = chart.yAxis[ann.options.yAxis],
				dx = Math.abs(x - xAxis.toPixels(ann.options.xValue)),
				dy = Math.abs(y - yAxis.toPixels(ann.options.yValue)),
				radius = parseInt(Math.sqrt(dx * dx + dy * dy), 10);
			ann.shape.attr({
				r: radius
			});
			return radius;
		},
		getRadiusAndUpdate:	function (e) {
			var r = defaultButtonAnnotationEvents.getRadius.call(this, e);
			this.update({
				shape: {
					params: {
						r: r,
						x: -r,
						y: -r
					}
				}
			});
		},
		getPath: function (e) {
			var ann = this,
				chart = ann.chart,
				bbox = chart.container.getBoundingClientRect(),
				x = e.clientX - bbox.left,
				y = e.clientY - bbox.top,
				xAxis = chart.xAxis[ann.options.xAxis],
				yAxis = chart.yAxis[ann.options.yAxis],
				dx = x - xAxis.toPixels(ann.options.xValue),
				dy = y - yAxis.toPixels(ann.options.yValue);
				
			var path = ['M', 0, 0, 'L', parseInt(dx, 10), parseInt(dy, 10)];
			ann.shape.attr({
				d: path
			});
				
			return path;
		},
		getPathAndUpdate: function (e) {
			var ann = this,
				chart = ann.chart,
				path = defaultButtonAnnotationEvents.getPath.call(ann, e),
				xAxis = chart.xAxis[ann.options.xAxis],
				yAxis = chart.yAxis[ann.options.yAxis],
				x = xAxis.toValue(path[4] + xAxis.toPixels(ann.options.xValue)),
				y = yAxis.toValue(path[5] + yAxis.toPixels(ann.options.yValue));
				
			this.update({
				xValueEnd: x,
				yValueEnd: y,
				shape: {
					params: {
						d: path
					}
				}
			});
		},
		getRect: function (e) {
			var ann = this,
				chart = ann.chart,
				bbox = chart.container.getBoundingClientRect(),
				x = e.clientX - bbox.left,
				y = e.clientY - bbox.top,
				xAxis = chart.xAxis[ann.options.xAxis],
				yAxis = chart.yAxis[ann.options.yAxis],
				sx = xAxis.toPixels(ann.options.xValue),
				sy = yAxis.toPixels(ann.options.yValue),
				dx = x - sx,
				dy = y - sy,
				w = Math.round(dx) + 1,
				h = Math.round(dy) + 1,
				ret = {};
				
			ret.x = w < 0 ? w : 0;
			ret.width = Math.abs(w);
			ret.y = h < 0 ? h : 0;
			ret.height = Math.abs(h);
						
			ann.shape.attr({
				x: ret.x,
				y: ret.y,
				width: ret.width,
				height: ret.height
			});
			return ret;
		},
		getRectAndUpdate: function (e) {
			var rect = defaultButtonAnnotationEvents.getRect.call(this, e);
			this.update({
				shape: {
					params: rect
				}
			});
		},
		getText: function () {
			// do nothing
		},
		showInput: function (e) {
			var ann = this,
				chart = ann.chart,
				index = chart.annotationInputIndex = chart.annotationInputIndex ? chart.annotationInputIndex : 1,
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


	function AnnotationsDrawer (userOptions, chart) {
		this.init(userOptions, chart);
	}

	AnnotationsDrawer.prototype = {
		init: function (userOptions, chart) {
			this.chart = chart;
			this.buttons = [];
			this.allowZoom = true;

			this.setOptions(userOptions)
		},

		setOptions: function (userOptions) {
			this.userOptions = userOptions;
			this.options = merge(getDefaultOptions(), userOptions);
		},

		render: function () {
			this.renderButtons();
			this.attachEvents();
		},

		renderButtons: function() {
			each(this.options.buttons, function (button, i) {
				this.buttons.push(this.renderButton(button, i));
			}, this);
		},

		renderButton: function(mainButton, i) {
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
				button,
				symbol;
				
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
			).attr(symbol.style).add(button);
			
			button.attr(button.style).add();
			
			return [button, symbol];
		},

		onButtonClick: function (e, index) {
			var annotationsDrawer = this,
				chart = annotationsDrawer.chart,
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
		
		attachEvents: function () {
			var chart = this.chart;

			function step(e) {
				var selected = chart.annotationsDrawer.selected;
				chart.annotationsDrawer.options.buttons[selected].annotationEvents.step.call(chart.drawAnnotation, e);
			}
			function drag(e) {
				var bbox = chart.container.getBoundingClientRect(),
					clickX = e.clientX - bbox.left,
					clickY = e.clientY - bbox.top;
				
				if (!chart.isInsidePlot(clickX - chart.plotLeft, clickY - chart.plotTop) || chart.annotationsDrawer.allowZoom) {
					return;
				}
				
				var xAxis = chart.xAxis[0],
					yAxis = chart.yAxis[0],
					selected = chart.annotationsDrawer.selected;
				
				var options = merge(chart.annotationsDrawer.options.buttons[selected].annotation, {
					xValue: xAxis.toValue(clickX),
					yValue: yAxis.toValue(clickY),
					allowDragX: true,
					allowDragY: true
				});
				
				chart.addAnnotation(options);
				
				chart.drawAnnotation = chart.annotations.allItems[chart.annotations.allItems.length - 1];
				addEvent(document, 'mousemove', step);
			}
			
			function drop(e) {
				removeEvent(document, 'mousemove', step);
				
				// store annotation details
				if (chart.drawAnnotation) {
					var selected = chart.annotationsDrawer.selected;
					chart.annotationsDrawer.options.buttons[selected].annotationEvents.stop.call(chart.drawAnnotation, e);
				}
				chart.drawAnnotation = null;
			}
			addEvent(chart.container, 'mousedown', drag);
			addEvent(document, 'mouseup', drop);
		}
	};

	H.Chart.prototype.callbacks.push(function (chart) {
		var annotationsOptions = chart.options.annotationsOptions;

		if (annotationsOptions && annotationsOptions.enabledButtons) {
			var annotationsDrawer = chart.annotationsDrawer = new AnnotationsDrawer(annotationsOptions, chart);

			annotationsDrawer.render();
		}
	});

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

		// when drawing annotation, don't zoom/select place
	H.wrap(H.Pointer.prototype, 'drag', function (c, e) {
		var annotationsDrawer = this.chart.annotationsDrawer;
		if (!annotationsDrawer || annotationsDrawer.allowZoom) {
			c.call(this, e);
		}
	});
})(Highcharts);