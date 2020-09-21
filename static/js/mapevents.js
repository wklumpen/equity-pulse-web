
/**
 * Function triggered when the user submits a new map configuration
*/
function updateMapClicked(){
    // Start with a blank query string state
    queryParams = new URLSearchParams(window.location.search);
    console.log(queryParams)

    // Build all the options where possible

    var zoneList = document.getElementById('zones')
    var zone = zoneList.options[zoneList.selectedIndex].value

    var measureList = document.getElementById('measure');
    var measure = measureList.options[measureList.selectedIndex].value

    var destList = document.getElementById('destination');
    var destination = destList.options[destList.selectedIndex].value

    var periodList = document.getElementById('period');
    var period = periodList.options[periodList.selectedIndex].value

    var paramList = document.getElementById('param');
    var param = paramList.options[paramList.selectedIndex].value

    var fareList = document.getElementById('fare');
    var fare = fareList.options[fareList.selectedIndex].value

    var demoList = document.getElementById('demo')
    var demo = demoList.options[demoList.selectedIndex].value

    queryParams.set("zone", zone)
    queryParams.set("measure", measure)
    if (destination != "NA"){
        queryParams.set("destination", destination)
    }
    if (period != "NA"){
        queryParams.set("period", period)
    }
    if (param != "NA"){
        queryParams.set("param", param)
    }
    if (fare != "NA"){
        queryParams.set("fare", fare) 
    }
    queryParams.set("demo", demo)
    history.replaceState(null, null, "?" + queryParams.toString())
    setStateFromParams();
}