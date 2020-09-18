// Start by populating the lists with appropriate data
$(document).ready(function () {
    measureUpdate()
});

function measureUpdate(){

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
        destList.options[1] = new Option("Employment, Low Income", "C100")
        destList.options[2] = new Option("Grocery", "C100")
        destList.options[3] = new Option("Hospital", "C100")
        destList.options[4] = new Option("Urgent Care", "C100")
        destList.options[5] = new Option("Pharmacy", "C100")
        destList.options[6] = new Option("Parks/Green Space", "C100")
        destList.options[7] = new Option("Colleges/Universities", "C100")
    }
    else if (selectedMeasure == "M"){
        destList.options[0] = new Option("Grocery", "C100", true)
        destList.options[1] = new Option("Hospital", "C100")
        destList.options[2] = new Option("Urgent Care", "C100")
        destList.options[3] = new Option("Pharmacy", "C100")
        destList.options[4] = new Option("Colleges/Universities", "C100")
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
        periodList.options[1] = new Option("Weekday Evening", "PM")
        periodList.options[2] = new Option("Weekend", "WE")
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
        paramList.options[0] = new Option("1 Opportunity", "m1", true)
        paramList.options[1] = new Option("2 Opportunities", "m2")
        paramList.options[2] = new Option("3 Opportunities", "m3")
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

function updateMapClicked(){
    queryParams = new URLSearchParams();
    console.log(queryParams)

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
}

