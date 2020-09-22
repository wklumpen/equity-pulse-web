// TO BE EXPANDED WITH MORE OPTIONS
var zoneList = ['all', 'msa']
var measureList = ['A', 'M']
var AGDestList = ['C000']
var MDestList = ['snap']
var periodOptionsList = ['MP']
var AParamList = ['c30', 'c60', 'c45']
var MParamList = ['time1', 'time3']
var fareYesNo = ['No', 'Yes']
var demoList = ['none', 'poverty']

/*
    Code to manage the options portion of the application, including
    dynamically linked drop down lists, etc.
*/
// Start by populating the lists with appropriate data
$(document).ready(function () {
    optionsUpdate()
});

function optionsUpdate(){
    // Start by getting the elements needed for destinations
    var measureList = document.getElementById('measure');
    var destList = document.getElementById('destination')
    var selectedMeasure = measureList.options[measureList.selectedIndex].value

    // Clear the list
    var i, L = destList.options.length - 1;
    for(i = L; i >= 0; i--) {
        destList.remove(i);
    }

    if (["A", "G"].includes(selectedMeasure)){
        destList.options[0] = new Option("Employment, All", "C000", true)
        // destList.options[1] = new Option("Employment, Low Income", "C100")
        // destList.options[2] = new Option("Grocery", "C100")
        // destList.options[3] = new Option("Hospital", "C100")
        // destList.options[4] = new Option("Urgent Care", "C100")
        // destList.options[5] = new Option("Pharmacy", "C100")
        // destList.options[6] = new Option("Parks/Green Space", "C100")
        // destList.options[7] = new Option("Colleges/Universities", "C100")
    }
    else if (selectedMeasure == "M"){
        destList.options[0] = new Option("Grocery", "snap", true)
        // destList.options[1] = new Option("Hospital", "C100")
        // destList.options[2] = new Option("Urgent Care", "C100")
        // destList.options[3] = new Option("Pharmacy", "C100")
        // destList.options[4] = new Option("Colleges/Universities", "C100")
    }
    else if (selectedMeasure == "T"){
        destList.options[0] = new Option("Parks/Green Space", "GS", true)
    }
    else if (selectedMeasure == "S"){
        destList.options[0] = new Option("--Not Applicable--", "NA", true)
    }
    else {
        destList.options[0] = new Option("--Select Measure--", "", true)
    }

    // Now we update the time periods
    var periodList = document.getElementById('period')
    
    // Clear it out
    L = periodList.options.length - 1;
    for(i = L; i >= 0; i--) {
        periodList.remove(i);
    }

    // Populate it
    if (selectedMeasure == "S"){
        periodList.options[0] = new Option("--Not Applicable--", "NA", true)
    }
    else{
        periodList.options[0] = new Option("Morning Peak", "MP", true)
        // periodList.options[1] = new Option("Weekday Evening", "PM")
        // periodList.options[2] = new Option("Weekend", "WE")
    }

    // Now we update the parameters
    paramList = document.getElementById('param')

    // Clear it out
    L = paramList.options.length - 1;
    for(i = L; i >= 0; i--) {
        paramList.remove(i);
    }

    // Populate it
    if (selectedMeasure == "A"){
        paramList.options[0] = new Option("30 minutes", "c30", true)
        paramList.options[1] = new Option("45 minutes", "c45")
        paramList.options[2] = new Option("60 minutes", "c60")
    }
    else if (selectedMeasure == "G"){
        paramList.options[0] = new Option("Gravity P1 (Placeholder)", "g1", true)
        paramList.options[1] = new Option("Gravity P2 (Placeholder)", "g2")
        paramList.options[2] = new Option("Gravity P3 (Placeholder)", "g3")
    }
    else if (selectedMeasure == "M"){
        paramList.options[0] = new Option("1 Opportunity", "time1", true)
        // paramList.options[1] = new Option("2 Opportunities", "time2")
        paramList.options[1] = new Option("3 Opportunities", "time3")
    }
    else if (selectedMeasure == "T"){
        paramList.options[0] = new Option("Threshold 1 (Placeholder)", "t1", true)
        paramList.options[1] = new Option("Threshold 2 (Placeholder)", "t2")
        paramList.options[2] = new Option("Threshold 3 (Placeholder)", "t3")
    }
    else if (selectedMeasure == "S"){
        paramList.options[0] = new Option("--Not Applicable--", "NA", true)
    }

    // Now we update the fares
    fareList = document.getElementById('fare')

    // Clear it out
    L = fareList.options.length - 1;
    for(i = L; i >= 0; i--) {
        fareList.remove(i);
    }

    // Populate it
    if (["S", "T", "M"].includes(selectedMeasure)){
        fareList.options[0] = new Option("--Not Applicable--", "NA", true)
    }
    else{
        fareList.options[0] = new Option("No", "No", true)
        fareList.options[1] = new Option("Yes", "Yes", true)
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
    var measure = null;
    var destination = null;
    var period = null;
    var param = null;
    var fare = null;
    var date = null;
    var demo = null;
    var zone = null;

    // Now some default logic for checking.
    // If no measure passed, we just go for the default
    if (mapParams.has('measure') & measureList.includes(mapParams.get('measure'))){
      measure = mapParams.get('measure')

      if (measure == 'A'){
        if (mapParams.has('destination') & AGDestList.includes(mapParams.get('destination'))){
          destination = mapParams.get('destination')
        }
        else{
          destination = AGDestList[0] // Default destination
        }
        if (mapParams.has('param') & AParamList.includes(mapParams.get('param'))){
          param = mapParams.get('param')
        }
        else{
          param = AParamList[0] // Default param
        }
        if (mapParams.has('period') & periodOptionsList.includes(mapParams.get('period'))){
          period = mapParams.get('period')
        }
        else{
          period = periodOptionsList[0]
        }
        if (mapParams.has('fare') & fareYesNo.includes(mapParams.get('fare'))){
          fare = mapParams.get('fare')
        }
        else{
          fare = fareYesNo[0]
        }
      }

      // Validation for minimum travel time parameters
      else if (measure == 'M'){
        if (mapParams.has('destination') & MDestList.includes(mapParams.get('destination'))){
          destination = mapParams.get('destination')
        }
        else{
          destination = MDestList[0] // Default destination
        }
        if (mapParams.has('param') & MParamList.includes(mapParams.get('param'))){
          param = mapParams.get('param')
        }
        else{
          param = MParamList[0] // Default param
        }
        if (mapParams.has('period') & periodOptionsList.includes(mapParams.get('period'))){
          period = mapParams.get('period')
        }
        else{
          period = periodOptionsList[0]
        }
        fare = 'NA'
      }
    }
    else{
      measure = 'A'
      destination = AGDestList[0]
      period = periodOptionsList[0]
      param = AParamList[0]
      fare = fareYesNo[0]
    }

    if (mapParams.has('date')){
      date = mapParams.get('date')
    }
    else{
      console.log("Setting Date:", view['max_date'])
      date = view['max_date']
    }

    if (mapParams.has('demo') & demoList.includes(mapParams.get('demo'))){
      demo = mapParams.get('demo')
    }
    else{
      demo = demoList[0]
    }

    if (mapParams.has('zone') & zoneList.includes(mapParams.get('zone'))){
      zone = mapParams.get('zone')
    }
    else{
      zone = zoneList[0]
    }

    // Now we gotta update the paramz
    var newParams = new URLSearchParams()
    
    newParams.set('zone', zone)
    newParams.set('measure', measure)
    newParams.set('destination', destination)
    newParams.set('period', period)
    newParams.set('param', param)
    newParams.set('fare', fare)
    newParams.set('date', date)
    newParams.set("demo", demo)
    history.replaceState(null, null, "?" + newParams.toString())

    // Now to update the map state itself

    // Start with the zone update
    oldTag = state['tag']
    if (zone == 'msa'){
        state['tag'] = view['name'] + "-msa"
    }
    else{
        state['tag'] = view['name']
    }

    // Now a date update
    console.log(date)
    state['date'] = date

    console.log(state['score']['url'])

    state['score']['url'] = state['score']['url'].replace(oldTag, state['tag'])

    // Now the measure update
    newMeasureKey = measure + "_" + destination + "_" + param + "_" + date + "_" + period
    state['score']['url'] = "/data/score/" + state['tag'] + "/" + newMeasureKey
    console.log(state['score']['url'])

    // Update the time series URL
    state['time']['url'] = "/data/time/" + state['tag'] + "/" + newMeasureKey.replace("_<DATE>", "")

    // Update the labels
    if (newMeasureKey.split("_")[1].charAt(0) == 'C'){
        state['score']['label'] = 'Jobs Accessible'
        state['score']['unit'] = 'jobs'
    }
    else{
        state['score']['label'] = 'Travel Time'
        state['score']['unit'] = 'min'
    }

    // Update overlay data
    if (demo == 'poverty'){
        state['overlay']['url'] = "/data/pop/" + state['tag'] + "/pop_poverty"
        state['overlay']['label'] = "Number of people in poverty"
        state['overlay']['title'] = "People below the poverty line"
        state['overlay']['unit'] = 'people'
        state['dot']['url'] = "/static/data/" + view['name'] + "_pop_poverty.geojson"
    }
    else if (demo == 'none'){
        state['overlay']['url'] = null;
        state['dot']['url'] = null;
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
    var measureList = document.getElementById('measure');
    var destList = document.getElementById('destination');
    var periodList = document.getElementById('period');
    var paramList = document.getElementById('param');
    var fareList = document.getElementById('fare');
    var demoList = document.getElementById('demo');

    measureList.value = mapParams.get('measure');
    optionsUpdate();
    destList.value = mapParams.get('destination');
    periodList.value = mapParams.get('period');
    paramList.value = mapParams.get('param');
    fareList.value = mapParams.get('fare');
    demoList.value = mapParams.get('demo');
}



