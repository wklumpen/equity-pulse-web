/**
 * Region-specific map and charting code for TransitCenter's Equity project.
 * Table of Contents
 * -----------------
 * 1. Initializations
 * 2. Bottom Chart Functions
 * 3. Map Triggers
 * 4. Time Slider
 * 5. Styling Functions
 */

// ==== 1. INITIALIZATIONS ====

// Bottom chart dimensions and margins
var chartMargin = {top: 10, right: 10, bottom: 35, left: 45}
var boxHeight = d3.select("#bottom-chart").node().getBoundingClientRect().height
var boxWidth = d3.select("#bottom-chart").node().getBoundingClientRect().width
var chartHeight = boxHeight - chartMargin.top - chartMargin.bottom
var chartWidth = boxWidth - chartMargin.left - chartMargin.right

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
  .attr("width", chartWidth + chartMargin.left + chartMargin.right)
  .attr("height", chartHeight + chartMargin.top + chartMargin.bottom)
  .append('g')
  .attr("transform", "translate(" + chartMargin.left + "," + chartMargin.top + ")");

// Load the appropriate GeoJSON Data with an AJAX call
var bg = new L.GeoJSON.AJAX(bgURL,{
  style: bgStyleDefault,
  onEachFeature: onEachFeature
});

// Divide the layer into different groups as needed for filtering
// (Currently sorting based on GEOID as a placeholder)
function onEachFeature(feature, layer){
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

// ==== 2. BOTTOM CHART FUNCTIONS ====

 /**
  * Creates a histogram in the bottom chart panel
  * @param {Array} data Array of values to chart
  * @param {Number} bins The number of bins for the histogram
  * @param {String} xlabel The label for the x-axis
  * @param {String} ylabel The label for the y-axis
  */
function histogramBottom(data, bins, xlabel, ylabel){

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

// ==== 3. MAP TRIGGERS ====

/* Placeholder function for area filtering */
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

/**
 * Toggle what thematic map and chart information to display
 * @param {String} theme Theme keyword
 */
function toggleTheme(theme){
  if(theme == 'access'){
    // First we need to get the range of values
    var score = []
    bg.eachLayer(function(layer){
      var val = parseFloat(layer.feature.properties.A_percent_jobs_30min_auto)
      score.push(val)
      
    })

    var min = d3.min(score) // D3 ignores invalid data
    var max = d3.max(score)
    bg.setStyle(function(feature){
      // console.log(Math.max(feature.properties.A_percent_jobs_30min_auto))
      return {
        fillColor: getQuintileColor(feature.properties.A_percent_jobs_30min_auto, min, max),
        color: getQuintileColor(feature.properties.A_percent_jobs_30min_auto, min, max),
        fillOpacity: 0.5,
        opacity: 0.5
      }
    })
    histogramBottom(score, 30, "Score", "Block Groups")
  }
  else if(theme == 'equity'){
    bg.setStyle(
      function(feature){
        if(parseInt(feature.properties.GEOID) % 4 == 0){
          return {fillColor: 'red'}
        }
        else{
          return {fillColor: 'green'}
        }
      }
    )
  }
}

// ==== 4. TIME SLIDER ====

// Placeholder data for testing. Will be loaded
var dateData = [new Date(2020, 2, 2), 
  new Date(2020, 3, 4), new Date(2020, 3, 10), new Date(2020, 3, 16),
  new Date(2020, 4, 24), new Date(2020, 5, 2)]

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
  .default(new Date(2020, 3, 16))
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


var sliderTrigger = function(value){
  console.log('Slider Moved to ' + value)
}

// ==== 5. STYLING FUNCTIONS ====

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
 * Get a color scheme based on quintile ranges.
 * @param {*} d Value to colorize
 * @param {Number} min Minimum value in data range
 * @param {Number} max Maximum value in data range
 */
function getQuintileColor(d, min, max) {
  // Handle NAN Values
  if(isNaN(d)){
    return "#000000";
  }
  else {
    return  d > 4*(max-min)/5 + min ? "#810f7c": 
    d > 3*(max-min)/5 + min ? "#8856a7":
    d > 2*(max-min)/5 + min ? "#8c96c6": 
    d > 1*(max-min)/5 + min ? "#b3cde3": 
    "#edf8fb";
  }
}