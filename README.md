<h1>Annotations module</h1>

<p><div class="info">If you're interested in adding new features or modifying existing ones, please contact us: <a href="mailto:start@blacklabel.pl"> start@blacklabel.pl </a><br>
You may also want to check our other demo here: <a href="http://demo.blacklabel.pl">http://demo.blacklabel.pl</a>.</div></p>

<h2>Installation</h2>

<p>Like any other Highcharts module (e.g. exporting), add <code>&lt;script&gt;</code> tag pointing to <code>annotations.js</code> below Highcharts script tag.</p>

<p>For NPM users:</p>
<pre><code>var Highcharts = require('highcharts'),
    HighchartsAnnotations = require('annotations')(Highcharts);</code></pre>
<p>For BOWER users:</p>
<pre><code>bower install highcharts-annotations</code></pre>

<h2>Sample code</h2>

<pre><code>new Highcharts.Chart({
  chart: {
    renderTo: container
  },
  series: [{
      data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0]
  }],
  annotations: [{
    xValue: 4,
    yValue: 125,
    title: {
        text: "Annotated chart!"
    },
    events: {
        click: function(e) { console.log("Annotation clicked:", this); }
    }
  }]
})
</code></pre>

<h2>Available options</h2>

<h3>Chart options</h3>

<table>
<thead>
<tr>
<th align="left">Option            </th>
<th align="left"> Description</th>
</tr>
</thead>
<tbody>
<tr>
<td align="left">chart.annotations </td>
<td align="left"> Array containing annotation configuration objects</td>
</tr>
<tr>
<td align="left">chart.annotationsOptions </td>
<td align="left"> Default options for annotations (like buttons' list)</td>
</tr>
</tbody>
</table>


<h3>Annotation configuration object</h3>

<table>
<thead>
<tr>
<th align="left">Option                                    </th>
<th align="left"> Description</th>
</tr>
</thead>
<tbody>
<tr>
<td align="left">x<br>y                                    </td>
<td align="left"> Annotation position defined in pixels</td>
</tr>
<tr>
<td align="left">xValue<br>yValue                          </td>
<td align="left"> Annotation position defined using axis values</td>
</tr>
<tr>
<td align="left">xValueEnd<br>yValueEnd                          </td>
<td align="left"> Path only. Instead of defining path, set these values to make annotation scalable</td>
</tr>
<tr>
<td align="left">xAxis<br>yAxis                            </td>
<td align="left"> Axis index, default to 0</td>
</tr>
<tr>
<td align="left">anchorX<br>anchorY                        </td>
<td align="left"> Defines annotation anchor point, available values:<br><pre>anchorX: "left"/"center"/"right"</pre><br><pre>anchorY: "top"/"middle"/"bottom"</pre></td>
</tr>
<tr>
<td align="left">allowDragX<br>allowDragY</td>
<td align="left"> Allow user to drag and drop an annotation. Horizontal and vertical.</td>
</tr>
<tr>
<td align="left">linkedTo                                  </td>
<td align="left"> Link annotation to point or series using it's id</td>
</tr>
<tr>
<td align="left">title                                     </td>
<td align="left"> Title configuration object</td>
</tr>
<tr>
<td align="left">title.text                                </td>
<td align="left"> Title text</td>
</tr>
<tr>
<td align="left">title.x<br>title.y                        </td>
<td align="left"> Title position in pixels, relative to annotation position</td>
</tr>
<tr>
<td align="left">title.style                               </td>
<td align="left"> Additional CSS styles for title</td>
</tr>
<tr>
<td align="left">title.style.color                         </td>
<td align="left"> Title text color</td>
</tr>
<tr>
<td align="left">title.style.fontSize                      </td>
<td align="left"> Title font size</td>
</tr>
<tr>
<td align="left">shape                                     </td>
<td align="left"> Shape configuration object</td>
</tr>
<tr>
<td align="left">shape.type                                </td>
<td align="left"> Shape type, available types are <code>"path"</code>, <code>"circle"</code> and <code>"rect"</code></td>
</tr>
<tr>
<td align="left">shape.units                               </td>
<td align="left"> Defines whether shape uses pixels or axis values</td>
</tr>
<tr>
<td align="left">shape.params                              </td>
<td align="left"> Shape parameters (parameters are passed to renderer method like rect, circle or path)</td>
</tr>
<tr>
<td align="left"> events                              </td>
<td align="left"> Object of events, supported are: <code>mouseover, mouseout, mousedown, mouseup, click, dblclick</code>. <code>this</code> in a callback refers to the annotation object.</td>
</tr>
<tr>
<td align="left"> selectionMarker                              </td>
<td align="left"> Styles for a selected annotation, defaults to: 
<code>{
		'stroke-width': 1,
		stroke: 'black',
		fill: 'transparent',
		dashstyle: 'ShortDash',
		'shape-rendering': 'crispEdges'
}</code></td>
</tr>
</tbody>
</table>


<h3>Available shape parameters</h3>

<table>
<thead>
<tr>
<th align="left">Option                                      </th>
<th align="left"> Description                                        </th>
<th align="left"> Limited to</th>
</tr>
</thead>
<tbody>
<tr>
<td align="left">shape.params.x<br>shape.params.y             </td>
<td align="left"> Shape position relative to the annotation position </td>
<td align="left">rect<br>circle</td>
</tr>
<tr>
<td align="left">shape.params.width<br>shape.params.height    </td>
<td align="left"> Rectangle width and height (only for <code>"rect"</code> type)  </td>
<td align="left"> rect</td>
</tr>
<tr>
<td align="left">shape.params.d                               </td>
<td align="left"> Path definition (only for <code>"path"</code> type)             </td>
<td align="left"> path</td>
</tr>
<tr>
<td align="left">shape.params.r                               </td>
<td align="left"> Circle radius                                      </td>
<td align="left"> circle</td>
</tr>
<tr>
<td align="left">shape.params.fill                            </td>
<td align="left"> Fill color, default: <code>"transparent"</code>                  </td>
<td align="left"> -</td>
</tr>
<tr>
<td align="left">shape.params.stroke                          </td>
<td align="left"> Stroke color, default: <code>"black"</code>                       </td>
<td align="left"> -</td>
</tr>
<tr>
<td align="left">shape.params.strokeWidth                     </td>
<td align="left"> Stroke width (and line width for path), default: <code>2</code> </td>
<td align="left"> -</td>
</tr>
</tbody>
</table>


<h3>Chart.annotations</h3>

<table>
<thead>
<tr>
<th align="left">Property                       </th>
<th align="left"> Description</th>
</tr>
</thead>
<tbody>
<tr>
<td align="left">chart.addAnnotation(options) </td>
<td align="left"> Add one annotation with given options</td>
</tr>
<tr>
<td align="left">chart.redrawAnnotations()     </td>
<td align="left"> Redraw all annotations</td>
</tr>
<tr>
<td align="left">chart.annotations.allItems     </td>
<td align="left"> Array containing all annotations</td>
</tr>
</tbody>
</table>


<h3>Annotation object</h3>

<table>
<thead>
<tr>
<th align="left">Property                   </th>
<th align="left"> Description</th>
</tr>
</thead>
<tbody>
<tr>
<td align="left">annotation.update(options) </td>
<td align="left"> Update an annotation with given options</td>
</tr>
<tr>
<td align="left">annotation.destroy()       </td>
<td align="left"> Destroy an annotation</td>
</tr>
<tr>
<td align="left">annotation.show()</td>
<td align="left"> Show an annotation - only for non-linked annotations</td>
</tr>
<tr>
<td align="left">annotation.hide()</td>
<td align="left"> Hide an annotation - only for non-linked annotations</td>
</tr>
<tr>
<td align="left">annotation.select()</td>
<td align="left"> Select an annotation by adding selection box</td>
</tr>
<tr>
<td align="left">annotation.deselect()</td>
<td align="left"> Deselect an annotation by removing selection box</td>
</tr>
</tbody>
</table>

<h3>Chart.annotationsOptions</h3>

<table>
<thead>
<tr>
<th align="left">Property                   </th>
<th align="left"> Description</th>
</tr>
</thead>
<tbody>
<tr>
<td align="left"> enabledButtons </td>
<td align="left"> Enable or disable buttons for drawing annotations. <br>
Selected button prevents from zooming and panning to draw annotation. </td>
</tr>
<tr>
<td align="left"> buttonsOffsets </td>
<td align="left"> Offsets for the buttons in array: <code>[x-offset, y-offset]</code>. Useful when placing annotations next to the exporting module, etc. Defaults to <code>[0, 0]</code>. </td>
</tr>
<tr>
<td align="left"> buttons      </td>
<td align="left"> Array of buttons. For example: 
<pre>{
	annotationEvents: {
		step: callback, // to be called during mouse drag for new annotation
		stop: callback  // to be called after mouse up / release
	},
	annotation: { // standard annotation options, used for new annotation
		anchorX: 'left',
		anchorY: 'top',
		xAxis: 0,
		yAxis: 0,
		shape: {
			type: 'path',
			params: {
				d: ['M', 0, 0, 'L', 100, 100 ]
			}
		}
	},
	symbol: { // button symbol options
		shape: 'rect', // shape, taken from Highcharts.symbols
		size: 12,
		style: {
			'stroke-width':  2,
			'stroke': 'black',
			fill: 'red',
			zIndex: 121
		}
	},
	style: { // buton style itself
		fill: 'black',
		stroke: 'blue',
		strokeWidth: 2,
	},
	size: 12, // buton size
	states: { // states for button 
		selected: {
			fill: '#9BD'
		},
		hover: {
			fill: '#9BD'
		}
	}
}</pre></td>
</tr>
</tbody>
</table>


<h2>Advanced demo</h2>


<div>Go to project page to see this module in action: http://blacklabel.github.io/annotations/</div>

