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
var chartMargin = {top: 10, right: 10, bottom: 35, left: 45}
var chartBoxHeight = d3.select("#bottom-chart").node().getBoundingClientRect().height
var chartBoxWidth = d3.select("#bottom-chart").node().getBoundingClientRect().width
var chartHeight = chartBoxHeight - chartMargin.top - chartMargin.bottom
var chartWidth = chartBoxWidth - chartMargin.left - chartMargin.right

var legendMargin = {top: 10, right: 10, bottom: 10, left: 10}
var legendBoxWidth = d3.select("#legend").node().getBoundingClientRect().height
var legendBoxHeight = d3.select("#legend").node().getBoundingClientRect().width
var legendWidth =  legendBoxWidth - legendMargin.top - legendMargin.bottom
var legendHeight = legendBoxHeight - legendMargin.left - legendMargin.right

var themeKey = 'access'
var zoneKey = 'all'
var measureKey = 'A_C000_c30_<DATE>_MP'
var demoKey = 'all'
var dateKey = '30062020'
var popKey = null

var bgScore = {}
var bgPop = {}

// TEMP Variable
var scoreURL = "/data/score/" + view['name'] + "/" + measureKey.replace("<DATE>", dateKey)
var popURL = null

// Placeholder data for testing. Will be loaded
var dateData = [new Date(2020, 1, 29), new Date(2020, 5, 30)]

// Array to hold layer groups for filtering
var areaGroups = []

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

// Create SVG for the bottom chart
var bottomSvg = d3.select("#bottom-chart")
  .append('svg')
  .attr("width", chartBoxWidth)
  .attr("height", chartBoxHeight)
  .append('g')
  .attr("transform", "translate(" + chartMargin.left + "," + chartMargin.top + ")");

  // Create the legend SVG
var legendSvg = d3.select("#legend")
  .append('svg')
  .attr("width", 318)
  .attr("height", legendBoxHeight)
  .append('g')
  .attr("transform", "translate(" + legendMargin.left + "," + legendMargin.top + ")");

// Load the appropriate GeoJSON Data with an AJAX call
var bg = new L.GeoJSON.AJAX(bgURL,{
  style: bgStyleDefault,
  onEachFeature: onEachBlockGroupFeature
});

// Divide the layer into different groups as needed for filtering
// (Currently sorting based on GEOID as a placeholder)
function onEachBlockGroupFeature(feature, layer){
  // Determine data bounds
  var type
  if (parseInt(feature.properties.GEOID) % 2 == 0){
    type = 'even'
  }
  else{
    type = 'odd'
  }

  // Does layerGroup already exist? if not create it and add to map
  var lg = areaGroups[type];

  if (lg === undefined) {
      lg = new L.layerGroup();
      //add the layer to the map
      lg.addTo(map);
      //store layer
      areaGroups[type] = lg;
  }

  //add the feature to the layer
  lg.addLayer(layer);
}

// Initiate the slider
var sliderTime = d3
  .sliderBottom()
  .min(d3.min(dateData))
  .max(d3.max(dateData))
  .width(chartWidth-100)
  .tickFormat(d3.timeFormat('%b %d'))
  .tickValues(dateData)
  .fill('#F58426')
  .marks(dateData) // Allows for irregular steps as needed
  .default(dateData[dateData.length - 1])
  .on('end', val => {
    sliderTrigger(val);
  });

var sliderSvg = d3.select('#time-slider')
  .append('svg')
  .attr('width', chartWidth)
  .attr('height', 100)
  .append('g')
  .attr('transform', 'translate(30,7)')
  .call(sliderTime)

measureChanged(measureKey)

// ==== 2. TRIGGERS AND EVENTS ====

/**
 * Trigger function when zone context area is changed
 * @param {String} newZoneKey Key used to filter the zones
*/
function zoneChanged(newZoneKey){
  zoneKey = newZoneKey
  console.log(zoneKey)
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
    scoreURL = "/data/score/" + view['name'] + "/" + measureKey

    console.log(scoreURL)

    // Load the data we need TODO: Only load if not already loaded?
    $.getJSON(scoreURL, function(data) {
      $.each( data, function( key, val ) {
        bgScore[parseInt(val['block_group']['id'])] = parseFloat(val['score'])
        score.push(parseFloat(val['score']))
      });

    }).done( function (data) {
      var min = d3.min(score) // D3 ignores invalid data
      var max = d3.max(score)
      
      bg.setStyle(function(feature){
        return {
          fillColor: getQuartileColor(bgScore[parseInt(feature.properties.GEOID)], score),
          color: getQuartileColor(bgScore[parseInt(feature.properties.GEOID)], score),
          fillOpacity: 0.5,
          opacity: 0.5
        }
      })
      if (measureKey.split("_")[1].charAt(0) == 'C'){
        setLegendBins(getQuartileLabels(score, "jobs"), "Access to Jobs");
      }
      else{
        setLegendBins(getQuartileLabels(score, "min"), "Travel Times");
      }
      
      histogramBottom(score, 60, "Score", "Block Groups")
    })

  }
}

function overlayChanged(newOverlayKey){
  overlayKey = newOverlayKey
  console.log(overlayKey)
  if (overlayKey == 'poverty'){
    var population = []
    var populations = {}
    // Let's update the bottom plot for funzies.
    popURL = "/data/pop/" + view['name'] + "/pop_poverty"
    $.getJSON(popURL, function(data) {
      $.each( data, function( key, val ) {
        bgPop[parseInt(val['block_group']['id'])] = parseFloat(val['value'])
        population.push(parseFloat(val['value']))
      });

    }).done( function (data) {
      var min = d3.min(population) // D3 ignores invalid data
      var max = d3.max(population)
      // console.log(bgPop);
      var plotData = []
      console.log(bgScore)
      for (var key of Object.keys(bgPop)) {
        plotData.push({'x': bgPop[key], 'y': bgScore[key]})
    }
      scatterPlotBottom(plotData, "Number of People Below Poverty Line", "Travel Time (min)")
    });
  }

  else if (overlayKey == 'none'){
    plotData = []
    for (var key of Object.keys(bgScore)){
      plotData.push(bgPop[key])
    }
    histogramBottom(plotData, 30, "Score", "# of Block Groups")
  }
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
function histogramBottom(data, bins, xlabel, ylabel){
  bottomSvg.selectAll("*").remove();

  // Create the x range
  var x = d3.scaleLinear()
    .domain(d3.extent(data))
    .rangeRound([0, chartWidth]);

  // Create the y range
  var y = d3.scaleLinear()
    .range([chartHeight, 0]);

  // Set the parameters for the histogram
  var histogram = d3.histogram()
    .domain(x.domain())
    .thresholds(x.ticks(bins));

  // Group the data for the bars
  var histBins = histogram(data);

  // Scale the range of the data in the y domain
  y.domain([0, d3.max(histBins, function(d) { return d.length; })]);
  // Append the bar rectangles to the svg element
  bottomSvg.selectAll("rect")
    .data(histBins)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", 1)
    .attr("transform", function(d) {
    return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
    .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
    .attr("height", function(d) { return chartHeight - y(d.length); });

  // Add the x-axis
  bottomSvg.append("g")
    .attr("transform", "translate(0," + chartHeight + ")")
    .call(d3.axisBottom(x));

  // Add the y-axis
  bottomSvg.append("g")
    .call(d3.axisLeft(y));

  // Label the x-axis
  bottomSvg.append("text")             
    .attr("transform", "translate(" + (chartWidth/2) + " ," + (chartHeight + chartMargin.top + 18) + ")")
    .style("text-anchor", "middle")
    .style('font-weight', 'bold')
    .text(xlabel);

  // Label the y-axis
  bottomSvg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - chartMargin.left)
    .attr("x",0 - (chartHeight / 2))
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
function scatterPlotBottom(data, xlabel, ylabel){
  bottomSvg.selectAll("*").remove();
  console.log(data)

  // Add X axis
  var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) {return d.x}))
    .range([0, chartWidth ]);

  bottomSvg.append("g")
    .attr("transform", "translate(0," + chartHeight + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain(d3.extent(data, function(d) {return d.y}))
    .range([ chartHeight, 0]);

  bottomSvg.append("g")
    .call(d3.axisLeft(y));

  // Add dots
  bottomSvg.append('g')
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
    bottomSvg.append("text")             
    .attr("transform", "translate(" + (chartWidth/2) + " ," + (chartHeight + chartMargin.top + 18) + ")")
    .style("text-anchor", "middle")
    .style('font-weight', 'bold')
    .text(xlabel);

  // Label the y-axis
  bottomSvg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - chartMargin.left)
    .attr("x",0 - (chartHeight / 2))
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
    .attr('cy', function(d, i){return legendMargin.top + 20 + i*30})
    .attr('r', 10)
    .style('fill', d => d.color)
    .style('stroke', 'black')
  
  legendSvg.selectAll("legendLabels")
    .data(bins)
    .enter()
    .append('text')
    .attr('x', legendMargin.left + 20)
    .attr('y', function(d, i){return legendMargin.top + 20 + i*30})
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
    fillColor: 'blue',
    weight: 1,
    opacity: 0.1,
    color: 'blue',
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
 * Get a color scheme based on five equal ranges.
 * @param {*} d Value to colorize
 * @param {Array} data Entire dataset to use for quartiles.
 */
function getQuartileColor(d, data) {
  data = data.sort(d3.ascending)
  // Handle NAN Values
  if(isNaN(d)){
    return "#717678";
  }
  else {
    return  d > d3.quantile(data, 0.75) ? "#810f7c": 
    d > d3.quantile(data, 0.5) ? "#8856a7":
    d > d3.quantile(data, 0.25) ? "#8c96c6":
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
  data = data.sort(d3.ascending)
  return [
    {'label': styleNumbers(d3.quantile(data, 0)) + " to " + styleNumbers(d3.quantile(data, 0.25)) + " " + unit, 'color': '#edf8fb'},
    {'label': styleNumbers(d3.quantile(data, 0.25)) + " to " + styleNumbers(d3.quantile(data, 0.50))+ " " + unit, 'color': '#b3cde3'},
    {'label': styleNumbers(d3.quantile(data, 0.50)) + " to " + styleNumbers(d3.quantile(data, 0.75))+ " " + unit, 'color': '#8c96c6'},
    {'label': styleNumbers(d3.quantile(data, 0.75)) + " to " + styleNumbers(d3.quantile(data, 1.0))+ " " + unit, 'color': '#8856a7'},
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