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
var bottomChartMargin = {top: 10, right: 50, bottom: 20, left: 60}
var bottomChartBoxWidth = d3.select(".container-main").node().getBoundingClientRect().width - 480
var bottomChartBoxHeight = 150
var bottomChartWidth = bottomChartBoxWidth - bottomChartMargin.left - bottomChartMargin.right
var bottomChartHeight = bottomChartBoxHeight - bottomChartMargin.top - bottomChartMargin.bottom

// Legend dimensions and margins
var legendMargin = {top: 10, right: 10, bottom: 10, left: 10}
var legendBoxHeight = 200
var legendBoxWidth = 200
var legendWidth =  legendBoxWidth - legendMargin.top - legendMargin.bottom
var legendHeight = legendBoxHeight - legendMargin.left - legendMargin.right

// Plot chart dimensions and margins
var plotMargin = {top: 10, right: 30, bottom: 50, left: 70}
var plotBoxHeight = d3.select("#plot").node().getBoundingClientRect().height
var plotBoxWidth = d3.select("#plot").node().getBoundingClientRect().width
var plotWidth = plotBoxWidth - plotMargin.left - plotMargin.right
var plotHeight = plotBoxHeight - plotMargin.top - plotMargin.bottom

// Color schemes
var YlGnBu = ["#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494"]
var YlGnBu7 = ["#ffffcc", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#0c2c84"]



// All of the information for the current application state is kept in here
var state = {
  'tag': view['name'], // The geographical region tag
  'score': { // Information about the "score" or "measure"
    'url': null,  // Used for API lookups
    'title': 'Access to Jobs in 30 minutes', 
    'label': "Jobs Accessible",
    'unit': 'jobs', 
    data: {} // Format of data[<block_group_id>] = score
  }, 
  'overlay': {
    'url': null,  // Used for API lookups
    'title': null, 
    'label': null,
    'unit': null, 
    data: {} //Format of data[<block_group_id>] = people/hhld
  },
  'dot': {
    'url': null,
  },
  'time': {
    'url': null,  // Used for API lookups
    'title': null, 
    'label': null, 
    data: []
  }, // Time series data
  'date': '30062020', // The current date we are displaying data for
}

// Keeping track of what data is currently displayed
// var zoneKey = 'all'
// var measureKey = 'A_C000_c30_<DATE>_MP'
// var overlayKey = 'all'
// var startDate = '30062020'

var bgLayer = null
var overlayLayer = null

// TEMP Variable
state['score']['url'] = "/data/score/" + state['tag'] + "/" + 'A_C000_c30_<DATE>_MP'.replace("<DATE>", state['date'])
var popURL = null
state['time']['url'] = "/data/time/" + view['name'] + "/" + 'A_C000_c30_<DATE>_MP'.replace("_<DATE>", "")

// Variables to hold the current data for visualization, etc.
// var scoreData = {'title': null, 'label': null, data: []}
// var overlayData = {'title': null, 'label': null, data: []}
// var timeData = {'title': null, 'label': null, data: []}

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

var sidebar = L.control.sidebar({
  autopan: true,       // whether to maintain the centered map point when opening the sidebar
  closeButton: true,    // whether t add a close button to the panes
  container: 'sidebar', // the DOM container or #ID of a predefined sidebar container that should be used
  position: 'left',     // left or right
}).addTo(map);

sidebar.open('home');

var legend = L.control({position: 'topright'});

legend.onAdd = function(map){
  var div = L.DomUtil.create('div', 'legend');
  div.setAttribute("id", "legend")

  return div
}

legend.addTo(map);

var time = L.control({position: 'bottomright'});

time.onAdd = function(map){
  var sliderDiv = L.DomUtil.create('div', 'timebox');
  sliderDiv.setAttribute("id", "timebox")
  sliderDiv.innerHTML += "<div id='time-slider'></div>"
  sliderDiv.innerHTML += "<div id='bottom-chart'></div>"
  return sliderDiv
}

time.addTo(map)

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
// var plotSvg = null;
var plotSvg = d3.select("#plot")
  .append('svg')
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 300 300")
  .classed("svg-content", true)
  // .attr("width", plotBoxWidth)
  // .attr("height", plotBoxHeight)
  // .append('g')
  // .attr("transform", "translate(" + plotMargin.left + "," + plotMargin.top + ")")

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
  bgLayer = new L.GeoJSON.AJAX(bgURL,{
    style: bgStyleDefault,
  }).addTo(map);

  transitLayer = new L.GeoJSON.AJAX('static/data/' + view['name'] + '_transit.geojson', {
    style: {
      color: '#3F3F3F',
      opaicty: 0.5,
      weight: 1
    }
  }).addTo(map)

  bgLayer.on('data:loaded', function() {
    setStateFromParams();
  })
}

// Divide the layer into different groups as needed for filtering
// (Currently sorting based on GEOID as a placeholder)
// ==== 2. TRIGGERS AND EVENTS ====

/**
 * Trigger function when zone context area is changed
 * @param {String} newZoneKey Key used to tag zones
*/
function zoneChanged(newZoneKey){
  oldTag = state['tag']
  if (newZoneKey == 'msa'){
    state['tag'] = view['name'] + "-msa"
  }
  else{
    state['tag'] = view['name']
  }
  state['score']['url'] = state['score']['url'].replace(oldTag, state['tag'])

  loadMapData();
}

/**
 * Trigger function when map measure is changed
 * @param {String} newMeasureKey Key used to select the data.
 */
function measureChanged(newMeasureKey){
  // Update the data URL
  state['score']['url'] = "/data/score/" + state['tag'] + "/" + newMeasureKey.replace("<DATE>", state['date'])
  var score = []

  // Update the time series URL
  state['time']['url'] = "/data/time/" + state['tag'] + "/" + newMeasureKey.replace("_<DATE>", "")

  // Update the labels
  if (newMeasureKey.split("_")[1].charAt(0) == 'C'){
    state['score']['label'] = 'Jobs Accessible (jobs)'
    state['score']['unit'] = 'jobs'
  }
  else{
    state['score']['label'] = 'Travel Time (min)'
    state['score']['unit'] = 'min'
  }

  // Reload the map data
  loadMapData();

  // Now let's grab the time series data also and update the time series plot
  loadTimeData();
}

function loadMapData(){
  // Fetch the data we need
  state['score']['data'] = {}  // Reset the data state

  $.getJSON(state['score']['url'], function(data) {
    $.each( data, function( key, val ) {
      state['score']['data'][parseInt(val['block_group']['id'])] = parseFloat(val['score'])
    });

  }).done( function (data) {
    updateMap();
    updatePlot();
  })
}

function loadTimeData(){
  state['time']['data'] = []
  $.getJSON(state['time']['url'], function(data) {
    $.each( data.date, function( key, val ) {
      state['time']['data'].push({"date": parseDate(val), "score": parseFloat(data.score[key])})
    });

  }).done(function (data) {
    updateTimeSeries(state['time']['data'], "Date", "Score");
  });
}

function loadOverlayData(){
  // Let's update the plot for funzies
  if (state['overlay']['url'] != null){
    $.getJSON(state['overlay']['url'], function(data) {
      $.each( data, function( key, val ) {
        state['overlay']['data'][parseInt(val['block_group']['id'])] = parseFloat(val['value'])
      });
    }).done( function (data) {
      updatePlot();
    });
  }
  else{
    updatePlot();
  }
}

function loadDotData(){
  console.log(state['dot']['url'])
  if (state['dot']['url'] != null){
    var geojsonMarkerOptions = {
      radius: 1.5,
      fillColor: "#000000",
      color: "#000",
      weight: 0,
      fillOpacity: 0.3
    };
    console.log("LOADING DOTS")
    overlayLayer = new L.GeoJSON.AJAX(state['dot']['url'], {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
      }
    }).addTo(map);
  }
  else if (overlayLayer != null){
    map.removeLayer(overlayLayer)
  }

}

// function overlayChanged(newOverlayKey){
//   if (newOverlayKey == 'poverty'){
//     state['overlay']['url'] = "/data/pop/" + state['tag'] + "/pop_poverty"
//     state['overlay']['label'] = "Number of people in poverty"
//     state['overlay']['title'] = "People below the poverty line"
//     state['overlay']['unit'] = 'people'
//     state['dot']['url'] = "/static/data/" + view['name'] + "_pop_poverty.geojson"
//   }
//   else if (newOverlayKey == 'none'){
//     state['overlay']['url'] = null;
//     state['dot']['url'] = null;
//   }
//   loadOverlayData();
//   loadDotData();
// }

function transitToggle(value){
  if (document.getElementById('transitToggle').checked){
    transitLayer.setStyle({
      weight: 1
    })
  }
  else{
    transitLayer.setStyle({
      weight: 0
    })
  }
}

function updateMap(){

  var score = []
  for (var s in state['score']['data']){
    score.push(state['score']['data'][s])
  }
  score = score.filter(Boolean).sort(d3.ascending)
  
  // Style the map
  // For jenks, we'll need to calculate the breaks once for the data
  var breaks = jenks(score, 6)
  bgLayer.setStyle(function(feature){
    return {
      // fillColor: getQuartileColor(state['score']['data'][parseInt(feature.properties.GEOID)], score),
      // color: getQuartileColor(state['score']['data'][parseInt(feature.properties.GEOID)], score),
      fillColor: getSevenBreaksColor(state['score']['data'][parseInt(feature.properties.GEOID)], breaks, YlGnBu7),
      color: getSevenBreaksColor(state['score']['data'][parseInt(feature.properties.GEOID)], breaks, YlGnBu7),
      fillOpacity: 0.4,
      weight: 1.1,
      opacity: 0.2
    }
  })
  // Update the legend accordingly
  setLegendBins(getSevenBreaksLabels(breaks, YlGnBu7, state['score']['unit']), state['score']['label']);
}

function updatePlot(){
  if (plotWidth > 0){
    // Redo the plot based on currently set data
    if (state['overlay']['url'] == null){
      // We do a histogram
      var score = []
      for (var s in state['score']['data']){
        score.push(state['score']['data'][s])
      }
      histogramPlot(state['score']['data'], 50, state['score']['label'], "Population")
    }
    else {
      var plotData = []
      for (var key of Object.keys(state['overlay']['data'])) {
        plotData.push({'x': state['score']['data'][key], 'y': state['overlay']['data'][key]})
      }
      scatterPlot(plotData, state['score']['label'], state['overlay']['label'])
    }
  }
}

function sliderTrigger(value){
  var m = moment(value) // Easier to format using moments.
  newDate = m.format('DDMMYYYY')
  oldDate = state['date']
  if (oldDate != newDate){
    state['score']['url'] = state['score']['url'].replace(oldDate, newDate)
    loadMapData();
    state['date'] = newDate
  }
}

// ==== 3. DISPLAY FUNCTIONS ====

// ======== 3.1. BOTTOM CHART ====

/**
* Creates a time series plot in the bottom chart panel
* @param {Array} data Array of values to chart
*/
function updateTimeSeries(data, xlabel, ylabel){
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

  //   // Label the x-axis
  // bottomSvg.append("text")             
  //   .attr("transform", "translate(" + (bottomChartWidth/2) + " ," + (bottomChartHeight + bottomChartMargin.top + 18) + ")")
  //   .style("text-anchor", "middle")
  //   .style('font-weight', 'bold')
  //   .text(xlabel);

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

sidebar.on('content', function(e) {
  if (e.id == 'charts'){
    // Plot chart dimensions and margins
    plotBoxHeight = d3.select("#plot").node().getBoundingClientRect().height
    plotBoxWidth = d3.select("#plot").node().getBoundingClientRect().width
    plotWidth = plotBoxWidth - plotMargin.left - plotMargin.right
    plotHeight = plotBoxHeight - plotMargin.top - plotMargin.bottom

    // Create the plot SVG for the scatter/histogram plots

    // plotSvg.select('svg')
    // .attr("preserveAspectRatio", "xMinYMin meet")
    // .attr("viewBox", "0 0 300 300")
    // .classed("svg-content", true);
    
    updatePlot()
  }
})