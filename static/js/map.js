/**
 * Region-specific map and charting code for TransitCenter's Equity project.
 * Table of Contents
 * -----------------
 * 1. Initializations
 * 2. Loading map data
 * 3. Update functions
 *  3.1. Bottom Chart
 *  3.2. Time Slider
 *  3.3. Legend
 *  3.4. Styling
 */

// ==== 1. INITIALIZATIONS ====

// Bottom chart dimensions and margins
var timeSelectMargin = {top: 20, right: 20, bottom: 0, left: 60}
var timeSelectBoxWidth = 800
var timeSelectBoxHeight = 90
var timeSelectWidth = timeSelectBoxWidth - timeSelectMargin.left - timeSelectMargin.right
var timeSelectHeight = timeSelectBoxHeight - timeSelectMargin.top - timeSelectMargin.bottom

// Legend dimensions and margins
var legendMargin = {top: 10, right: 10, bottom: 10, left: 10}
var legendBoxHeight = 240
var legendBoxWidth = 300
var legendWidth =  legendBoxWidth - legendMargin.top - legendMargin.bottom
var legendHeight = legendBoxHeight - legendMargin.left - legendMargin.right

// Color schemes
var YlGnBu = ["#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494"]
var YlGnBu7 = ["#ffffcc", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#0c2c84"]
var Viridis5 = ["#443A83", "#31688E", "#21918D", "#35B779", "#8FD744"]
var Viridis7 = ["#472D7B", "#3B528B", "#2C728E", "#21918D", "#28AE80", "#5DC963", "#ABDC32"]
var nan_color = "#F0F0F0"

// All of the information for the current application state is kept in here
var state = {
  'tag': view['name'], // The geographical region tag
  'score': { // Information about the "score" or "measure"
    'key': '',
    'url': null,  // Used for API lookups
    'title': 'Access to Jobs in 30 minutes', 
    'label': "Jobs Accessible",
    'unit': 'jobs', 
    data: {} // Format of data[<block_group_id>] = score
  }, 
  'overlay': null, // Overlay key for map dots
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
var message = ""

// Define a date parsing function for the data
var parseDate = d3.timeParse("%Y-%m-%d");

// Placeholder data for testing. Will be loaded
var dateData = [new Date(2020, 1, 29), new Date(2020, 5, 30)]

// Loading splash (placeholder for now)
// var $loading = $('#loading').hide();
// $(document)
//   .ajaxStart(function () {
//     $loading.show();
//   })
//   .ajaxStop(function () {
//     $loading.hide();
//   });

// Initialze map object. View is set in html code by backend
var map = L.map('map',
  {
    preferCanvas: true, // Great speedup
    markerZoomAnimation: false
  }
).setView([view['lat'], view['lon']], zoom);

// Load the basemap layer - currently using CartoDB Greyscale.
var cartoLight = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
}).addTo(map);

// Create the layer group of place labels, which sits highest
map.createPane('labels');
map.getPane('labels').style.zIndex = 650;
map.getPane('labels').style.pointerEvents = 'none';

// Create a layer group of overlays (transit, demographis), which sits 2nd highest
map.createPane('overlays')
map.getPane('overlays').style.zIndex = 500;
map.getPane('overlays').style.pointerEvents = 'none';

var cartoLabels = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>',
  pane: 'labels'
}).addTo(map);

var scaleBar = L.control.scale().addTo(map)

// Define the sidebar control and add it to the map.
var sidebar = L.control.sidebar({
  autopan: true,       // whether to maintain the centered map point when opening the sidebar
  closeButton: true,    // whether t add a close button to the panes
  container: 'sidebar', // the DOM container or #ID of a predefined sidebar container that should be used
  position: 'left',     // left or right
}).addTo(map);

// Set initial sidebar tab.
sidebar.open('data');

// Initialize sidebar triggers for sharing the map and downloading
sidebar.on('content', function(e){
  if (e.id == 'share'){
    var shareText = document.getElementById('share-link')
    shareText.innerHTML = window.location.href
  }
  if (e.id == 'download'){
    var dlCSVLink = document.getElementById('csv-link')
    console.log(state);
    dlCSVLink.setAttribute('href', '/data/dl/view/csv/'+ view['name'] + '/' + state['score']['key'] + '/' + state['date'])
    var dlGeoJSONLink = document.getElementById('geojson-link')
    dlGeoJSONLink.setAttribute('href', '/data/dl/view/geojson/'+ view['name'] + '/' + state['score']['key'] + '/' + state['date'])
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

// Initialize time bar, create div, and add to the map
var time = L.control({position: 'bottomright'});
time.onAdd = function(map){
  var sliderDiv = L.DomUtil.create('div', 'timebox');
  sliderDiv.setAttribute("id", "timebox")
  sliderDiv.innerHTML += "<div id='time-chart'></div>"
  return sliderDiv
}
time.addTo(map)

// Initialize message bar, create, div, and add to the map
var messageBar = L.control({position: 'bottomright'});
  messageBar.onAdd = function(map){
    var div = L.DomUtil.create('div', 'message');
    div.setAttribute("id", "message")
    return div
}
messageBar.addTo(map);


// Create SVG for the time series chart on the bottom
timeSelectBoxWidth = d3.select("#timebox").node().getBoundingClientRect().width
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

// Load the appropriate GeoJSON block-group data with an AJAX call and add to map
bgLayer = new L.GeoJSON.AJAX(bgURL,{
  style: bgStyleDefault,
}).addTo(map);

// Load the transit layer with an AJAX call and add to map
transitLayer = new L.GeoJSON.AJAX('/static/data/' + view['name'] + '_transit.geojson', {
  style: {
    color: '#000000',
    opacity: 0.7,
    weight: 0.5
  },
  pane: 'overlays'
}).addTo(map)

// Once the data is loaded, update the URL querystring and parameters to match
bgLayer.on('data:loaded', function() {
  setStateFromParams();
})

// Load in the map data from the database
function loadMapData(){
  showMessage("Fetching map data, please wait...")
  // Fetch the data we need
  state['score']['data'] = {}
  d3.json(state['score']['url']).then(function(data){
    var keys = Object.keys(data)
    showMessage("Packaging data, please wait...")
    keys.forEach(function(key, idx){
      state['score']['data'][parseInt(key)] = parseFloat(data[key])
    })
    showMessage("Updating map...")
    updateMap();
    clearMessage()
  })
}

// Load in the time data (if needed)
function loadTimeData(updateTime){
  if (updateTime){
    d3.json(state['time']['url']).then(function(data){
      var timeData = []
      data.forEach(function(val, idx){
        var m = moment.utc(val)
        timeData.push(m.valueOf())
      })
      state['time']['data'] = timeData
      updateTimeSeries();
    })
  }
  else{
    updateTimeSeries();
  }
}

// Load in the dots overlay
function loadOverlay(){
  // First, remove the existing layer if it exists
  if (overlayLayer != null){
    map.removeLayer(overlayLayer)
    overlayLayer = null;
  }

  if (state['overlay'] != null){
    // Set the options
    var markerOptions = {
      radius: 0.5,
      fillColor: "#000000",
      color: "#000",
      weight: 0,
      fillOpacity: 0.3
    };
    // Grab the appropriate overlay layer
    overlayLayer = new L.GeoJSON.AJAX('/static/data/' + view['name'] + '_' + state['overlay'] + '.geojson', {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, markerOptions);
      }
    }).addTo(map);
  }
  
}

// === 3. UPDATE FUNCTIONS ===

// Run a map update, selecting the appropriate legend and colors
function updateMap(){
  var score = []
  Object.keys(state['score']['data']).forEach(function(key, idx){
    score.push(state['score']['data'][key])
  })

  // Sort, or quantiles will break real good
  score.sort(d3.ascending)

  if (state['score']['url'].search("_M_") > 0){
    var is_travel_time = true;
  }
  else{
    var is_travel_time = false;
  }
  if (state['score']['url'].search("_autoY_") > 0){
    var is_ratio = true;
  }
  else{
    var is_ratio = false;
  }

  if (is_travel_time == false){
    // Get the labels from the database
    var fetchURL = '/data/bin/'+ view['name'] + '/' + state['score']['key']
    d3.json(fetchURL).then(function(data){
      var bins = [data.bin_0, data.bin_1, data.bin_2, data.bin_3, data.bin_4, data.bin_5]
      // Set color styles on features
      bgLayer.setStyle(function(feature){
        return {
          fillColor: getFiveBinCumulativeColor(state['score']['data'][parseInt(feature.properties.GEOID)], bins, Viridis5),
          color: getFiveBinCumulativeColor(state['score']['data'][parseInt(feature.properties.GEOID)], bins, Viridis5),
          fillOpacity: 0.7,
          weight: 1.0,
          opacity: 0.5
        }
      })
      // Update the legends
      setLegendBins(getFiveBinCumulativeLabels(bins, state['score']['unit'], Viridis5), state['score']['label'], false);

    })
  }
  else{
    bgLayer.setStyle(function(feature){
      if (is_ratio == false){
        return {
          fillColor: getTravelTimeColor(state['score']['data'][parseInt(feature.properties.GEOID)], Viridis5),
          color: getTravelTimeColor(state['score']['data'][parseInt(feature.properties.GEOID)], Viridis5),
          fillOpacity: 0.7,
          weight: 1.0,
          opacity: 0.5
        }
      }
      else{
        return {
          fillColor: getFixedTravelTimeRatioColor(state['score']['data'][parseInt(feature.properties.GEOID)], score, Viridis5),
          color: getFixedTravelTimeRatioColor(state['score']['data'][parseInt(feature.properties.GEOID)], score, Viridis5),
          fillOpacity: 0.7,
          weight: 1.0,
          opacity: 0.5
        }
      }
    })

    if (is_ratio == false){
      setLegendBins(getTravelTimeLabels(Viridis5), state['score']['label'], is_ratio);
    }
    else{
      setLegendBins(getFixedTravelTimeRatioLabels(score, state['score']['unit'], Viridis5), state['score']['label'], is_ratio)
    }
  }
  
}

/**
* Creates a time series plot in the bottom chart panel
* @param {Array} data Array of values to chart
*/
function updateTimeSeries(unused, xlabel, ylabel){
  timeSVG.selectAll("*").remove();

  data = state['time']['data']

  var x = d3.scaleTime()
    .domain(d3.extent(data))
    .range([0, timeSelectWidth])

  // Add horizontal lines
  timeSVG.append("line")
    .attr("class", "straight")
    .attr('x1', 0)
    .attr('x2', timeSelectWidth)
    .attr('y1', 10)
    .attr('y2', 10)
    .style('stroke', 'black')
  
  timeSVG.append("text")
    .text("Data for the Week Of:")
    .attr("transform", "translate(-10, -2)")

  // Add labels
  timeSVG.append('g').selectAll("text")
    .data(data)
    .enter()
    .append("text")
    // .attr("x", d => x(d))
    // .attr("y", timeSelectHeight + 5)
    .text(d => moment.utc(d).format('MMM D/YY'))
    .attr('text-anchor', 'right')
    // .attr("dy", ".35em")
    .attr("transform", d =>{
      return 'translate(' + (x(d)-35) + ',' + (65) + ')rotate(-45)';}
    )
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
      var md = moment.utc(d)
      if (md.format('YYYY-MM-DD') == state['date']){
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
      d3.select(this).style('fill', 'black')
      
      // Highlight the connections
    })
    .on('mouseout', function (d) {
      nodes.style('fill', "#2d74ed")
    })
  
  // Add selection functionality to nodes
  nodes.on('click', function (d){
    sliderTrigger(d);
    sidebar.open('data');
  })
}

// Shows a message to the user while things happen in the background
function showMessage(text){
  d3.select('#message').style("padding", '10px')
  m = d3.select('#message').node()
  m.innerHTML = text
}

// Clears the message shown to the user
function clearMessage(){
  showMessage("")
  d3.select('#message').style("padding", '0')
}