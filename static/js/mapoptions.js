// TO BE EXPANDED WITH MORE OPTIONS
var zoneList = ['all', 'msa']
var measureList = ['A', 'M']
var AGDestList = ['C000']
var MDestList = ['snap']
var periodOptionsList = ['AM']
var AParamList = ['c30', 'c60', 'c45']
var MParamList = ['time1', 'time3']
var fareYesNo = ['No', 'Yes']
var demoList = ['none', 'pop_total', 'pop_poverty', 'pop_black']

var autoOptions = [
  {
    "autoName": "No auto travel time ratios",
    "autoCode": "autoN"
  },
  {
    "autoName": "Show as ratio to travel times",
    "autoCode": "autoY"
  }
]

var autoNA = [
  {
    "autoName": "--Auto Ratio Not Applicable--",
    "autoCode": "autoN"
  }
]

var fareOptions = [
  {
    "fareName": "No",
    "fareCode": "fareN"
  },
  {
    "fareName": "Yes",
    "fareCode": "fareY"
  }
]

var fareNA = [
  {
    "fareName": "--Fare Not Applicable--",
    "fareCode": "fareN"
  }
]

var periodOptions = [
  {
    "periodName": "Weekday Morning",
    "periodCode": "AM"
  },
  {
    "periodName": "Weekday Evening",
    "periodCode": "PM"
  },
  {
    "periodName": "Weekend",
    "periodCode": "WE"
  }
]

var periodNA = [
  {
    "periodName": "--Time Period Not Applicable--",
    "periodCode": "NA"
  }
]

var demoOptions = {
  "pop_total" : {
    "demoName": "Total populaiton",
    "demoTitle": "Total Population",
    "demoUnit": "people",
    "demoLabel": "people"
  },
  "pop_poverty" : {
    "demoName": "Population below the poverty line",
    "demoTitle": "People below the poverty line",
    "demoUnit": "people",
    "demoLabel": "people below the poverty line"
  },
  "pop_black" : {
    "demoName": "Black Population",
    "demoTitle": "Black Population",
    "demoUnit": "black people",
    "demoLabel": "black people"
  }
}

// MAIN OPTIONS LIST FOR DROPDOWNS
var options = {
  "C000": {
    "destName" : "Employment, All",
    "destMeasureLabel": "Jobs accessible",
    "destMeasureUnit": "jobs",
    "destMeasure": "Access to employment is measured by counting the total number of jobs available withing a specified travel time from a zone.",
    "measureCode": "P",
    "params": [
      {
        "paramName": "30 minutes",
        "paramCode": "c30"
      },
      {
        "paramName": "45 minutes",
        "paramCode": "c45"
      },
      {
        "paramName": "60 minutes",
        "paramCode": "c60"
      },
    ],
    "periods": periodOptions,
    "autos": autoOptions,
    "fares": fareOptions
  },
  "CE01": {
    "destName" : "Employment, Low Income",
    "destMeasureLabel": "Jobs accessible",
    "destMeasureUnit": "jobs",
    "destMeasure": "Access to low income employment is measured by counting the total number of low income jobs available withing a specified travel time from a zone.",
    "measureCode": "P",
    "params": [
      {
        "paramName": "30 minutes",
        "paramCode": "c30"
      },
      {
        "paramName": "45 minutes",
        "paramCode": "c45"
      },
      {
        "paramName": "60 minutes",
        "paramCode": "c60"
      },
    ],
    "periods": periodOptions,
    "autos": autoOptions,
    "fares": fareOptions
  },
  "snap": {
    "destName" : "Grocery Stores",
    "destMeasureLabel": "Travel Time",
    "destMeasureUnit": "min",
    "destMeasure": "Access to groceries is measured by calculating the minimum travel time to a specified number of stores which are part of the SNAP program.",
    "measureCode": "M",
    "params": [
      {
        "paramName": "1 SNAP store",
        "paramCode": "t1"
      },
      {
        "paramName": "3 SNAP stores",
        "paramCode": "t3"
      },
    ],
    "periods": periodOptions,
    "autos": autoOptions,
    "fares": fareNA
  },
  "los": {
    "destName" : "Transit Service",
    "destMeasureLabel": "Trips accessible",
    "destMeasureUnit": "trips",
    "destMeasure": "Access to transit service is measured by counting the total number of unique transit trips that visit a zone in a week.",
    "measureCode": "T",
    "params": [
      {
        "paramName": "Total Trips",
        "paramCode": "NA"
      }
    ],
    "periods": periodNA,
    "autos": autoNA,
    "fares": fareNA
  }
}

var defaultMeasure = "C000"
var defaultKey = defaultMeasure + "_" 
                    + options[defaultMeasure]["measureCode"] + "_" 
                    + options[defaultMeasure]['params'][0]['paramCode'] + "_"
                    + options[defaultMeasure]['periods'][0]['periodCode'] + "_"
                    + options[defaultMeasure]['autos'][0]['autoCode'] + "_"
                    + options[defaultMeasure]['fares'][0]['fareCode']

/*
    Code to manage the options portion of the application, including
    dynamically linked drop down lists, etc.
*/
// Start by populating the lists with appropriate data
$(document).ready(function () {
    // console.log("Document ready");
    // optionsUpdate()
});

function optionsUpdate(){
  // console.log("Updating dropdown options");
    // Start by getting the elements needed for destinations
    var destList = document.getElementById('destination');
    var destination = destList.options[destList.selectedIndex].value

    var paramList = document.getElementById('param')
    var periodList = document.getElementById('period')

    var measureText = document.getElementById('measurement')
    measureText.innerHTML = options[destination]['destMeasure']

    // Now we populate the parameters
    var params = options[destination]['params']

    // Clear it out
    var x = paramList.options.length - 1;
    for(i = x; i >= 0; i--) {
        paramList.remove(i);
    }

    // Rebuild it
    x = params.length
    for(i=0; i < x; i++){
      if (i == 0){
        paramList.options[i] = new Option(params[i]["paramName"], params[i]["paramCode"], true)
      }
      else{
        paramList.options[i] = new Option(params[i]["paramName"], params[i]["paramCode"])
      }
    }

    // Now we update the time periods
    var periods = options[destination]['periods'];
    // Clear it out
    x = periodList.options.length - 1;
    for(i = x; i >= 0; i--) {
        periodList.remove(i);
    }
    // Rebuild it
    x = periods.length
    for(i=0; i < x; i++){
      if (i == 0){
        periodList.options[i] = new Option(periods[i]["periodName"], periods[i]["periodCode"], true)
      }
      else{
        periodList.options[i] = new Option(periods[i]["periodName"], periods[i]["periodCode"])
      }
    }

    // Now we do the autos
    autoList = document.getElementById('auto');
    var auto = options[destination]['autos']
    // Clear it out
    x = autoList.options.length - 1;
    for(i = x; i >= 0; i--) {
      autoList.remove(i);
    }
    // Rebuild it
    x = auto.length
    for(i=0; i < x; i++){
      if (i == 0){
        autoList.options[i] = new Option(auto[i]["autoName"], auto[i]["autoCode"], true)
      }
      else{
        autoList.options[i] = new Option(auto[i]["autoName"], auto[i]["autoCode"])
      }
    }

    // Now we update the fares
    fareList = document.getElementById('fare');
    var fares = options[destination]['fares'];

    // Clear it out
    x = fareList.options.length - 1;
    for(i = x; i >= 0; i--) {
      fareList.remove(i);
    }
    // Rebuild it
    x = fares.length
    for(i=0; i < x; i++){
      if (i == 0){
        fareList.options[i] = new Option(fares[i]["fareName"], fares[i]["fareCode"], true)
      }
      else{
        fareList.options[i] = new Option(fares[i]["fareName"], fares[i]["fareCode"])
      }
    }
}

/*
  Sets the map state for data plotting, etc from the query string parameters
  It also validates them, so we can be sure after this function is called that
  the query string parameters are set properly.
*/
function setStateFromParams(){
    // Now we update the map state by building an API string
    var mapParams = new URLSearchParams(window.location.search)
    var date = null;
    var demo = null;
    var zone = null;

    // We need to check if the state is correct
    // If no measure passed, we just go for the default
    if (mapParams.has('key')){
      // Make sure it's a valid key
      var s_key = mapParams.get('key').split("_");
        
      if (s_key[0] in options){
        // Fix the measurement code whether it needs it or not
        s_key[1] = options[s_key[0]]['measureCode']
      }
      //TODO: Other validations as needed
    }
    else{
      mapParams.set('key', defaultKey);
      var s_key = defaultKey.split("_");
    }

    if (mapParams.has('date')){
      date = mapParams.get('date')
    }
    else{
      // console.log("Setting Date:", view['max_date'])
      date = view['max_date']
    }
    if (mapParams.has('demo') & demoList.includes(mapParams.get('demo'))){
      demo = mapParams.get('demo')
    }
    else{
      demo = demoList[0];
    }
    if (mapParams.has('zone') & zoneList.includes(mapParams.get('zone'))){
      zone = mapParams.get('zone')
    }
    else{
      zone = zoneList[0];
      // console.log("Set Zone to default:", zone);
    }
    if (s_key[0] == 'los'){
      var key = "los_trips"
    }
    else{
      var key = s_key.join("_")
    }

    // console.log(key)
    // Now we gotta update the paramz
    var newParams = new URLSearchParams()
    
    newParams.set('key', key)
    newParams.set('zone', zone)
    newParams.set('date', date)
    newParams.set("demo", demo)
    
    history.replaceState(null, null, "?" + newParams.toString())

    // Now to update the map state itself

    // Start with the zone update
    // console.log("Zone Querystring", zone);
    if (zone == 'msa'){
        state['tag'] = view['name'] + "-msa"
    }
    else if (zone == 'urban'){
      state['tag'] = view['name'] + "-urban"
    }
    else{
        state['tag'] = view['name']
    }

    // TODO: Check if date is valid
    state['date'] = date

    state['score']['url'] = "/data/score/" + state['tag'] + "/" + key + "/" + date

    // Update the time series URL
    state['time']['url'] = "/data/time/" + state['tag'] + "/" + key

    // console.log(state['score']['url'])
    // console.log(state['time']['url'])

    // Update the labels
    state['score']['label'] = options[s_key[0]]['destMeasureLabel']
    state['score']['unit'] = options[s_key[0]]['destMeasureUnit']
    // Update overlay data
    if (demo == 'none'){
        state['overlay']['url'] = null;
        state['dot']['url'] = null;
    }
    else{
      state['overlay']['url'] = "/data/pop/" + state['tag'] + "/" + demo
      state['overlay']['label'] = demoOptions[demo]['demoLabel']
      state['overlay']['title'] = demoOptions[demo]['demoTitle']
      state['overlay']['unit'] = demoOptions[demo]['demoUnit']
      state['dot']['url'] = "/static/data/" + view['name'] + "_" + demo +".geojson"
    }

    setOptionsFromParams();

    // Reload the map data
    loadMapData();
    loadTimeData();
    loadOverlayData();
    loadDotData();
}


/*
    ONLY CALL THIS AFTER VALIDATION OF QUERYSTRING
*/
function setOptionsFromParams(){

    var mapParams = new URLSearchParams(window.location.search)
    var zoneList = document.getElementById('zones');
    var destList = document.getElementById('destination');
    var periodList = document.getElementById('period');
    var paramList = document.getElementById('param');
    var fareList = document.getElementById('fare');
    var demoList = document.getElementById('demo');

    var key = mapParams.get('key')
    var zone = mapParams.get('zone')

    var s_split = key.split('_');

    destList.value = s_split[0]
    optionsUpdate();
    
    zoneList.value = zone;
    periodList.value = s_split[3];
    paramList.value = s_split[2];
    autoList.value = s_split[4];
    fareList.value = s_split[5];
    
    demoList.value = mapParams.get('demo');
}

/**
 * Function triggered when the user submits a new map configuration
*/
function updateMapClicked(){
  // Start with a blank query string state
  queryParams = new URLSearchParams();

  // Build all the options where possible
  var zoneList = document.getElementById('zones')
  var zone = zoneList.options[zoneList.selectedIndex].value

  var destList = document.getElementById('destination');
  var destination = destList.options[destList.selectedIndex].value

  var periodList = document.getElementById('period');
  var period = periodList.options[periodList.selectedIndex].value

  var paramList = document.getElementById('param');
  var param = paramList.options[paramList.selectedIndex].value

  var autoList = document.getElementById('auto');
  var auto = autoList.options[autoList.selectedIndex].value

  var fareList = document.getElementById('fare');
  var fare = fareList.options[fareList.selectedIndex].value

  var demoList = document.getElementById('demo')
  var demo = demoList.options[demoList.selectedIndex].value

  var key = destination + "_" + options[destination]['measureCode'] + "_" + param + "_" + period + "_" + auto + "_" + fare

  // console.log("Key after updateMapClicked:", key);
  // console.log("Demo after updateMapClicked:", demo);

  queryParams.set("zone", zone)
  queryParams.set("key", key)
  queryParams.set("demo", demo)
  history.replaceState(null, null, "?" + queryParams.toString())
  setStateFromParams();
}



