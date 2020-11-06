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
var bottomChartMargin = {top: 10, right: 10, bottom: 20, left: 10}
var bottomChartBoxWidth = d3.select(".container-main").node().getBoundingClientRect().width - 480
var bottomChartBoxHeight = 50
var bottomChartWidth = bottomChartBoxWidth - bottomChartMargin.left - bottomChartMargin.right
var bottomChartHeight = bottomChartBoxHeight - bottomChartMargin.top - bottomChartMargin.bottom

// Legend dimensions and margins
var legendMargin = {top: 10, right: 10, bottom: 10, left: 10}
var legendBoxHeight = 220
var legendBoxWidth = 250
var legendWidth =  legendBoxWidth - legendMargin.top - legendMargin.bottom
var legendHeight = legendBoxHeight - legendMargin.left - legendMargin.right

// Plot chart dimensions and margins
// var plotMargin = {top: 10, right: 30, bottom: 50, left: 70}
// var plotBoxHeight = d3.select("#plot").node().getBoundingClientRect().height
// var plotBoxWidth = d3.select("#plot").node().getBoundingClientRect().width
// var plotWidth = plotBoxWidth - plotMargin.left - plotMargin.right
// var plotHeight = plotBoxHeight - plotMargin.top - plotMargin.bottom

// Color schemes
var YlGnBu = ["#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494"]
var YlGnBu7 = ["#ffffcc", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#0c2c84"]
var Viridis7 = ["#472D7B", "#3B528B", "#2C728E", "#21918D", "#28AE80", "#5DC963", "#ABDC32"]
var nan_color = "#FFEBCD"

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

var bgLayer = null
var transitLayer = null
var overlayLayer = null

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

sidebar.on('content', function(e){
  if (e.id == 'share'){
    console.log(window.location.href);
    var shareText = document.getElementById('share-link')
    shareText.innerHTML = window.location.href
  }
})

// Initialize legend, create div, and add to the map.
var legend = L.control({position: 'topright'});
legend.onAdd = function(map){
  var div = L.DomUtil.create('div', 'legend');
  div.setAttribute("id", "legend")
  return div
}
legend.addTo(map);

// Initiale time bar, create div, and add to the map
var time = L.control({position: 'bottomright'});
time.onAdd = function(map){
  var sliderDiv = L.DomUtil.create('div', 'timebox');
  sliderDiv.setAttribute("id", "timebox")
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

// Load the appropriate GeoJSON Data with an AJAX call
bgLayer = new L.GeoJSON.AJAX(bgURL,{
  style: bgStyleDefault,
}).addTo(map);

transitLayer = new L.GeoJSON.AJAX('/static/data/' + view['name'] + '_transit.geojson', {
  style: {
    color: '#3F3F3F',
    opaicty: 0.5,
    weight: 1
  }
}).addTo(map)

bgLayer.on('data:loaded', function() {
  setStateFromParams();
})

function loadMapData(){
  // Fetch the data we need
  state['score']['data'] = {}  // Reset the data state

  $.getJSON(state['score']['url'], function(data) {
    $.each( data, function( key, val ) {
      state['score']['data'][parseInt(val['block_group']['geoid'])] = parseFloat(val['score'])
    });

  }).done( function (data) {
    if (state['score']['url'].search('autoY') > 0){
      state['score']['unit'] = ""
      state['score']['label'] = "Ratio of accessible jobs (auto/transit)"
    }
    updateMap();
  })
}

function loadTimeData(){
  state['time']['data'] = []
  $.getJSON(state['time']['url'], function(data) {
    console.log(data)
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
        state['overlay']['data'][parseInt(val['block_group']['geoid'])] = parseFloat(val['value'])
      });
    }).done( function (data) {
    });
  }
  else{
  }
}

function loadDotData(){
  // First, remove the existing layer
  if (overlayLayer != null){
    map.removeLayer(overlayLayer)
  }

  // Now add one back in if it's not the one we need
  if (state['dot']['url'] != null){
    var geojsonMarkerOptions = {
      radius: 1.5,
      fillColor: "#000000",
      color: "#000",
      weight: 0,
      fillOpacity: 0.3
    };
    overlayLayer = new L.GeoJSON.AJAX(state['dot']['url'], {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
      }
    }).addTo(map);
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
  jenks_score = score.filter(d => d != -1.0)
  var breaks = jenks(jenks_score, 6)
  breaks[0] = 0.0;
  console.log(breaks)
  if (state['score']['url'].search("_M_") > 0){
    var is_travel_time = true;
  }
  else{
    var is_travel_time = false;
  }
  console.log(is_travel_time);
  bgLayer.setStyle(function(feature){
    return {
      // fillColor: getQuartileColor(state['score']['data'][parseInt(feature.properties.GEOID)], score),
      // color: getQuartileColor(state['score']['data'][parseInt(feature.properties.GEOID)], score),
      fillColor: getSevenBreaksColor(state['score']['data'][parseInt(feature.properties.GEOID)], breaks, Viridis7, is_travel_time),
      color: getSevenBreaksColor(state['score']['data'][parseInt(feature.properties.GEOID)], breaks, Viridis7, is_travel_time),
      fillOpacity: 0.4,
      weight: 1.1,
      opacity: 0.2
    }
  })
  // Update the legend accordingly
  setLegendBins(getSevenBreaksLabels(breaks, Viridis7, state['score']['unit'], is_travel_time), state['score']['label']);
}

// ==== 3. DISPLAY FUNCTIONS ====

// ======== 3.1. BOTTOM CHART ====

/**
* Creates a time series plot in the bottom chart panel
* @param {Array} data Array of values to chart
*/
function updateTimeSeries(data, xlabel, ylabel){
  bottomSvg.selectAll("*").remove();

  console.log(data);

  var x = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([0, bottomChartWidth])
  
  bottomSvg.append("g")
    .attr("transform", "translate(0," + bottomChartHeight + ")")
    .call(d3.axisBottom(x));

  var y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.score)])
    .range([ bottomChartHeight, 0]);

  // Add lollipop sticks
  bottomSvg.selectAll("stick")
    .data(data)
    .enter()
    .append("line")
    .attr("x1", function(d) { return x(d.date); })
    .attr("x2", function(d) { return x(d.date); })
    .attr("y1", function(d) { return y(d.score); })
    .attr("y2", y(0))
    .attr("stroke", "grey")

  // Add circles to make things clearer
  var nodes = bottomSvg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.date))
    .attr("cy", d => y(d.score))
    .attr("r", 7)
    .style('fill', "#2d74ed")
    .style("stroke-width", "2")
    .style("stroke", function(d){
      var md = moment(d.date)
      if (md.format('YYYYMMDD') == state['date']){
        return "black"
      }
      else{
        return "none"
      }
    })

  // Add mouseover effects to nodes
  nodes.on('mouseover', function (d) {
      // Highlight the nodes: every node is green except of him
      nodes.style('fill', "#2d74ed")
      d3.select(this).style('fill', '#69b3b2')
      
      // Highlight the connections
    })
    .on('mouseout', function (d) {
      nodes.style('fill', "#2d74ed")
    })
  
  // Add selection functionality to nodes
  nodes.on('click', function (d){
    sliderTrigger(d.date)
  })
}