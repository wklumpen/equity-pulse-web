/*
* Option Parameters and Update Functions for the Map Options
* This document contains a set of definitions and update functions for populating
* all of the map option dropdowns, and for handling the querystring feature
* that allows for sharing of a particular map state.
*/
// TO BE EXPANDED WITH MORE OPTIONS
var zoneList = ['msa', 'er', 'urban', 'equity']
var measureList = ['A', 'M']
var AGDestList = ['C000']
var MDestList = ['snap']
var periodOptionsList = ['AM', 'PM']
var AParamList = ['c30', 'c60', 'c45']
var MParamList = ['time1', 'time3']
var fareYesNo = ['No', 'Yes']
var demoList = ['none', 'pop_black', 'pop_white', 'pop_hispanic', 'pop_asiapacific', 'hhld_single_mother', 'workers_essential', 'pop_poverty', 'pop_black', 'hhld_nocar']

// Options related to auto travel time ratio.
var autoOptions = [
  {
    "autoName": "No",
    "autoCode": "autoN"
  },
  {
    "autoName": "Yes",
    "autoCode": "autoY"
  }
]

// Used then auto travel time ratios are not applicable.
var autoNA = [
  {
    "autoName": "--Auto Ratio Not Applicable--",
    "autoCode": "autoN"
  }
]

// Options related to fare-sensitive choices
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

var travelTimeParam = "Choose whether to measure travel time to the closest or 3rd closest opportunity."
var accessParam = "Count opportunities that can be reached within the selected travel time."
// Used when fare-sensitive information isn't applicable.
var fareNA = [
  {
    "fareName": "--Fare Not Applicable--",
    "fareCode": "fareN"
  }
]

// Used as a temporary measure to remove fare options
var fareTemp = [
  {
    "fareName": "--Coming Soon!--",
    "fareCode": "fareN"
  }
]

// Options for time-of-day filtering of data (all except level-of-service)
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

// Options for the time-of-day filtering for the level-of-service measure only
var losPeriodOptions = [
  {
    "periodName": "Weekday",
    "periodCode": "WKD"
  },
  {
    "periodName": "Saturday",
    "periodCode": "SAT"
  },
]

// Main collection of dropdown options used.
var options = {
  "C000": {
    "destName" : "Employment, All",
    "destMeasureLabel": "Jobs Reachable",
    "destMeasureUnit": "jobs",
    "destMeasure": "Access to jobs counts the total number of jobs that can be reached on transit, from a starting point and within a certain amount of time.",
    "measureCode": "P",
    "paramDesc": accessParam,
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
    "destMeasureLabel": "Low-wage jobs reachable",
    "destMeasureUnit": "jobs",
    "destMeasure": "Access to low-wage jobs counts the total number of jobs with annual wages less than $15,000 that can be reached on transit, from a starting point and within a certain amount of time.",
    "measureCode": "P",
    "paramDesc": accessParam,
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
    "destMeasureLabel": "Travel Time to grocery stores",
    "destMeasureUnit": "min",
    "destMeasure": "Travel time to grocery stores calculates the travel time by transit to the closest food stores that belong to the Supplemental Nutrition Assistance Program (SNAP).",
    "measureCode": "M",
    "paramDesc": travelTimeParam,
    "params": [
      {
        "paramName": "Closest store",
        "paramCode": "t1"
      },
      {
        "paramName": "3rd Closest store",
        "paramCode": "t3"
      },
    ],
    "periods": periodOptions,
    "autos": autoOptions,
    "fares": fareNA
  },
  "hospitals": {
    "destName" : "Hospitals",
    "destMeasureLabel": "Travel time to hospitals",
    "destMeasureUnit": "min",
    "destMeasure": "Travel time to hospitals calculates the travel time by transit to closest hospitals.",
    "measureCode": "M",
    "paramDesc": travelTimeParam,
    "params": [
      {
        "paramName": "Closest hospital",
        "paramCode": "t1"
      },
      {
        "paramName": "3rd closest hospital",
        "paramCode": "t3"
      },
    ],
    "periods": periodOptions,
    "autos": autoOptions,
    "fares": fareNA
  },
  "urgentcare": {
    "destName" : "Urgent Care Facilities",
    "destMeasureLabel": "Travel time to urgent care",
    "destMeasureUnit": "min",
    "destMeasure": "Travel time to urgent care calculates the travel time by transit to the closest facilities that provide emergency care, surgery, and recuperative care.",
    "measureCode": "M",
    "paramDesc": travelTimeParam,
    "params": [
      {
        "paramName": "Closest facility",
        "paramCode": "t1"
      },
      {
        "paramName": "3rd closest facility",
        "paramCode": "t3"
      },
    ],
    "periods": periodOptions,
    "autos": autoOptions,
    "fares": fareNA
  },
  "pharmacies": {
    "destName" : "Pharmacies",
    "destMeasureLabel": "Travel time to pharmacies",
    "destMeasureUnit": "min",
    "destMeasure": "Travel time to pharmacies calculates the travel time by transit to the closest pharmacies.",
    "measureCode": "M",
    "paramDesc": travelTimeParam,
    "params": [
      {
        "paramName": "Closest pharmacy",
        "paramCode": "t1"
      },
      {
        "paramName": "3rd closest pharmacy",
        "paramCode": "t3"
      },
    ],
    "periods": periodOptions,
    "autos": autoOptions,
    "fares": fareNA
  },
  "parks": {
    "destName" : "Parks & Greenspace",
    "destMeasureLabel": "Acres reachable",
    "destMeasureUnit": "acres",
    "destMeasure": "Access to parks counts the total acreage of parks and public greenspace that can be reached on transit, within a certain amount of time.",
    "measureCode": "P",
    "paramDesc": accessParam,
    "params": [
      {
        "paramName": "15 minutes",
        "paramCode": "c15"
      },
      {
        "paramName": "30 minutes",
        "paramCode": "c30"
      }
    ],
    "periods": periodOptions,
    "autos": autoOptions,
    "fares": fareNA
  },
  "schools": {
    "destName" : "Colleges & Universities",
    "destMeasureLabel": "Travel Time to Post-Secondary Schools",
    "destMeasureUnit": "min",
    "destMeasure": "Travel time to post-secondary schools calculates the travel time by transit to the universities or colleges.",
    "measureCode": "M",
    "paramDesc": travelTimeParam,
    "params": [
      {
        "paramName": "Closest school",
        "paramCode": "t1"
      },
      {
        "paramName": "3rd closest school",
        "paramCode": "t3"
      },
    ],
    "periods": periodOptions,
    "autos": autoOptions,
    "fares": fareNA
  },
  "los": {
    "destName" : "Transit Service Intensity",
    "destMeasureLabel": "Average Hourly Trips",
    "destMeasureUnit": "trips",
    "destMeasure": "Transit service intensity measures the average hourly unique scheduled trips serving an area throughout the course of a day. It is a function of density (how many routes serve an area) and frequency (how often).",
    "measureCode": "trips",
    "paramDesc": "",
    "params": [
      {
        "paramName": "--Options Not Applicable--",
        "paramCode": "NA"
      }
    ],
    "periods": losPeriodOptions,
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
  Updates the options available on the dropdowns in the sidebar based on the
  destination chosen by the user. This requires removing and re-populating
  the dropdowns on a selection change in destinations.
*/
function optionsUpdate(){
    var destList = document.getElementById('destination');
    var destination = destList.options[destList.selectedIndex].value

    var paramList = document.getElementById('param')
    var periodList = document.getElementById('period')

    var measureText = document.getElementById('measurement')
    measureText.innerHTML = options[destination]['destMeasure']

    var paramText = document.getElementById('parameterDesc')
    paramText.innerHTML = options[destination]['paramDesc']
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
      zone = 'urban';
    }

    if ((s_key[0] == 'los_trips') & (s_key.length > 3)){
      var key = 'los_trips_' + s_key[3]
    }
    else{
      var key = s_key.join("_")
    }
    // Now we gotta update the paramz
    var newParams = new URLSearchParams()
    
    newParams.set('key', key)
    newParams.set('zone', zone)
    newParams.set('date', date)
    newParams.set("demo", demo)
    
    history.replaceState(null, null, "?" + newParams.toString())

    // Now to update the map state itself

    // Start with the zone update
    if (zone == 'msa'){
      state['tag'] = view['name'] + "-msa"
    }
    else if (zone == 'er'){
      state['tag'] = view['name'] + "-er"
    }
    else if (zone == 'urban'){
      state['tag'] = view['name'] + "-urban"
    }
    else if (zone == 'equity'){
      state['tag'] = view['name'] + "-equity"
    }
    else{
      state['tag'] = view['name']
    }

    // TODO: Check if date is valid
    state['date'] = date
    state['score']['key'] = key

    var updateScore = false;
    if (state['score']['url'] != "/data/score/" + state['tag'] + "/" + key + "/" + date){
      updateScore = true;
      state['score']['url'] = "/data/score/" + state['tag'] + "/" + key + "/" + date 
    }

    // Update the time series URL
    var updateTime = false;
    if (state['time']['url'] != "/data/time/" + view['name'] + "/" + key){
      updateTime = true;
      state['time']['url'] = "/data/time/" + view['name'] + "/" + key
    }

    // Update the labels
    state['score']['label'] = options[s_key[0]]['destMeasureLabel']
    if (key.includes('_autoY_')){
      state['score']['unit'] = ''
      state['score']['label'] += " (transit/auto)"
    }
    else{
      state['score']['unit'] = options[s_key[0]]['destMeasureUnit']
    }
    
    // Update overlay data
    var updateOverlay = false;
    if (demo == 'none'){
      demo = null
    }
    if (state['overlay'] != demo){
      updateOverlay = true;
      state['overlay'] = demo
    }

    setOptionsFromParams();

    // Now update the sharable link

    // Reload the map data
    if (updateScore){
      loadMapData();
    }
    
    loadTimeData(updateTime);
    
    if (updateOverlay){
      loadOverlay();
    }
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

    if (s_split[0] != "los"){
      periodList.value = s_split[3];
      paramList.value = s_split[2];
      autoList.value = s_split[4];
      fareList.value = s_split[5];
    }

    demoList.value = mapParams.get('demo');
}

/**
 * Function triggered when the user submits a new map configuration
*/
function updateMapClicked(){
  // Start with a blank query string state
  queryParams = new URLSearchParams();
  currentParams = new URLSearchParams(window.location.search)

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
  if (destination != 'los'){
    var key = destination + "_" + options[destination]['measureCode'] + "_" + param + "_" + period + "_" + auto + "_" + fare
  }
  else{
    var key = "los_trips_" + period
  }

  queryParams.set("zone", zone)
  queryParams.set("key", key)
  queryParams.set("demo", demo)
  queryParams.set("date", currentParams.get('date')) // Pass the date along
  history.replaceState(null, null, "?" + queryParams.toString())
  setStateFromParams();
}



