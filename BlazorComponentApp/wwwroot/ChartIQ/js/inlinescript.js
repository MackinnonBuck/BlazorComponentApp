    // This inline script acts as the entry point, without creating a separate external file.

    import "./advanced.js";
    import "./addOns.js";
    import {CIQ} from "./components.js";

    /* Uncomment the following to access deprecated functions and namespaces. */
    //import "./js/deprecated.js";

    /* Uncomment the following lines if you are using these plug-ins. */
    //import "./plugins/activetrader/cryptoiq.js";
    //import "./plugins/analystviews/components.js";
    //import "./plugins/scriptiq/scriptiq.js";
    //import "./plugins/technicalinsights/components.js";
    //import "./plugins/tfc/tfc-loader.js";
    //import "./plugins/timespanevent/timespanevent.js";
    //import "./plugins/visualearnings/visualearnings.js";

    /* Uncomment the following for the L2 simulator (required for the activetrader sample). */
    //import "./examples/feeds/L2_simulator.js";

    /* Template-specific imports */
    import getDefaultConfig from "./defaultConfiguration.js";

    //import "./examples/help/helpContent.js";

    import PerfectScrollbar from "./thirdparty/perfect-scrollbar.esm.js";

    import quotefeed from "./examples/feeds/quoteFeedSimulator.js";
    import "./examples/feeds/symbolLookupChartIQ.js";

    import "./examples/markets/marketDefinitionsSample.js";
    import "./examples/markets/marketSymbologySample.js";

    import marker from "./examples/markers/markersSample.js";
    import "./examples/markers/tradeAnalyticsSample.js";
    import "./examples/markers/videoSample.js";

    import "./examples/translations/translationSample.js";

    /* Remove if not using the forecasting simulator (required for the forecasting sample). */
    import forecastfeed from "./examples/feeds/quoteFeedForecastSimulator.js";

    /* Uncomment the following import statement to enable the Option Sentiment by Strike study. */
    //import "./js/extras/optionSentimentByStrike.js";

    /*
     * Uncomment the following import statement to access the option chain simulator for option-based
     * functionality, such as the Option Sentiment By Strike study.
     *
     * Make the option chain simulator the chart data source by setting the quoteFeed property (in
     * the object parameter of the getDefaultConfig function call below) to the optionfeed variable,
     * for example:
     *
     *     const config = getDefaultConfig({
     * markerSample: marker.MarkersSample,
    *         scrollStyle: PerfectScrollbar,
    *         quoteFeed: optionfeed,  // Provides simulated quote data and option data.
    *         forecastQuoteFeed: forecastfeed,
    *         nameValueStore: CIQ.NameValueStore
     *     });
    */
    //import optionfeed from "./examples/feeds/optionChainSimulator.js";

    // Create and customize default configuration


    const config = getDefaultConfig({
        markerSample: marker.MarkersSample,
    scrollStyle: PerfectScrollbar,
    nameValueStore: CIQ.NameValueStore
    });


    // Create the chart...
    window.stxx = config.createChart();
    stxx = window.stxx;


    stxx.addEventListener("symbolChange", function (data) {
        window.postMessage({ "MessageType": "symbolChange", "Symbol": data.symbol, "Action": data.action });
    });

    window.loadNewChart = function loadNewChart(symbol, msg) {
        stxx.loadChart(symbol, {
            masterData: eval(msg),
            periodicity: {
                period: 1,
                timeUnit: "day"
            }
        });
    }

    window.addToChart = function addToChart(symbol, msg) {
        stxx.addSeries(symbol, {
            isComparison: true,
            data: eval(msg)
        });
    }

    window.postMessage = function postMessage(msg) {
        try {
            if (window?.chrome?.webview) {
                window.chrome.webview.postMessage(msg);
            } else if (window?.webkit?.messageHandlers?.jsBridge) {
                window.webkit.messageHandlers.jsBridge.postMessage(msg);
            }
        } catch (err) {

        }
    }

    window.updateData = function updateData(msg) {
        stxx.updateChartData(eval(msg));
    }

    window.postMessage({ "MessageType": "ready" });

		// Simulate L2 data
		// In your implementation, you must instead load L2 data
		// using https://documentation.chartiq.com/CIQ.ChartEngine.html#updateCurrentMarketData
		//CIQ.simulateL2({stx: stxx, onInterval: 1300, onTrade: true });

//...then add whatever code you wish!

