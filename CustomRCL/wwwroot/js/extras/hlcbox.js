/**
 *	8.4.0
 *	Generation date: 2022-03-01T17:32:08.152Z
 *	Client name: microsoft
 *	Package Type: Technical Analysis
 *	License type: trial
 *	Expiration date: "2022/03/23"
 *	iFrame lock: true
 */

/***********************************************************
 * Copyright by ChartIQ, Inc.
 * Licensed under the ChartIQ, Inc. Developer License Agreement https://www.chartiq.com/developer-license-agreement
*************************************************************/
/*************************************** DO NOT MAKE CHANGES TO THIS LIBRARY FILE!! **************************************/
/* If you wish to overwrite default functionality, create a separate file with a copy of the methods you are overwriting */
/* and load that file right after the library has been loaded, but before the chart engine is instantiated.              */
/* Directly modifying library files will prevent upgrades and the ability for ChartIQ to support your solution.          */
/*************************************************************************************************************************/
/* eslint-disable no-extra-parens */


/*
	HLC Box
	===============
	Supports the HLC Box and HLC Shaded Box renderers.
*/
import { CIQ } from "../../chartiq.js";
/**
 * Draws a "high/low/close" box on the chart. It can be called on the primary chart panel or on a study panel.
 *
 * **Requires "js/extras/hlcbox.js"**
 *
 * Default colors for this renderer, when used as a basic chart type, are set by CSS style `stx_hlcbox_chart`.
 * Example:
 * ```
 *	.stx_hlcbox_chart {
 *		color: xxx;
 *		border-left-color: yyy;
 *		background-color: zzz;
 *	}
 *```
 * where xxx is the fillColor, yyy is the borderColor, and zzz is the shadeColor.
 *
 * Visual Reference: Default<br>
 * ![hlc_box](img-hlc_box.png "hlc_box")
 *
 * Visual Reference: Shaded Box<br>
 * ![hlc_shaded_box](img-hlc_shaded_box.png "hlc_shaded_box")
 *
 * @param  {object} params Rendering parameters
 * @param  {boolean} [params.shaded] True for shaded box
 * @param  {string} [params.fillColor] Interior color of bar
 * @param  {string} [params.borderColor] Border color of bar
 * @param  {string} [params.shadeColor] Shading/Close color of bar
 * @param  {CIQ.ChartEngine.Panel} [params.panel] Panel to render upon
 * @param  {string} [params.high=High] Optional override of High field name
 * @param  {string} [params.low=Low] Optional override of Low field name
 * @param  {string} [params.close=Close] Optional override of Close field name
 * @param  {boolean} [params.clip=true] Set to false to disable clipping to plot area
 * @param  {number} [params.widthFactor] If set, will use as the fraction of the candlewidth to use for the width of the bars
 * @return {object} Data generated by the plot, such as colors used if a colorFunction was passed, and the vertices of the line (points).
 * @memberOf CIQ.ChartEngine
 * @version ChartIQ Extras Package
 * @since
 * - 4.0.0
 * - 5.1.0 You can now set as primary chart type without an injection simply by calling: `stxx.setChartType("hlc_box");` or `stxx.setChartType("hlc_shaded_box");`. You must include `extras/hlcbox.js`.
 * - 5.1.0 Now returns an object.
 *
 * @example <caption>Used as a primary chart type :</caption>
 * stxx.setChartType("hlc_box");
 * // or
 * stxx.setChartType("hlc_shaded_box");
 *
 * @example <caption>Used as an additional series :</caption>
 * stxx.addSeries('GE',{renderer:'HLCBox'});
 *
 * @example <caption>Used as in a study panel :</caption>
 * CIQ.Studies.studyLibrary["Bollinger Profile"]={
 *	"name": "Bollinger Profile",
 *	"calculateFN": CIQ.Studies.calculateBollinger,
 *	"seriesFN": function(stx,sd,quotes){
 *		stx.drawHLCBox({
 *			panel:stx.panels[sd.panel],
 *			fillColor:sd.outputs["Bollinger Profile Top"],
 *			shadeColor:sd.outputs["Bollinger Profile Median"],
 *			shaded:true,
 *			high:"Bollinger Profile Top "+sd.name,
 *			low:"Bollinger Profile Bottom "+sd.name,
 *			close:"Bollinger Profile Median "+sd.name,
 *			widthFactor:0.9
 *		});
 * 	},
 *	"inputs": {"Field":"field", "Period":20, "Standard Deviations": 2, "Moving Average Type":"ma", "Channel Fill": true},
 *	"outputs": {"Bollinger Profile Top":"auto", "Bollinger Profile Median":"auto", "Bollinger Profile Bottom":"auto"},
 *	"attributes": {
 *		"Standard Deviations":{min:0.1,step:0.1}
 *	}
 * };
 *
 */
CIQ.ChartEngine.prototype.drawHLCBox = function (params) {
	var shaded = params.shaded,
		panel = params.panel,
		fillColor = params.fillColor,
		borderColor = params.borderColor,
		shadeColor = params.shadeColor,
		widthFactor = params.widthFactor;
	if (typeof panel == "string") panel = this.panels[panel];
	var chart = panel.chart,
		quotes = chart.dataSegment,
		context = chart.context,
		t = panel.yAxis.top,
		b = panel.yAxis.bottom,
		clip = true;
	// Optional custom fields
	var closeField = params.close,
		highField = params.high,
		lowField = params.low;
	if (!closeField) closeField = "Close";
	if (!highField) highField = "High";
	if (!lowField) lowField = "Low";
	var yValueCache = new Array(quotes.length);
	if (params.clip === false) clip = false;
	if (clip) this.startClip(panel.name);
	var borderOffset = 0;
	if (CIQ.isTransparent(fillColor) || fillColor == "auto") {
		if (!borderColor) borderColor = this.defaultColor;
		fillColor = this.containerColor;
	}
	if (borderColor && !CIQ.isTransparent(borderColor)) borderOffset = 0.5;
	context.fillStyle = fillColor;
	if (!params.highlight && this.highlightedDraggable)
		context.globalAlpha *= 0.3;
	var cache = [];
	var leftTick = chart.dataSet.length - chart.scroll - 1;
	context.beginPath();
	var field = params.field;
	var yAxis = params.yAxis || panel.yAxis;
	var candleWidth = this.layout.candleWidth;
	var xbase = panel.left - 0.5 * candleWidth + this.micropixels - 1;
	var defaultWhitespace =
		(widthFactor ? candleWidth * widthFactor : chart.tmpWidth) / 2; //for each side of the candle
	var voffset = context.lineWidth / 2;
	for (var x = 0; x <= quotes.length; x++) {
		var whitespace = defaultWhitespace;
		xbase += candleWidth / 2; //complete previous candle
		candleWidth = this.layout.candleWidth;
		xbase += candleWidth / 2; // go to center of new candle
		var quote = quotes[x];
		if (!quote) continue;
		if (quote.projection) continue;
		if (quote.candleWidth) {
			xbase += (quote.candleWidth - candleWidth) / 2;
			candleWidth = quote.candleWidth;
			if (widthFactor) whitespace = (candleWidth * widthFactor) / 2;
			else if (candleWidth < chart.tmpWidth) whitespace = candleWidth / 2;
		}
		if (chart.transformFunc && yAxis == chart.panel.yAxis && quote.transform)
			quote = quote.transform;
		if (quote && field) quote = quote[field];
		if (!quote && quote !== 0) continue;
		var Close = quote[closeField];
		var tick = leftTick + x;
		var Top = quote[highField] === undefined ? Close : quote[highField];
		var Bottom = quote[lowField] === undefined ? Close : quote[lowField];
		// inline version of pixelFromTransformedValue() for efficiency
		var t1 = yAxis.semiLog
			? yAxis.height *
			  (1 -
					(Math.log(Math.max(Top, 0)) / Math.LN10 - yAxis.logLow) /
						yAxis.logShadow)
			: (yAxis.high - Top) * yAxis.multiplier;
		var b1 = yAxis.semiLog
			? yAxis.height *
			  (1 -
					(Math.log(Math.max(Bottom, 0)) / Math.LN10 - yAxis.logLow) /
						yAxis.logShadow)
			: (yAxis.high - Bottom) * yAxis.multiplier;
		var c1 = yAxis.semiLog
			? yAxis.height *
			  (1 -
					(Math.log(Math.max(Close, 0)) / Math.LN10 - yAxis.logLow) /
						yAxis.logShadow)
			: (yAxis.high - Close) * yAxis.multiplier;
		if (yAxis.flipped) {
			t1 = yAxis.bottom - t1;
			b1 = yAxis.bottom - b1;
			c1 = yAxis.bottom - c1;
		} else {
			t1 += yAxis.top;
			b1 += yAxis.top;
			c1 += yAxis.top;
		}
		yValueCache[x] = c1;
		var pxTop = Math.floor(Math.min(t1, b1)); //+borderOffset;
		var pxBottom = Math.max(t1, b1);
		var pxClose = c1;
		var length = Math.floor(pxBottom - pxTop);
		if (pxTop < t) {
			if (pxTop + length < t) continue;
			length -= t - pxTop;
			pxTop = t;
		}
		if (pxTop + length > b) {
			length -= pxTop + length - b;
		}
		length = Math.max(length, 2);
		pxBottom = pxTop + length;
		if (pxTop >= b) continue;
		if (pxBottom <= t) continue;
		// To avoid fuzziness, without candle borders we want to land on an even number
		// With candle borders we want to land on .5 so we add the borderOffset
		// But with candle borders the borderOffset makes it slightly wider so we make the width 1 pixel less
		var flr_xbase = Math.floor(xbase) + 0.5;
		var xstart = Math.floor(flr_xbase - whitespace); //+borderOffset;
		var xend = Math.round(flr_xbase + whitespace); //-borderOffset;
		if (pxTop != pxBottom) {
			var highlightOffset = 0;
			if (xend - xstart <= 2) {
				if (params.highlight) highlightOffset = borderOffset;
			}
			context.rect(
				xstart - highlightOffset,
				Math.min(pxTop, pxBottom) - highlightOffset,
				Math.max(1, xend - xstart + 2 * highlightOffset),
				Math.max(1, Math.abs(pxBottom - pxTop) + 2 * highlightOffset)
			);
			cache.push({
				left: xstart,
				right: xend,
				top: pxTop,
				close: pxClose,
				bottom: pxBottom
			});
		}
	}
	context.fill();
	var c, point, pl, pr, pt, pc, pb;
	if (shadeColor && !CIQ.isTransparent(shadeColor)) {
		if (shadeColor == "auto") shadeColor = this.defaultColor;
		context.beginPath();
		for (c = 0; c < cache.length; c++) {
			context.fillStyle = context.strokeStyle = shadeColor;
			for (c = 0; c < cache.length; c++) {
				point = cache[c];
				pl = point.left;
				pr = point.right;
				pc = point.close;
				pt = point.top;
				pb = point.bottom;
				if (shaded) {
					context.rect(
						pl,
						pc,
						Math.max(1, pr - pl),
						yAxis.flipped ? -Math.max(1, pc - pt) : Math.max(1, pb - pc)
					);
				} else {
					context.moveTo(pl, pc);
					context.lineTo(pr, pc);
				}
			}
		}
		context[shaded ? "fill" : "stroke"]();
	}
	if (borderOffset) {
		context.lineWidth = 1;
		if (params.highlight) context.lineWidth *= 2;
		context.strokeStyle = borderColor;
		context.beginPath();
		for (c = 0; c < cache.length; c++) {
			point = cache[c];
			pl = point.left - borderOffset;
			pr = point.right + borderOffset;
			pt = point.top - borderOffset;
			pb = point.bottom + borderOffset;
			if (point.right - point.left > 2) {
				context.rect(pl, pt, Math.max(1, pr - pl), Math.max(1, pb - pt));
			}
		}
		context.stroke();
	}
	if (clip) this.endClip();
	var colors = [fillColor];
	if (shaded) colors.push(shadeColor);
	return {
		colors: colors,
		cache: yValueCache
	};
};
/**
 * Creates a "high/low/close" box renderer.
 *
 * **Requires "js/extras/hlcbox.js"**
 *
 * See {@link CIQ.ChartEngine#drawHLCBox} for color parameters.
 * @constructor
 * @name  CIQ.Renderer.HLCBox
 * @version ChartIQ Extras Package
 */
CIQ.Renderer.HLCBox = function (config) {
	this.construct(config);
	var params = this.params;
	this.highLowBars = this.barsHaveWidth = this.standaloneBars = true;
};
CIQ.inheritsFrom(CIQ.Renderer.HLCBox, CIQ.Renderer.OHLC, false);
CIQ.Renderer.HLCBox.requestNew = function (featureList, params) {
	var type = null,
		isShaded = false,
		step = 0;
	for (var pt = 0; pt < featureList.length; pt++) {
		var pType = featureList[pt];
		if (pType == "shaded") isShaded = true;
		else if (pType == "hlc") step++;
		else if (pType == "box") step++;
		else return null; // invalid chartType for this renderer
	}
	if (step != 2) return null;
	return new CIQ.Renderer.HLCBox({
		params: CIQ.extend(params, { type: "hlcbox", shaded: isShaded })
	});
};
CIQ.Renderer.HLCBox.prototype.getColor = function (
	stx,
	panel,
	style,
	isBorder,
	isBackground,
	overrideColor
) {
	if (overrideColor) return overrideColor;
	var color = style.color;
	if (isBorder) {
		color = style["border-left-color"];
		if (!color) color = style.borderLeftColor; //IE
		if (!color) return null;
	}
	if (isBackground) {
		color = style.backgroundColor;
	}
	return color;
};
CIQ.Renderer.HLCBox.prototype.drawIndividualSeries = function (
	chart,
	parameters
) {
	var stx = this.stx,
		panel = stx.panels[parameters.panel] || chart.panel;
	var styleArray = stx.canvasStyle("stx_hlcbox_chart");
	var fillColor = this.getColor(
		stx,
		panel,
		styleArray,
		false,
		false,
		parameters.fillColor
	);
	var borderColor = this.getColor(
		stx,
		panel,
		styleArray,
		true,
		false,
		parameters.borderColor
	);
	var shadeColor = this.getColor(
		stx,
		panel,
		styleArray,
		false,
		true,
		parameters.shadeColor
	);
	return this.stx.drawHLCBox({
		panel: panel,
		fillColor: fillColor,
		shadeColor: shadeColor,
		borderColor: borderColor,
		shaded: parameters.shaded,
		widthFactor: parameters.widthFactor,
		field: parameters.field,
		yAxis: parameters.yAxis,
		highlight: parameters.highlight
	});
};
