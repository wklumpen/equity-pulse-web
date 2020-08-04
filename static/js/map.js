/**
 * Region-specific map and charting code for TransitCenter's Equity project.
 * Table of Contents
 * -----------------
 * 1. Initializations
 * 2. Triggers and Events
 * 3. Display Functions
 *  3.1. Bottom Chart
 *  3.2. Time Slider
 *  3.3. Legend
 *  3.4. Styling
 */

// ==== 1. INITIALIZATIONS ====

// Bottom chart dimensions and margins
var bottomChartMargin = {top: 10, right: 20, bottom: 35, left: 60}
var bottomChartBoxWidth = d3.select("#bottom-chart").node().getBoundingClientRect().width
var bottomChartBoxHeight = d3.select("#bottom-chart").node().getBoundingClientRect().height
var bottomChartWidth = bottomChartBoxWidth - bottomChartMargin.left - bottomChartMargin.right
var bottomChartHeight = bottomChartBoxHeight - bottomChartMargin.top - bottomChartMargin.bottom

// Legend dimensions and margins
var legendMargin = {top: 10, right: 10, bottom: 10, left: 10}
var legendBoxHeight = d3.select("#legend").node().getBoundingClientRect().height
var legendBoxWidth = d3.select("#legend").node().getBoundingClientRect().width
var legendWidth =  legendBoxWidth - legendMargin.top - legendMargin.bottom
var legendHeight = legendBoxHeight - legendMargin.left - legendMargin.right

// Plot chart dimensions and margins
var plotMargin = {top: 10, right: 10, bottom: 35, left: 50}
var plotBoxHeight = d3.select("#plot").node().getBoundingClientRect().height
var plotBoxWidth = d3.select("#plot").node().getBoundingClientRect().width
var plotWidth = plotBoxWidth - plotMargin.left - plotMargin.right
var plotHeight = plotBoxHeight - plotMargin.top - plotMargin.bottom

// Keeping track of what data is currently displayed
var zoneKey = 'all'
var measureKey = 'A_C000_c30_<DATE>_MP'
var overlayKey = 'all'
var dateKey = '30062020'
var tag = view['name']  // Keeps track of the geographical tag for the region

var bgScore = {}
var bgPop = {}

var bg = null

// TEMP Variable
var scoreURL = "/data/score/" + view['name'] + "/" + measureKey.replace("<DATE>", dateKey)
var popURL = null
var timeURL = "/data/time/" + view['name'] + "/" + measureKey.replace("_<DATE>", "")
console.log(timeURL)

// Variables to hold the current data for visualization, etc.
var scoreData = {'title': null, 'label': null, data: []}
var overlayData = {'title': null, 'label': null, data: []}
var timeData = {'title': null, 'label': null, data: []}

// Array to hold layer groups for filtering
var areaGroups = []

// Define a date parsing function for the data
var parseDate = d3.timeParse("%Y-%m-%d");

// Placeholder data for testing. Will be loaded
var dateData = [new Date(2020, 1, 29), new Date(2020, 5, 30)]

// Loading splash (placeholder for now)
var $loading = $('#loading').hide();
$(document)
  .ajaxStart(function () {
    $loading.show();
  })
  .ajaxStop(function () {
    $loading.hide();
  });

// Initialze map object. View is set in html code by backend
var map = L.map('map').setView([view['lat'], view['lon']], zoom);

// Load the basemap layer - currently using CartoDB Greyscale.
var cartoLight = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
}).addTo(map);

// Create SVG for the time series chart on the bottom
var bottomSvg = d3.select("#bottom-chart")
  .append('svg')
  .attr("width", bottomChartBoxWidth)
  .attr("height", bottomChartBoxHeight)
  .append('g')
  .attr("transform", "translate(" + bottomChartMargin.left + "," + bottomChartMargin.top + ")");

// Create the legend SVG
var legendSvg = d3.select("#legend")
  .append('svg')
  .attr("width", legendBoxWidth)
  .attr("height", legendBoxHeight)
  .append('g')
  .attr("transform", "translate(" + legendMargin.left + "," + legendMargin.top + ")");

// Create the plot SVG for the scatter/histogram plots
var plotSvg = d3.select("#plot")
  .append('svg')
  .attr("width", plotBoxWidth)
  .attr("height", plotBoxHeight)
  .append('g')
  .attr("transform", "translate(" + plotMargin.left + "," + plotMargin.top + ")")

// Initiate the slider
var sliderTime = d3
  .sliderBottom()
  .min(d3.min(dateData))
  .max(d3.max(dateData))
  .width(bottomChartWidth)
  .tickFormat(d3.timeFormat('%b %d'))
  .tickValues(dateData)
  .fill('#2d74ed')
  .marks(dateData) // Allows for irregular steps as needed
  .default(dateData[dateData.length - 1])
  .on('end', val => {
    sliderTrigger(val);
  });

var sliderSvg = d3.select('#time-slider')
  .append('svg')
  .attr('width', bottomChartBoxWidth)
  .attr('height', 50)
  .append('g')
  .attr('transform', 'translate(' + bottomChartMargin.left + ', 7)')
  .call(sliderTime)

initialize();

function initialize(){
  // Load the appropriate GeoJSON Data with an AJAX call
  // First, we need to divide the map up into the appropriate areas

  bg = new L.GeoJSON.AJAX(bgURL,{
    style: bgStyleDefault,
  }).addTo(map);

  measureChanged(measureKey)
}

// Divide the layer into different groups as needed for filtering
// (Currently sorting based on GEOID as a placeholder)
// ==== 2. TRIGGERS AND EVENTS ====

/**
 * Trigger function when zone context area is changed
 * @param {String} newZoneKey Key used to filter the zones
*/
function zoneChanged(newZoneKey){
  zoneKey = newZoneKey
  if (zoneKey == 'msa'){
    tag = view['name'] + "-msa"
  }
  else{
    tag = view['name']
  }
  measureChanged(measureKey);
}

/**
 * Trigger function when map measure is changed
 * @param {String} newMeasureKey Key used to select the data.
 */
function measureChanged(newMeasureKey){
  measureKey = newMeasureKey.replace("<DATE>", dateKey)
  var measureType = measureKey.charAt(0);

  if (measureType == 'A'){
    var score = []
    bgScore = {}

    // Update the data URL
    scoreURL = "/data/score/" + tag + "/" + measureKey
    // Update the time series URL
    timeURL = "/data/time/" + tag + "/" + measureKey.replace("_" + dateKey, "")

    console.log(timeURL)

    // Load the data we need TODO: Only load if not already loaded?
    $.getJSON(scoreURL, function(data) {
      $.each( data, function( key, val ) {
        bgScore[parseInt(val['block_group']['id'])] = parseFloat(val['score'])
        score.push(parseFloat(val['score']))
      });

    }).done( function (data) {
      var min = d3.min(score) // D3 ignores invalid data
      var max = d3.max(score)

      score = score.filter(Boolean).sort(d3.ascending)
      // console.log(score.filter(Boolean));
      
      bg.setStyle(function(feature){
        return {
          fillColor: getQuartileColor(bgScore[parseInt(feature.properties.GEOID)], score),
          color: getQuartileColor(bgScore[parseInt(feature.properties.GEOID)], score),
          fillOpacity: 0.4,
          opacity: 0.4
        }
      })
      if (measureKey.split("_")[1].charAt(0) == 'C'){
        setLegendBins(getQuartileLabels(score, "jobs"), "Access to Jobs");
      }
      else{
        setLegendBins(getQuartileLabels(score, "min"), "Travel Times");
      }
      
      histogram(score, 10, "Score", "Block Groups")
    })

    // Now let's grab the time series data also and update the time series plot
    var timeSeriesData = []

    $.getJSON(timeURL, function(data) {
      $.each( data.date, function( key, val ) {
        timeSeriesData.push({"date": parseDate(val), "score": parseFloat(data.score[key])})
      });

    }).done(function (data) {
      timeSeriesBottom(timeSeriesData, "Date", "Score");
    });
  }
}

function overlayChanged(newOverlayKey){
  overlayKey = newOverlayKey
  console.log(overlayKey)
  if (overlayKey == 'poverty'){
    var population = []
    var populations = {}
    // Let's update the plot for funzies.
    popURL = "/data/pop/" + tag + "/pop_poverty"
    $.getJSON(popURL, function(data) {
      $.each( data, function( key, val ) {
        bgPop[parseInt(val['block_group']['id'])] = parseFloat(val['value'])
        population.push(parseFloat(val['value']))
      });

    }).done( function (data) {
      var plotData = []
      for (var key of Object.keys(bgPop)) {
        plotData.push({'x': bgPop[key], 'y': bgScore[key]})
    }
      scatterPlot(plotData, "Number of People Below Poverty Line", "Travel Time (min)")
    });
  }

  else if (overlayKey == 'none'){
    plotData = []
    for (var key of Object.keys(bgScore)){
      plotData.push(bgPop[key])
    }
    histogram(plotData, 10, "Score", "# of Block Groups")
  }
}

function updatePlot(){

}

/* Placeholder function for area filtering TO BE UPDATED AND REMOVED */
/**
 * Toggle area to display
 * @param {String} area Area keyword
 */
function toggleArea(area){
  if(area == 'all'){
    var lg = areaGroups['even'];
    map.addLayer(lg);
  }
  else{
    var lg = areaGroups['even'];
    map.removeLayer(lg);
  }
}

function sliderTrigger(value){
  var m = moment(value) // Easier to format using moments.
  dateKey = m.format('DDMMYYYY')
  var newMeasureKey = measureKey.split('_').slice(0, 3).join("_") + "_" +  m.format('DDMMYYYY') + "_" + measureKey.split('_')[4]
  measureChanged(newMeasureKey);
}

// ==== 3. DISPLAY FUNCTIONS ====

// ======== 3.1. BOTTOM CHART ====
/**
* Creates a histogram in the bottom chart panel
* @param {Array} data Array of values to chart
* @param {Number} bins The number of bins for the histogram
* @param {String} xlabel The label for the x-axis
* @param {String} ylabel The label for the y-axis
*/
function histogram(data, bins, xlabel, ylabel){
  plotSvg.selectAll("*").remove();

  // Create the x range
  var x = d3.scaleLinear()
    .domain(d3.extent(data))
    .rangeRound([0, plotWidth]);

  // Create the y range
  var y = d3.scaleLinear()
    .range([plotHeight, 0]);

  // Set the parameters for the histogram
  var histogram = d3.histogram()
    .domain(x.domain())
    .thresholds(x.ticks(bins));

  // Group the data for the bars
  var histBins = histogram(data);

  // Scale the range of the data in the y domain
  y.domain([0, d3.max(histBins, function(d) { return d.length; })]);
  // Append the bar rectangles to the svg element
  plotSvg.selectAll("rect")
    .data(histBins)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", 1)
    .attr("transform", function(d) {
    return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
    .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
    .attr("height", function(d) { return plotHeight - y(d.length); });

  // Add the x-axis
  plotSvg.append("g")
    .attr("transform", "translate(0," + plotHeight + ")")
    .call(d3.axisBottom(x));

  // Add the y-axis
  plotSvg.append("g")
    .call(d3.axisLeft(y));

  // Label the x-axis
  plotSvg.append("text")             
    .attr("transform", "translate(" + (plotWidth/2) + " ," + (plotHeight + plotMargin.top + 18) + ")")
    .style("text-anchor", "middle")
    .style('font-weight', 'bold')
    .text(xlabel);

  // Label the y-axis
  plotSvg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - plotMargin.left)
    .attr("x",0 - (plotHeight / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style('font-weight', 'bold')
    .text(ylabel);  
}

/**
* Creates a histogram in the bottom chart panel
* @param {Array} data Array of values to chart
* @param {String} xlabel The label for the x-axis
* @param {String} ylabel The label for the y-axis
*/
function scatterPlot(data, xlabel, ylabel){
  plotSvg.selectAll("*").remove();

  // Add X axis
  var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) {return d.x}))
    .range([0, plotWidth ]);

    plotSvg.append("g")
    .attr("transform", "translate(0," + plotHeight + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain(d3.extent(data, function(d) {return d.y}))
    .range([ plotHeight, 0]);

    plotSvg.append("g")
    .call(d3.axisLeft(y));

  // Add dots
  plotSvg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d.x); } )
    .attr("cy", function (d) { return y(d.y); } )
    .attr("r", 1.5)
    .style("fill", "#69b3a2")
    .style("opacity", 0.7)

  // Label the x-axis
  plotSvg.append("text")             
    .attr("transform", "translate(" + (plotWidth/2) + " ," + (plotHeight + plotMargin.top + 18) + ")")
    .style("text-anchor", "middle")
    .style('font-weight', 'bold')
    .text(xlabel);

  // Label the y-axis
  plotSvg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - plotMargin.left)
    .attr("x",0 - (plotHeight / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style('font-weight', 'bold')
    .text(ylabel); 
}

/**
* Creates a time series plot in the bottom chart panel
* @param {Array} data Array of values to chart
*/
function timeSeriesBottom(data, xlabel, ylabel){
  bottomSvg.selectAll("*").remove();

  var x = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([0, bottomChartWidth])
  
  bottomSvg.append("g")
    .attr("transform", "translate(0," + bottomChartHeight + ")")
    .call(d3.axisBottom(x));

  var y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.score)])
    .range([ bottomChartHeight, 0]);

  bottomSvg.append("g")
    .call(d3.axisLeft(y));

  // Add line for line char
  bottomSvg.append("path")
    .data([data])
    .style('fill', 'none')
    .style('stroke', 'black')
    .style('stroke-width', "2px")
    .attr('d', d3.line()
      .x(d => x(d.date))
      .y(d => y(d.score)
      )
    )

  // Add circles to make things clearer
  bottomSvg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.date))
    .attr("cy", d => y(d.score))
    .attr("r", 7)
    .style("fill", "#2d74ed")
    .style("opacity", 0.7)

    // Label the x-axis
  bottomSvg.append("text")             
    .attr("transform", "translate(" + (bottomChartWidth/2) + " ," + (bottomChartHeight + bottomChartMargin.top + 18) + ")")
    .style("text-anchor", "middle")
    .style('font-weight', 'bold')
    .text(xlabel);

  // Label the y-axis
  bottomSvg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - bottomChartMargin.left)
    .attr("x",0 - (bottomChartHeight / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style('font-weight', 'bold')
    .text(ylabel); 
}

// ======== 3.2. TIME SLIDER ====


// ======== 3.3. LEGEND ====

function clearLegend(){
  legendSvg.selectAll("*").remove();
}

function setLegendBins(bins, title){
  clearLegend();
  legendSvg.selectAll("legendCircles")
    .data(bins)
    .enter()
    .append('circle')
    .attr('cx', legendMargin.left)
    .attr('cy', function(d, i){return legendMargin.top + 20 + i*20})
    .attr('r', 6)
    .style('fill', d => d.color)
    .style('stroke', 'black')
  
  legendSvg.selectAll("legendLabels")
    .data(bins)
    .enter()
    .append('text')
    .attr('x', legendMargin.left + 20)
    .attr('y', function(d, i){return legendMargin.top + 20 + i*20})
    .style('fill', 'black')
    .text(d => d.label)
    .attr('text-anchor', 'left')
    .style('alignment-baseline', 'middle')
    .style('font-size', '1.4em')
  
  legendSvg.append('text')
    .attr('x', legendMargin.left)
    .attr('y', legendMargin.top)
    .text(title)
    .attr('text-anchor', 'left')
    .style('font-size', '1.8em')
}

// ==== 3.4 STYLING ====

// Style function for the block groups
function bgStyleDefault(feature) {
  return {
    fillColor: 'none',
    weight: 1,
    opacity: 0.1,
    color: 'none',
    fillOpacity: 0.2
  };
}

// Default Placeholder Function (not currently used)
function getColorPercent(d) {
  return  d > 80 ? "#edf8fb": 
          d > 60 ? "#b3cde3": 
          d > 40 ? "#8c96c6": 
          d > 20 ? "#8856a7" : 
          "#810f7c";
}

/**
 * Get a color scheme based on five equal ranges.
 * @param {*} d Value to colorize
 * @param {Number} min Minimum value in data range
 * @param {Number} max Maximum value in data range
 */
function getFiveBinColor(d, min, max) {
  // Handle NAN Values
  if(isNaN(d)){
    return "#717678";
  }
  else {
    return  d > 4*(max-min)/5 + min ? "#810f7c": 
    d > 3*(max-min)/5 + min ? "#8856a7":
    d > 2*(max-min)/5 + min ? "#8c96c6": 
    d > 1*(max-min)/5 + min ? "#b3cde3": 
    "#edf8fb";
  }
}

/**
 * Get a color scheme based on five equal ranges. Note that the `data` array
 * passed to the function must have all NaN's removed and have been sorted,
 * ideally using d3.ascending.
 * @param {*} d Value to colorize
 * @param {Array} data Sorted, clean dataset to use for quartiles.
 */
function getQuartileColor(d, data) {
  // Handle NAN Value label
  if(isNaN(d)){
    return "#717678";
  }
  else {
    return  d >= d3.quantile(data, 0.75) ? "#810f7c": 
    d >= d3.quantile(data, 0.5) ? "#8856a7":
    d >= d3.quantile(data, 0.25) ? "#8c96c6":
    "#edf8fb";
  }
}

/**
 * Get color scheme labels on five equal ranges.
 * @param {Number} min Minimum value in data range
 * @param {Number} max Maximum value in data range
 */
function getFiveBinLabels(min, max, unit){
  return [
    {'label': styleNumbers(min) + " to " + styleNumbers(min + (max-min)/5) + " " + unit, 'color': '#edf8fb'},
    {'label': styleNumbers(min + (max-min)/5) + " to " + styleNumbers(min + 2*(max-min)/5)+ " " + unit, 'color': '#b3cde3'},
    {'label': styleNumbers(min + 2*(max-min)/5) + " to " + styleNumbers(min + 3*(max-min)/5)+ " " + unit, 'color': '#8c96c6'},
    {'label': styleNumbers(min + 3*(max-min)/5) + " to " + styleNumbers(min + 4*(max-min)/5)+ " " + unit, 'color': '#8856a7'},
    {'label': styleNumbers(min + 4*(max-min)/5) + " to " + styleNumbers(max)+ " " + unit, 'color': '#810f7c'},
    {'label': "No data", 'color': '#717678'},
  ]
}

/**
 * Colour labels based on quartiles.
 * @param {Number} data Data to quartile.
 */
function getQuartileLabels(data, unit){
  // Drop out the NaNs
  data = data.filter(Boolean)
  return [
    {'label': styleNumbers(d3.quantile(data, 0)) + " to " + styleNumbers(d3.quantile(data, 0.25)) + " " + unit, 'color': '#edf8fb'},
    {'label': styleNumbers(d3.quantile(data, 0.25)) + " to " + styleNumbers(d3.quantile(data, 0.50))+ " " + unit, 'color': '#b3cde3'},
    {'label': styleNumbers(d3.quantile(data, 0.50)) + " to " + styleNumbers(d3.quantile(data, 0.75))+ " " + unit, 'color': '#8c96c6'},
    {'label': "More than " + styleNumbers(d3.quantile(data, 0.75)) + " " + unit, 'color': '#8856a7'},
    {'label': "No data", 'color': '#717678'},
  ]
}


function styleNumbers(val){
  if (Math.abs(val) >= 1000){
    return val.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  else if (Math.abs(val) > 10){
    return val.toFixed(0)
  }
  else{
    return val.toFixed(2)
  }
}