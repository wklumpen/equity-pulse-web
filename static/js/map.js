
// Loading splash (placeholder for now)
var $loading = $('#loading').hide();
$(document)
  .ajaxStart(function () {
    $loading.show();
  })
  .ajaxStop(function () {
    $loading.hide();
  });


// Initialze map
var map = L.map('map').setView([view['lat'], view['lon']], zoom);

var areaGroups = []

var bg = new L.GeoJSON.AJAX(bgURL,{
  style:bgStyleDefault,
  onEachFeature: onEachFeature
});

function onEachFeature(feature, layer){
  var type
  if (parseInt(feature.properties.GEOID) % 2 == 0){
    type = 'even'
  }
  else{
    type = 'odd'
  }

  //does layerGroup already exist? if not create it and add to map
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
 
// Load CartoDB basemap layer
var cartoLight = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
}).addTo(map);

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

/* Placeholder function for area filtering */
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

/* Placeholder function for area filtering */
function toggleTheme(theme){
  if(theme == 'access'){
    bg.setStyle(
      function(feature){
        if(parseInt(feature.properties.GEOID) % 3 == 0){
          return {fillColor: 'red'}
        }
        else{
          return {fillColor: 'green'}
        }
      }
    )
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

