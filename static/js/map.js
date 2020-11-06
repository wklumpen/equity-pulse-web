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
var timeSelectMargin = {top: 2, right: 20, bottom: 10, left: 20}
var timeSelectBoxWidth = d3.select(".container-main").node().getBoundingClientRect().width - 480
var timeSelectBoxHeight = 30
var timeSelectWidth = timeSelectBoxWidth - timeSelectMargin.left - timeSelectMargin.right
var timeSelectHeight = timeSelectBoxHeight - timeSelectMargin.top - timeSelectMargin.bottom

// Legend dimensions and margins
var legendMargin = {top: 10, right: 10, bottom: 10, left: 10}
var legendBoxHeight = 220
var legendBoxWidth = 250
var legendWidth =  legendBoxWidth - legendMargin.top - legendMargin.bottom
var legendHeight = legendBoxHeight - legendMargin.left - legendMargin.right

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
  sliderDiv.innerHTML += "<div id='time-chart'></div>"
  return sliderDiv
}
time.addTo(map)

// Create SVG for the time series chart on the bottom
var timeSVG = d3.select("#time-chart")
  .append('svg')
  .attr("width", timeSelectBoxWidth)
  .attr("height", timeSelectBoxHeight)
  .append('g')
  .attr("transform", "translate(" + timeSelectMargin.left + "," + timeSelectMargin.top + ")");

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
  console.log(state['score']['url'])
  d3.json(state['score']['url']).then(function(data){
    state['score']['data'] = data;
    updateMap();
  })
  // $.getJSON(state['score']['url'], function(data) {
  //   $.each( data, function( key, val ) {
  //     state['score']['data'][parseInt(val['block_group']['geoid'])] = parseFloat(val['score'])
  //   });

  // }).done( function (data) {
  //   if (state['score']['url'].search('autoY') > 0){
  //     state['score']['unit'] = ""
  //     state['score']['label'] = "Ratio of accessible jobs (auto/transit)"
  //   }
    
  // })
}

function loadTimeData(){
  d3.json(state['time']['url']).then(function(data){
    var timeData = []
    data.forEach(function(val, idx){
      console.log(val)
      timeData.push(moment(val).valueOf())
    })
    state['time']['data'] = timeData
    updateTimeSeries();
  })
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
  var score = state['score']['data']
  console.log(score)
  score = score.filter(Boolean).sort(d3.ascending)
  
  // Style the map
  // For jenks, we'll need to calculate the breaks once for the data
  jenks_score = score.filter(d => d != -1.0)
  var breaks = jenks(jenks_score, 6)
  breaks[0] = 0.0;
  if (state['score']['url'].search("_M_") > 0){
    var is_travel_time = true;
  }
  else{
    var is_travel_time = false;
  }
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
  timeSVG.selectAll("*").remove();

  data = state['time']['data']

  var x = d3.scaleTime()
    .domain(d3.extent(data))
    .range([0, timeSelectWidth])
  
  // timeSVG.append("g")
  //   .attr("transform", "translate(0," + timeSelectHeight + ")")
  //   .call(d3.axisBottom(x));

  // var y = d3.scaleLinear()
  //   .domain([0, d3.max(data, d => d.score)])
  //   .range([ timeSelectHeight, 0]);

  // Add horizontal lines
  timeSVG.append("line")
    .attr("class", "straight")
    .attr('x1', 0)
    .attr('x2', timeSelectWidth)
    .attr('y1', 10)
    .attr('y2', 10)
    .style('stroke', 'black')

  // Add labels
  timeSVG.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("x", d => x(d))
    .attr("y", timeSelectHeight + 5)
    .text(d => moment(d).format('MMM D'))
    .attr('text-anchor', 'middle')
    .attr("dy", ".35em")
    .attr("font-size", "0.8em")

  // Add circles! to make things clearer
  var nodes = timeSVG.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => x(d))
    .attr("cy", 10)
    .attr("r", 7)
    .style('fill', "#2d74ed")
    .style("stroke-width", "2")
    .style("stroke", function(d){
      var md = moment(d)
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
    sliderTrigger(d)
  })
}