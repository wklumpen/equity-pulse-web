
var chartData = []
var coronaData = []
var reliabilityData = []
var reliabilityAgencyMode = []

var coronaMargin = {top: 50, right: 60, bottom: 40, left: 30}
var coronaBoxWidth = d3.select("#corona").node().getBoundingClientRect().width
var coronaBoxHeight = d3.select("#corona").node().getBoundingClientRect().height
var coronaChartWidth = coronaBoxWidth - coronaMargin.left - coronaMargin.right
var coronaChartHeight = coronaBoxHeight - coronaMargin.top - coronaMargin.bottom

var coronaBox = d3.select("#corona").append('svg').attr('width', coronaBoxWidth).attr('height', coronaBoxHeight)
var coronaSVG = coronaBox.append('g').attr("transform", "translate(" + coronaMargin.left + "," + coronaMargin.top + ")");

if (view['reliability'] == true){
    var reliabilityMargin = {top: 20, right: 40, bottom: 80, left: 30}
    var reliabilityBoxWidth = d3.select("#reliability").node().getBoundingClientRect().width
    var reliabilityBoxHeight = d3.select("#reliability").node().getBoundingClientRect().height
    var reliabilityChartWidth = reliabilityBoxWidth - reliabilityMargin.left - reliabilityMargin.right
    var reliabilityChartHeight = reliabilityBoxHeight - reliabilityMargin.top - reliabilityMargin.bottom

    var reliabilityBox = d3.select("#reliability").append('svg').attr('width', reliabilityBoxWidth).attr('height', reliabilityBoxHeight)
    var reliabilitySVG = reliabilityBox.append('g').attr("transform", "translate(" + reliabilityMargin.left + "," + reliabilityMargin.top + ")");
}



// jobs-access-groups-date chart shows access on a single date
var jobsAccessGroupsDateMargin = {top: 50, right: 20, bottom: 40, left: 20}
var jobsAccessGroupsDateBoxWidth = d3.select("#jobs-access-groups-date").node().getBoundingClientRect().width
var jobsAccessGroupsDateBoxHeight = d3.select("#jobs-access-groups-date").node().getBoundingClientRect().height
var jobsAccessGroupsDateChartWidth = jobsAccessGroupsDateBoxWidth - jobsAccessGroupsDateMargin.left - jobsAccessGroupsDateMargin.right
var jobsAccessGroupsDateChartHeight = jobsAccessGroupsDateBoxHeight - jobsAccessGroupsDateMargin.top - jobsAccessGroupsDateMargin.bottom

// jobs-access-series shows a time series of job access
var jobsAccessSeriesMargin = {top: 25, right: 200, bottom: 40, left: 40}
var jobsAccessSeriesBoxWidth = d3.select("#jobs-access-series").node().getBoundingClientRect().width
var jobsAccessSeriesBoxHeight = d3.select("#jobs-access-series").node().getBoundingClientRect().height
var jobsAccessSeriesChartWidth = jobsAccessSeriesBoxWidth - jobsAccessSeriesMargin.left - jobsAccessSeriesMargin.right
var jobsAccessSeriesChartHeight = jobsAccessSeriesBoxHeight - jobsAccessSeriesMargin.top - jobsAccessSeriesMargin.bottom

//Time series of travel times to hospitals
var hospitalAccessSeriesMargin = {top: 25, right: 200, bottom: 40, left: 40}
var hospitalAccessSeriesBoxWidth = d3.select("#hospital-access-series").node().getBoundingClientRect().width
var hospitalAccessSeriesBoxHeight = d3.select("#hospital-access-series").node().getBoundingClientRect().height
var hospitalAccessSeriesChartWidth = hospitalAccessSeriesBoxWidth - hospitalAccessSeriesMargin.left - hospitalAccessSeriesMargin.right
var hospitalAccessSeriesChartHeight = hospitalAccessSeriesBoxHeight - hospitalAccessSeriesMargin.top - hospitalAccessSeriesMargin.bottom

//Time series of travel times to grocery stores
var storeAccessSeriesMargin = {top: 25, right: 200, bottom: 80, left: 40}
var storeAccessSeriesBoxWidth = d3.select("#store-access-series").node().getBoundingClientRect().width
var storeAccessSeriesBoxHeight = d3.select("#store-access-series").node().getBoundingClientRect().height
var storeAccessSeriesChartWidth = storeAccessSeriesBoxWidth - storeAccessSeriesMargin.left - storeAccessSeriesMargin.right
var storeAccessSeriesChartHeight = storeAccessSeriesBoxHeight - storeAccessSeriesMargin.top - storeAccessSeriesMargin.bottom

var jobsFaresSeriesMargin = {top: 50, right: 20, bottom: 40, left: 20}
var jobsFaresSeriesBoxWidth = d3.select("#jobs-fares-series").node().getBoundingClientRect().width
var jobsFaresSeriesBoxHeight = d3.select("#jobs-fares-series").node().getBoundingClientRect().height
var jobsFaresSeriesChartWidth = jobsFaresSeriesBoxWidth - jobsFaresSeriesMargin.left - jobsFaresSeriesMargin.right
var jobsFaresSeriesChartHeight = jobsFaresSeriesBoxHeight - jobsFaresSeriesMargin.top - jobsFaresSeriesMargin.bottom

var losSeriesMargin = {top: 25, right: 200, bottom: 40, left: 40}
var losSeriesBoxWidth = d3.select("#los-series").node().getBoundingClientRect().width
var losSeries = d3.select("#los-series").node().getBoundingClientRect().height
var losSeriesChartWidth = losSeriesBoxWidth - losSeriesMargin.left - losSeriesMargin.right
var losSeriesChartHeight = losSeries - losSeriesMargin.top - losSeriesMargin.bottom

var carJobsAccessSeriesMargin = {top: 50, right: 10, bottom: 40, left: 10}
var carJobsAccessSeriesBoxWidth = d3.select("#car-jobs-access-series").node().getBoundingClientRect().width
var carJobsAccessSeriesBoxHeight = d3.select("#car-jobs-access-series").node().getBoundingClientRect().height
var carJobsAccessSeriesChartWidth = carJobsAccessSeriesBoxWidth - carJobsAccessSeriesMargin.left - carJobsAccessSeriesMargin.right
var carJobsAccessSeriesChartHeight = carJobsAccessSeriesBoxHeight - carJobsAccessSeriesMargin.top - carJobsAccessSeriesMargin.bottom

// var carLowWageJobsAccessSeriesMargin = {top: 25, right: 150, bottom: 40, left: 40}
// var carLowWageJobsAccessSeriesBoxWidth = d3.select("#car-low-wage-jobs-access-series").node().getBoundingClientRect().width
// var carLowWageJobsAccessSeriesBoxHeight = d3.select("#car-low-wage-jobs-access-series").node().getBoundingClientRect().height
// var carLowWageJobsAccessSeriesChartWidth = carLowWageJobsAccessSeriesBoxWidth - carLowWageJobsAccessSeriesMargin.left - carLowWageJobsAccessSeriesMargin.right
// var carLowWageJobsAccessSeriesChartHeight = carLowWageJobsAccessSeriesBoxHeight - carLowWageJobsAccessSeriesMargin.top - carLowWageJobsAccessSeriesMargin.bottom

// var carHospitalTravelSeriesMargin = {top: 25, right: 150, bottom: 40, left: 40}
// var carHospitalTravelSeriesBoxWidth = d3.select("#car-hospital-travel-series").node().getBoundingClientRect().width
// var carHospitalTravelSeriesBoxHeight = d3.select("#car-hospital-travel-series").node().getBoundingClientRect().height
// var carHospitalTravelSeriesChartWidth = carHospitalTravelSeriesBoxWidth - carHospitalTravelSeriesMargin.left - carHospitalTravelSeriesMargin.right
// var carHospitalTravelSeriesChartHeight = carHospitalTravelSeriesBoxHeight - carHospitalTravelSeriesMargin.top - carHospitalTravelSeriesMargin.bottom

// Initialize the map boxes and the SVG elements for the charts
var jobsAccessGroupsDateBox = d3.select("#jobs-access-groups-date").append('svg').attr('width', jobsAccessGroupsDateBoxWidth).attr('height', jobsAccessGroupsDateBoxHeight)
var jobsAccessGroupsDateSVG = jobsAccessGroupsDateBox.append('g').attr("transform", "translate(" + jobsAccessGroupsDateMargin.left + "," + jobsAccessGroupsDateMargin.top + ")");
var jobsAccessSeriesBox = d3.select("#jobs-access-series").append('svg').attr('width', jobsAccessSeriesBoxWidth).attr('height', jobsAccessSeriesBoxHeight)
var jobsAccessSeriesSVG = jobsAccessSeriesBox.append('g').attr("transform", "translate(" + jobsAccessSeriesMargin.left + "," + jobsAccessSeriesMargin.top + ")");
var hospitalAccessSeriesBox = d3.select("#hospital-access-series").append('svg').attr('width', hospitalAccessSeriesBoxWidth).attr('height', hospitalAccessSeriesBoxHeight)
var hospitalAccessSeriesSVG = hospitalAccessSeriesBox.append('g').attr("transform", "translate(" + hospitalAccessSeriesMargin.left + "," + hospitalAccessSeriesMargin.top + ")");
var storeAccessSeriesBox = d3.select("#store-access-series").append('svg').attr('width', storeAccessSeriesBoxWidth).attr('height', storeAccessSeriesBoxHeight)
var storeAccessSeriesSVG = storeAccessSeriesBox.append('g').attr("transform", "translate(" + storeAccessSeriesMargin.left + "," + storeAccessSeriesMargin.top + ")");
var jobsFaresSereiesBox = d3.select("#jobs-fares-series").append('svg').attr('width', jobsFaresSeriesBoxWidth).attr('height', jobsFaresSeriesBoxHeight)
var jobsFaresSeriesSVG = jobsFaresSereiesBox.append('g').attr("transform", "translate(" + jobsFaresSeriesMargin.left + "," + jobsFaresSeriesMargin.top + ")");
var losSeriesBox = d3.select("#los-series").append('svg').attr('width', losSeriesBoxWidth).attr('height', losSeries)
var losSeriesSVG = losSeriesBox.append('g').attr("transform", "translate(" + losSeriesMargin.left + "," + losSeriesMargin.top + ")");
var carJobsAccessSeriesBox = d3.select("#car-jobs-access-series").append('svg').attr('width', carJobsAccessSeriesBoxWidth).attr('height', carJobsAccessSeriesBoxHeight)
var carJobsAccessSeriesSVG = carJobsAccessSeriesBox.append('g').attr("transform", "translate(" + carJobsAccessSeriesMargin.left + "," + carJobsAccessSeriesMargin.top + ")");
// var carLowWageJobsAccessSeriesBox = d3.select("#car-low-wage-jobs-access-series").append('svg').attr('width', carLowWageJobsAccessSeriesBoxWidth).attr('height', carLowWageJobsAccessSeriesBoxHeight)
// var carLowWageJobsAccessSeriesSVG = carLowWageJobsAccessSeriesBox.append('g').attr("transform", "translate(" + carLowWageJobsAccessSeriesMargin.left + "," + carLowWageJobsAccessSeriesMargin.top + ")");
// var carHospitalTravelSeriesBox = d3.select("#car-hospital-travel-series").append('svg').attr('width', carHospitalTravelSeriesBoxWidth).attr('height', carHospitalTravelSeriesBoxHeight)
// var carHospitalTravelSeriesSVG = carHospitalTravelSeriesBox.append('g').attr("transform", "translate(" + carHospitalTravelSeriesMargin.left + "," + carHospitalTravelSeriesMargin.top + ")");

d3.select(window).on('resize', handleResize);

// loadCoronaData();
// loadReliabilityData();
handleResize();

function loadCoronaData(){
    d3.csv("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv")
    .then(function(data){
        // First we filter down to the one region
        if (view['name'] == 'nyc'){
            counties = ['New York', 'Kings', 'Queens', 'Bronx', 'Richmond']
            d = data.filter(d => (counties.includes(d['Admin2']) & d['Province_State'] == view['state']));
        }
        else if (view['name'] == 'dc'){
            d = data.filter(d => (d['Admin2'] == 'District of Columbia' & d['Province_State'] == "District of Columbia"));
        }
        else{
            d = data.filter(d => (d['Admin2'] == view['county'] & d['Province_State'] == view['state']));
        }
        
        coronaData = []

        $.each(d[0], function(key, val){
            if (moment(key, "M/D/YY", true).isValid()){
                if (val > 1){
                    coronaData.push({"date":moment(key, "MM/DD/YY").valueOf(), "cases": +val/(view['population']/100000)})
                }
            }
        });

        coronaData.sort((a, b) => d3.ascending(a.date, b.date))

        for (i=0; i < coronaData.length; i++){
            if (i < 7){
                coronaData[i]['new'] = null;
            }
            else{
                coronaData[i]['new'] = (coronaData[i].cases - coronaData[i-7].cases)/7
            }
        }
        coronaData.splice(0, 6);
        updateCoronaPlot();
    })
}

function loadReliabilityData(){
    if (view['reliability'] == true){
        reliabilityData = []
        reliabilityAgencies = []
        reliabilityModes = []
        d3.json("/data/reliability/"+ view['name'], {
            headers : new Headers({
                "Content-Type": "application/json",
                'Accept': 'application/json'
            }),
        })
        .then(function(data){
            reliabilityData = []
            data.forEach(function(item, index){
                reliabilityData.push({'timestamp': moment(item.timestamp).valueOf(), 'agency': item.agency, 'mode': item.mode, 'otp':+item.otp})
                reliabilityAgencyMode.push(item.agency+'-'+item.mode)
            })
            reliabilityAgencyMode = [... new Set(reliabilityAgencyMode)]
            reliabilityData.sort((a,b) => d3.ascending(a.timestamp, b.timestamp))
            updateReliabilityChart();
            
        });
    }
}
function loadChartData(){
    // "/data/summary/"+ view['name']
    
    d3.json("/data/summary/"+ view['name'], {
        headers : new Headers({
            "Content-Type": "application/json",
            'Accept': 'application/json'
        }),
    })
    .then(function(data){
        chartData = []
        data.forEach(function(item, index){
            chartData.push({'date': moment(item.date).valueOf(), 'description': item.description, 'zone': item.zone, 'score_key':item.score_key, 'value': +item.value})
        })
        updateAllCharts();
    });
}

function updateCoronaPlot(){
    coronaBoxWidth = d3.select("#corona").node().getBoundingClientRect().width
    coronaBoxHeight = d3.select("#corona").node().getBoundingClientRect().height
    coronaChartWidth = coronaBoxWidth - coronaMargin.left - coronaMargin.right
    coronaChartHeight = coronaBoxHeight - coronaMargin.top - coronaMargin.bottom

    coronaBox
        .attr('width', coronaBoxWidth)
        .attr('height', coronaBoxHeight)

    coronaSVG.selectAll("*").remove();

    var x = d3.scaleTime()
        .domain(d3.extent(coronaData, d => d.date))
        .rangeRound([coronaMargin.left, coronaChartWidth]);  
    
    var y = d3.scaleLinear()
        .domain(d3.extent(coronaData, d => d.new))
        .range([coronaChartHeight, 0])

    var line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.new))
        .curve(d3.curveMonotoneX)

    coronaSVG.append('path')
        .datum(coronaData)
        .attr('class', 'line')
        .attr("d", line)
        .style('fill', 'none')
        .style('stroke', 'purple')
        .style('stroke-width', 3)

    coronaSVG.append("g")
        .attr("transform", "translate(" + coronaMargin.left + ", 0)")
        .call(d3.axisLeft(y).ticks(4));


    if (coronaBoxWidth < 600){
        coronaSVG.append("g")
            .attr("transform", "translate(0," + coronaChartHeight + ")")
            .call(d3.axisBottom(x).ticks(4).tickFormat(d3.timeFormat("%b %Y")));
    }
    else{
        coronaSVG.append("g")
            .attr("transform", "translate(0," + coronaChartHeight + ")")
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %Y")));
    }
    
    coronaSVG.append("text")
        .attr("x", coronaChartWidth)
        .attr('y', coronaChartHeight + coronaMargin.bottom)
        .attr("dy", "-.75em")
        .text("Source: Johns Hopkins University")
        .attr('text-anchor', 'end')
        .attr("font-size", "0.7em")

    coronaSVG.append('text')
        .attr("x", coronaMargin.left)
        .attr('y', 20 - coronaMargin.top)
        .text("New Cases per 100,000 people, 7-day rolling average")
        .attr('text-anchor', 'start')
        .attr('font-weight', 'bold')
      
    // Now let's get to the mouse effects
    var mouseLine = coronaSVG.append('g')
        .attr('class', 'mouse-over-effects')
        .append('path')
        .attr('class', 'mouse-line')
        .style("pointer-events", "none")
        .style('stroke', 'black')
        .style('stroke-width', '1px')
        .style("opacity", "0")
        .style('shape-rendering', 'crispEdges')
    
    var mouseText = coronaSVG.append('text')

    coronaBox
        .on("mousemove", function () {
            mouse = d3.mouse(this);
            mouseX = mouse[0] - coronaMargin.left
            // console.log(mouse)
            date = moment(x.invert(mouseX)).startOf('day').valueOf();

            // Now look up the hovered data
            hoverData = coronaData.filter(d => d.date == date)[0];

            // Now add some text
            if (typeof(hoverData) !== 'undefined'){
                mouseLine
                    .attr("d", function(){
                    return "M" + (mouseX) + "," + coronaChartHeight + " " + (mouseX) + "," + 0;
                    })
                    .attr('display', null)
                    .style("opacity", 1)
                    .transition(30)

                mouseText
                    .attr("transform", "translate(" + (mouseX) + "-5)")
                    .attr('display', null)
                    .style("text-anchor", "middle")
                    .text(function (){
                        if (Math.round(hoverData.new) != 1){
                            return Math.round(hoverData.new) + " new cases/100k people"
                        }
                        else{
                            return Math.round(hoverData.new) + " new cases/100k people"
                        }
                    }).transition(100)
            }

        })
        .on("mouseout", function () {
            mouseText
                .attr('display', 'none')
                .transition(10)
            
            mouseLine
                .attr('display', 'none')
                .transition(10)
        });
}

function updateReliabilityChart(){
    reliabilityBoxWidth = d3.select("#reliability").node().getBoundingClientRect().width
    reliabilityBoxHeight = d3.select("#reliability").node().getBoundingClientRect().height
    reliabilityChartWidth = reliabilityBoxWidth - reliabilityMargin.left - reliabilityMargin.right
    reliabilityChartHeight = reliabilityBoxHeight - reliabilityMargin.top - reliabilityMargin.bottom

    reliabilityBox
        .attr('width', reliabilityBoxWidth)
        .attr('height', reliabilityBoxHeight)

    reliabilitySVG.selectAll("*").remove();

    var x = d3.scaleTime()
        .domain(d3.extent(reliabilityData, d => d.timestamp))
        .rangeRound([reliabilityMargin.left, reliabilityChartWidth]);  
    
    var y = d3.scaleLinear()
        .domain([0, 100])
        .range([reliabilityChartHeight, 0])

    var line = d3.line()
        .x(d => x(d.timestamp))
        .y(d => y(d.otp))
        .curve(d3.curveLinear)

    reliabilityAgencyMode.forEach(function(item){
        var itemIndex = reliabilityAgencyMode.indexOf(item)
        var agency = item.split('-')[0]
        var mode = item.split('-')[1]
        var toPlot = reliabilityData.filter(d => (d['agency'] == agency) & (d['mode'] == mode));
        var defined = function (d) { return d[1] !== null; };
        reliabilitySVG.append('path')
            .datum(toPlot)
            .attr('class', 'line')
            .attr("d", line)
            .style('fill', 'none')
            .style('stroke', colorList[itemIndex])
            .style("stroke-dasharray", function(d){
                if (mode == 'Rail'){
                    return ("2, 3")
                }
                else{
                    return null;
                }
            }) 
            .style('stroke-width', 2)
            .attr('opacity', 0.8)

        reliabilitySVG.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - reliabilityMargin.left)
            .attr("x",0 - (reliabilityChartHeight / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Daily Average On-Time Performance (%)");  

        reliabilitySVG.append("g")
            .attr("transform", "translate(" + reliabilityMargin.left + ", 0)")
            .call(d3.axisLeft(y).ticks(5));

        
        if (reliabilityBoxWidth < 600){
            reliabilitySVG.append("g")
            .attr("transform", "translate(0," + reliabilityChartHeight + ")")
            .call(d3.axisBottom(x).ticks(2));
        }
        else{
            reliabilitySVG.append("g")
            .attr("transform", "translate(0," + reliabilityChartHeight + ")")
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %d %Y")));
        }
        //Let's add a label
        reliabilitySVG.append("text")
            .attr("x", reliabilityMargin.left + 30)
            .attr('y', reliabilityChartHeight + reliabilityMargin.top + 25 + itemIndex*15)
            .attr("dy", "-.75em")
            .text(agency + " (" + mode + ")")
            .attr('text-anchor', 'start')
            .attr("font-size", "0.8em")

        reliabilitySVG.append('line')
            .attr("x1", reliabilityMargin.left)
            .attr("x2", reliabilityMargin.left + 18)
            .attr("y1", reliabilityChartHeight + reliabilityMargin.top + 25 + (itemIndex-1)*15)
            .attr("y2", reliabilityChartHeight + reliabilityMargin.top + 25 + (itemIndex-1)*15)
            .style('fill', 'none')
            .style('stroke', colorList[itemIndex])
            .style("stroke-dasharray", function(d){
                if (mode == 'Rail'){
                    return ("2, 3")
                }
                else{
                    return null;
                }
            }) 
            .style('stroke-width', 2)
            .attr('opacity', 0.8)
    });
}


function handleResize(){
    if(chartData.length == 0){
        loadChartData();
    }
    else{
        updateAllCharts();
    }
}

function updateAllCharts(){
    loadCoronaData();
    loadReliabilityData();

    var maxDate = d3.max(chartData, d => d['date'])
    // == Get job access and add in fare capped data ==
    var scores = chartData.filter(d => (d['score_key'] == 'C000_P_c45_AM_autoN_fareN') & (d['zone'] == view['name']+'-urban'))
    var everyoneFares = chartData.filter(d => (d['score_key'] == 'C000_P_c45_AM_autoN_fareY') & (d['zone'] == view['name']+'-urban') & (d['description'] == 'pop_total'))
    var everyoneWeeknights = chartData.filter(d =>(d['score_key'] == 'C000_P_c45_PM_autoN_fareN') & (d['zone'] == view['name']+'-urban') & (d['description'] == 'pop_total'))
    everyoneFares.forEach(function(item, index){
        scores.push({
            'date':item.date, 
            'description': 
            'everyone_fares', 
            'zone': view['name'] + '-urban', 
            'value': item.value, 
            'score_key': 'C000_P_c45_AM_autoN_fareN'
        })
    });

    everyoneWeeknights.forEach(function(item, index){
        scores.push({
            'date':item.date, 
            'description': 
            'everyone_weeknights', 
            'zone': view['name'] + '-urban', 
            'value': item.value, 
            'score_key': 'C000_P_c45_AM_autoN_fareN'
        })
    });

    // Define groups to plot
    var groups = [
        'pop_total', 
        'pop_asiapacific', 
        'pop_black', 
        'pop_hispanic', 
        'pop_white', 
        'pop_poverty', 
        'hhld_single_mother', 
        'workers_essential',
        'everyone_fares',
        'everyone_weeknights'
    ]

    barChart(
        jobsAccessGroupsDateBox, 
        jobsAccessGroupsDateSVG, 
        scores.filter(d => d['date'] == maxDate),
        maxDate,
        '#jobs-access-groups-date', 
        jobsAccessGroupsDateMargin, 
        groups, 
        'Jobs Accessible in 45 min by Transit',
        'Data for travel in the Urban Core of ' + view['title'] + ' on weekdays from 7am-9am (except if noted weeknights 10pm-12am) as of the week of ' + moment.utc(maxDate).format('MMMM D, YYYY') + '.'
    )

    // == Time series job access ==
    multilinePlot(
        jobsAccessSeriesBox, 
        jobsAccessSeriesSVG, 
        scores,
        maxDate, 
        '#jobs-access-series', 
        jobsAccessSeriesMargin, 
        groups, 
        'Jobs Accessible in 45 min', 
        'Data for weekdays 7am-9am (except if noted weeknights 10pm-12am) in the Urban Core of ' + view['title'] + '.'
    )

    // == Time series Hosp store access ==
    scores = chartData.filter(d => (d['score_key'] == 'hospitals_M_t1_PM_autoN_fareN') & (d['zone'] == view['name']+'-urban'))
    multilinePlot(
        hospitalAccessSeriesBox, 
        hospitalAccessSeriesSVG, 
        scores,
        maxDate, 
        '#hospital-access-series', 
        hospitalAccessSeriesMargin, 
        allGroups, 
        'Average Travel Time (min)', 
        'Data for weeknights 10pm-12am in the Urban Core of ' + view['title'] + '.'
    )

    // == Time series SNAP store access ==
    scores = chartData.filter(d => (d['score_key'] == 'snap_M_t3_WE_autoN_fareN') & (d['zone'] == view['name']+'-msa'))
    multilinePlot(
        storeAccessSeriesBox, 
        storeAccessSeriesSVG, 
        scores,
        maxDate, 
        '#store-access-series', 
        storeAccessSeriesMargin, 
        allGroups, 
        'Average Travel Time (min)', 
        'Data for Saturdays 10am-12pm in the Urban Core of ' + view['title'] + '.'
    )

    // == Time series comparison of weekly trips (level of service)  
    var scores = chartData.filter(d => (d['score_key'] == 'los_trips_WKD') & (d['zone'] == view['name']+'-urban'))
    groups = [
        'pop_total',
        'pop_asiapacific',
        'pop_black',
        'pop_hispanic',
        'pop_white',
        'workers_essential'
    ]
    multilinePlot(
        losSeriesBox, 
        losSeriesSVG, 
        scores,
        maxDate, 
        '#los-series', 
        losSeriesMargin, 
        allGroups, 
        'Average Trips/Hour', 
        'Data shows a typical weekday for the Urban Core of ' + view['title'] + '.'
    )

    // == Time series comparison between fare capped and non-capped
    var scores = chartData.filter(d => (d['zone'] == view['name']+'-msa'))
    var fareCompare = []
    var autoCompareJobs = []
    var autoCompareLow = []
    groups = [
        'pop_total',
        'pop_poverty'
    ]
    allGroups.forEach(function(key, index){
        var subset = scores.filter(d => d['description'] == key)
        // Now we get some dates
        var plotDates = []
        subset.forEach(function(dateKey, index){
            if (!plotDates.includes(dateKey.date)){
                plotDates.push(dateKey.date)
            }
        })
        plotDates.forEach(function(dateKey, index){
            var withFare = subset.filter(d => (d['date'] == dateKey) & (d.score_key == 'C000_P_c45_AM_autoN_fareY'))[0].value
            var withoutFare = subset.filter(d => (d['date'] == dateKey) & (d.score_key == 'C000_P_c45_AM_autoN_fareN'))[0].value
            var newValue = 100*(withFare/withoutFare)

            fareCompare.push({'date': dateKey, 'description': key, 'score_key':'extra_jobs_premium', 'value': newValue, 'zone': view['name']+'-msa'})
        })
    })

    carGroups = [
        'snap_M_t3_WE',
        'pharmacies_M_t3_WE',
        'urgentcare_M_t1_WE',
        'hospitals_M_t1_WE',
        'schools_M_t1_WE'
    ]
    var carData = []
    var scores = chartData.filter(d => (d['zone'] == view['name']+'-msa') & (d['date'] == maxDate) & (d['description'] == 'pop_poverty'))
    carGroups.forEach(function(key, index){
        var carTime = scores.filter(d => d['score_key'] == (key + '_autoY_fareN'))[0].value
        var busTime = scores.filter(d => d['score_key'] == (key + '_autoN_fareN'))[0].value
        carTime = (1/carTime)*busTime
        
        carData.push({'description': key, 'subgroup': 'car_time', 'value': carTime, 'zone': view['name'] + '-msa'})
        carData.push({'description': key, 'subgroup':'bus_time', 'value': busTime, 'zone': view['name'] + '-msa'})
    })

    groupedBarChart(
        carJobsAccessSeriesBox,
        carJobsAccessSeriesSVG,
        carData,
        '#car-jobs-access-series',
        carJobsAccessSeriesMargin,
        carGroups,
        ['car_time', 'bus_time'],
        'Travel Time to Destinations',
        'Data for Saturdays from 10am-12pm in the ' + view['title'] + ' MSA, as of the week of ' + moment.utc(maxDate).format('MMMM D, YYYY') + '.'
    )

    // == Time series comparison between fare capped and non-capped
    barChart(
        jobsFaresSereiesBox, 
        jobsFaresSeriesSVG, 
        fareCompare.filter(d => d['date'] == maxDate),
        maxDate,
        '#jobs-fares-series', 
        jobsFaresSeriesMargin, 
        allGroups, 
        'Jobs accessible by low-cost transit trips as percent of all accessible jobs',
        'Data for weekdays 7am-9am in ' + view['title'] + ' MSA as of the week of ' + moment.utc(maxDate).format('MMMM D, YYYY') + '.'
    )
}

function multilinePlot(box, svg, scores, maxDate, id, margin, groups, ylabel, note){
    var boxWidth = d3.select(id).node().getBoundingClientRect().width
    var boxHeight = d3.select(id).node().getBoundingClientRect().height
    var chartWidth = boxWidth - margin.left - margin.right
    var chartHeight = boxHeight - margin.top - margin.bottom

    box.attr('width', boxWidth).attr('height', boxHeight);
    svg.selectAll('*').remove();

    scores.sort((a,b) => d3.ascending(a.date, b.date))

    var barDate = maxDate
    var barScores = scores.filter(d => d['date'] == barDate)
    barScores = barScores.sort((a, b) => d3.ascending(a.value, b.value))

    var x = d3.scaleTime()
    .domain(d3.extent(scores, d => d.date))
    .rangeRound([margin.left, chartWidth])

    var y = d3.scaleLinear()
        .domain([0, d3.max(scores, d => d.value)])
        .range([chartHeight, 0])

    var line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.value))
        .curve(d3.curveLinear)
    
    // Now we simply add in some dates
    var dateList = []
    scores.forEach(function(key, index){
        if (!dateList.includes(key.date)){
            dateList.push(key.date)
        }
    })
    var sticks = svg.selectAll("stick")
        .data(dateList)
        .enter()
        .append("line")
        .attr("class", 'theStick')
        .attr("x1", d => x(d))
        .attr("x2", d => x(d))
        .attr("y1", 0)
        .attr("y2", chartHeight)
        .attr("stroke", function(d){
            if (d == barDate){
                return '#BEBEBE'
            }
            else{
                return "#F1F1F1"
            }
        })
        .attr('opacity', 0.7)
        .style('cursor', 'pointer')
        .style('stroke-width', '10px')
    
    var stickTexts = svg.selectAll("stickLabel")
        .data(dateList)
        .enter()
        .append("text")
        .attr("class", 'stickText')
        .attr("x", d => x(d))
        .attr('y', -18)
        .attr("dy", "-.75em")
        .text(d => moment(d).format('MMM D'))
        .attr('text-anchor', 'middle')
        .attr("dy", ".35em")
        .attr("font-size", "0.7em")
        .style('cursor', 'pointer')
        .style('font-weight', function(d){
            if (d == barDate){
                return 'bold'
            }
            else{
                return 'normal'
            }
        })

    svg.append('text')
        .attr('class', 'barDateLabel')
        .attr('x', chartWidth + 10)
        .attr('y', margin.top)
        .attr("dy", "-1.55em")
        .text("Week of " + moment(barDate).format('MMM D, YYYY'))
        .attr('text-anchor', 'start')
        .attr("font-size", "0.8em")

    // Add label text
    svg.append("text")
        .attr("x", chartWidth)
        .attr('y', chartHeight + margin.bottom)
        .attr("dy", "-.75em")
        .text(note)
        .attr('text-anchor', 'end')
        .attr("font-size", "0.7em")

    groups.forEach(function(key, index){
        var toPlot = scores.filter(d => (d['description'] == key));
        item = popStyle[key]
        svg.append('path')
            .datum(toPlot)
            .attr('class', 'line')
            .attr("d", line)
            .style('fill', 'none')
            .style('stroke', item.color)
            .style('stroke-width', function(){
                if (key == 'pop_total'){
                    return 4;
                }
                else{
                    return 2;
                }
            })
            .style('opacity', function(){
                if (key == 'pop_total'){
                    return 1.0;
                }
                else{
                    return 0.7;
                }
            })

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (chartHeight / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(ylabel);  

        svg.append("g")
            .attr("transform", "translate(" + margin.left + ", 0)")
            .call(d3.axisLeft(y).ticks(5));

        
        if (boxWidth < 600){
            svg.append("g")
            .attr("transform", "translate(0," + chartHeight + ")")
            .call(d3.axisBottom(x).ticks(2).tickFormat(d3.timeFormat("%b %Y")));
        }
        else{
            svg.append("g")
            .attr("transform", "translate(0," + chartHeight + ")")
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %Y")));
        }
    });

    var barY = d3.scaleBand()
        .domain(barScores.map(d => popStyle[d.description].label))
        .range([chartHeight, 10])
        .padding(0.1);  

    var barX = d3.scaleLinear()
        .domain([0, d3.max(barScores, d => d.value)])
        .range([0, margin.right-20])
    
    var bars = svg.selectAll('bars')
        .data(barScores)
        .enter()
        .append('rect')
        .attr('class', 'mpbar')
        .attr("y", d => barY(popStyle[d.description].label))
        .attr("x", d => chartWidth + 10)
        .attr("height", barY.bandwidth())
        .attr("width", d => barX(d.value))
        .style("opacity", function(d){
            if (d.description == 'pop_total'){
                return 1.0;
            }
            else{
                return 0.5;
            }
        })
        .attr("fill", d => popStyle[d.description].color)
    
    var barLabels = svg.selectAll("barlabel")
        .data(barScores)
        .enter()
        .append("text")
        .attr('class', 'mpbarText')
        .attr("x", d => chartWidth + 14)
        .attr('y', d => barY(popStyle[d.description].label) + barY.bandwidth()/2)
        .text(d => popStyle[d.description].label + " (" + styleNumbers(d.value) + ")")
        .attr('text-anchor', 'left')
        .attr("dy", ".35em")
        .attr("font-size", "0.8em")
        .style('fill', function(d){
            if (d.description == 'pop_total'){
                return 'white';
            }
            else{
                return 'black';
            }
        })
    
    // Now some mouse effects
    stickTexts.on('click', function (d){
        updateBars(d)
    })

    sticks.on('click', function (d){
        updateBars(d)
    })

    stickTexts.on('mouseover', function (d) {
        d3.select(this)
        .transition()
        .style('fill', '#2D74ED')
        .style('font-weight', 'bold')
        // Highlight the connections
    })
    .on('mouseout', function (d) {
        if (d == barDate){
            d3.select(this).transition().style('font-weight', 'bold').style('fill', 'black')
        }
        else{
            d3.select(this).transition().style('font-weight', 'normal').style('fill', 'black')
        }
        
    })

    sticks.on('mouseover', function (d) {
        console.log("Moused over stick", d)
        d3.select(this)
        .transition()
        .attr('stroke', '#2D74ED')
        .attr('opacity', 0.5)
        // Highlight the connections
    })
    .on('mouseout', function (d) {
        if (d == barDate){
            console.log("MaxDate")
            d3.select(this).transition().attr('stroke', '#BEBEBE')
        }
        else{
            d3.select(this).transition().attr('stroke', '#F1F1F1')
        }
        
    })

    function updateBars(upDate){
        barDate = upDate
        barScores = scores.filter(d => d['date'] == barDate)
        barScores = barScores.sort((a, b) => d3.ascending(a.value, b.value))

        // Update the domains for the bar charts
        barX.domain([0, d3.max(barScores, d => d.value)])
        barY.domain(barScores.map(d => popStyle[d.description].label))

        svg.selectAll('.mpbar')
            .remove()
            .exit()
            .data(barScores)
            .enter()
            .append('rect')
            .attr('class', 'mpbar')
            .attr("y", d => barY(popStyle[d.description].label))
            .attr("x", d => chartWidth + 10)
            .attr("height", barY.bandwidth())
            .attr("width", d => barX(d.value))
            .style("opacity", function(d){
                if (d.description == 'pop_total'){
                    return 1.0;
                }
                else{
                    return 0.5;
                }
            })
            .attr("fill", d => popStyle[d.description].color)
            

        svg.selectAll(".mpbarText")
            .remove()
            .exit()
            .data(barScores)
            .enter()
            .append("text")
            .attr('class', 'mpbarText')
            .attr("x", d => chartWidth + 14)
            .attr('y', d => barY(popStyle[d.description].label) + barY.bandwidth()/2)
            .text(d => popStyle[d.description].label + " (" + styleNumbers(d.value) + ")")
            .attr('text-anchor', 'left')
            .attr("dy", ".35em")
            .attr("font-size", "0.8em")
            // .style('font-weight', function(d){
            //     if (d.description == 'pop_total'){
            //         return 'bold';
            //     }
            //     else{
            //         return 'normal';
            //     }
            // })
            .style('fill', function(d){
                if (d.description == 'pop_total'){
                    return 'white';
                }
                else{
                    return 'black';
                }
            })
        
        svg.selectAll(".stickText")
        .transition()
            .style('font-weight', function(d){
                if (d == barDate){
                    return 'bold'
                }
                else{
                    return 'normal'
                }
            })
        
        svg.selectAll('.theStick')
        .transition()
            .attr("stroke", function(d){
                if (d == barDate){
                    return '#BEBEBE'
                }
                else{
                    return "#F1F1F1"
                }
            })

        svg.select('.barDateLabel')
            .text("Breakdown for " + moment(barDate).format('MMM D, YYYY'))
    }
}

function barChart(box, svg, scores, date, id, margin, groups, ylabel, note){
    var boxWidth = d3.select(id).node().getBoundingClientRect().width
    var boxHeight = d3.select(id).node().getBoundingClientRect().height
    var chartWidth = boxWidth - margin.left - margin.right
    var chartHeight = boxHeight - margin.top - margin.bottom

    box.attr('width', boxWidth).attr('height', boxHeight);
    svg.selectAll('*').remove();

    // var scores = chartData.filter(d => (d['score_key'] == score) & (d['zone'] == zone))
    var toPlot = scores.filter(d => groups.includes(d.description))
    
    toPlot = toPlot.sort((a, b) => d3.descending(a.value, b.value))
    // var toPlot = chartData.filter(d => (d['description'] == key));

    var x = d3.scaleBand()
        .domain(toPlot.map(d => popStyle[d.description].label))
        .range([margin.left, chartWidth])
        .padding(0.2);  

    if (id == '#jobs-fare-series'){
        var y = d3.scaleLinear()
        .domain([0, 100])
        .range([chartHeight, 0])
    }
    else{
        var y = d3.scaleLinear()
        .domain([0, d3.max(toPlot, d => d.value)])
        .range([chartHeight, 0])
    }
    

    svg.append("g")
        .attr("transform", "translate(0," + chartHeight + ")")
        .call(d3.axisBottom(x))
        .selectAll('text')
        // .attr("transform", "translate(-10,0)")
        .style("text-anchor", "middle");
    
    // svg.append("g")
    //     .attr("transform", "translate(" + margin.left + ", 0)")
    //     .call(d3.axisLeft(y));
    
    svg.selectAll('bars')
        .data(toPlot)
        .enter()
        .append('rect')
        .attr("x", d => x(popStyle[d.description].label))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => chartHeight - y(d.value))
        .attr("fill", d => popStyle[d.description].color)
        .attr('stroke', function(d){
            if (d.description == 'pop_total'){
                return '5px solid black';
            }
            else{
                return 'none';
            }
        })
        .attr('opacity', function(d){
            if (d.description == 'pop_total'){
                return 1.0;
            }
            else{
                return 0.5;
            }
        })

    svg.append('text')
        .attr("x", margin.left)
        .attr('y', 20 - margin.top)
        .text(ylabel)
        .attr('text-anchor', 'start')
        .attr('font-weight', 'bold')

    // svg.append("text")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 0 - margin.left)
    //     .attr("x",0 - (chartHeight / 2))
    //     .attr("dy", "1em")
    //     .style("text-anchor", "middle")
    //     .text(ylabel);

    svg.selectAll("stickLabel")
        .data(toPlot)
        .enter()
        .append("text")
        .attr("x", d => x(popStyle[d.description].label) + x.bandwidth()/2)
        .attr('y', d => y(d.value) - 10)
        .text(d => styleNumbers(d.value))
        .style('font-weight', function(d){
            if (d.description == 'pop_total'){
                return 'bold';
            }
            else{
                return 'normal';
            }
        })
        .attr('text-anchor', 'middle')
        .attr("dy", ".35em")
        .attr("font-size", "0.8em")

    // Add note text
    svg.append("text")
        .attr("x", chartWidth)
        .attr('y', chartHeight + margin.bottom)
        .attr("dy", "-.75em")
        .text(note)
        .attr('text-anchor', 'end')
        .attr("font-size", "0.7em")
}

function groupedBarChart(box, svg, scores, id, margin, groups, subgroups, ylabel, note){
    var boxWidth = d3.select(id).node().getBoundingClientRect().width
    var boxHeight = d3.select(id).node().getBoundingClientRect().height
    var chartWidth = boxWidth - margin.left - margin.right
    var chartHeight = boxHeight - margin.top - margin.bottom

    box.attr('width', boxWidth).attr('height', boxHeight);
    svg.selectAll('*').remove();

    // var toPlot = chartData.filter(d => (d['description'] == key));

    var x = d3.scaleBand()
        .domain(groups.map(d => carLabels[d]))
        .range([margin.left, chartWidth])
        .padding(0.2);  

    var y = d3.scaleLinear()
        .domain([0, d3.max(scores, d => d.value)])
        .range([chartHeight, 0])

    var xSub = d3.scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .padding(0.05)

    var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#f58426', 'purple'])

    svg.selectAll('bars')
        .data(scores)
        .enter()
        .append('rect')
        .attr("x", d => x(carLabels[d.description]) + xSub(d.subgroup))
        .attr('y', d => y(d.value))
        .attr("width", xSub.bandwidth())
        .attr("height", d => chartHeight - y(d.value))
        .attr("fill", d => color(d.subgroup))
        .attr('opacity', 0.7)

    svg.selectAll("barLabel")
        .data(scores)
        .enter()
        .append("text")
        .attr("x", d => x(carLabels[d.description]) + xSub(d.subgroup) + xSub.bandwidth()/2)
        .attr('y', d => y(d.value) - 6)
        .text(d => d.value.toFixed(0) + " min")
        .attr('text-anchor', 'middle')
        .attr("font-size", "0.8em")

    svg.append("g")
        .attr("transform", "translate(0," + chartHeight + ")")
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style("text-anchor", "middle");

    svg.append("text")
        .attr("x", chartWidth)
        .attr('y', chartHeight + margin.bottom)
        .attr("dy", "-.75em")
        .text(note)
        .attr('text-anchor', 'end')
        .attr("font-size", "0.7em")

    // Now a legend
    svg.selectAll('legendText')
        .data(subgroups)
        .enter()
        .append("text")
        .attr("x", margin.left + 20)
        .attr('y', d => 35 - margin.top + 15*subgroups.indexOf(d))
        .text(d => subgroupLabels[d])
        .attr('text-anchor', 'start')
        .attr('dominant-baseline', 'middle')
        .attr("font-size", "0.8em")

    svg.selectAll('legendBox')
        .data(subgroups)
        .enter()
        .append('rect')
        .attr('x', margin.left)
        .attr('y', d => 30 - margin.top + 15*(subgroups.indexOf(d)))
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', d => color(d))
        .attr('opacity', 0.7)

    svg.append('text')
        .attr("x", margin.left)
        .attr('y', 20 - margin.top)
        .text(ylabel)
        .attr('text-anchor', 'start')
        .attr('font-weight', 'bold')
}

function populateDates(){
    var startDateList = document.getElementById('start-date')
    var endDateList = document.getElementById('end-date')

    // Clear out what's there

    var x = startDateList.options.length - 1;
    for(i = x; i >= 0; i--) {
        startDateList.remove(i);
    }
    var x = endDateList.options.length - 1;
    for(i = x; i >= 0; i--) {
        endDateList.remove(i);
    }

    d3.json("/data/dates/" + view['name'])
        .then(function(data){
            // Rebuild it
            x = data.length
            for(i=0; i < x; i++){
                startDateList.options[i] = new Option(moment(data[i]).format("MMMM Do, YYYY"), moment(data[i]).valueOf())
                endDateList.options[i] = new Option(moment(data[i]).format("MMMM Do, YYYY"), moment(data[i]).valueOf())
            }

            startDateList.options[startDateList.options.length-1].selected = true;
            startDateList.options[0].disabled = true;
            endDateList.options[0].selected = true;
            endDateList.options[endDateList.options.length-1].disabled=true;
    });
}

function startDateChanged(){
    var startDateList = document.getElementById('start-date')
    var endDateList = document.getElementById('end-date')

    var startIndex = startDateList.selectedIndex
    var x = endDateList.options.length
    for (i=0; i<x; i++){
        if (i >= startIndex){
            endDateList.options[i].disabled = true;
        }
        else{
            endDateList.options[i].disabled = false;
        }
    }
}

/**
 * Helper function to compute the contiguous segments of the data
 * 
 * Derived from https://github.com/pbeshai/d3-line-chunked/blob/master/src/lineChunked.js
 * 
 * @param {Array} lineData the line data
 * @param {Function} defined function that takes a data point and returns true if
 *    it is defined, false otherwise
 * @param {Function} isNext function that takes the previous data point and the
 *    current one and returns true if the current point is the expected one to
 *    follow the previous, false otherwise.
 * @return {Array} An array of segments (subarrays) of the line data
 */
 function computeSegments(lineData, defined, isNext) {
    defined = defined || function (d) { return true; };
    isNext = isNext || function (prev, curr) { return true; };
    var startNewSegment = true;
  
    // split into segments of continuous data
    var segments = lineData.reduce(function (segments, d) {
      // skip if this point has no data
      if (!defined(d)) {
        startNewSegment = true;
        return segments;
      }
  
      // if we are starting a new segment, start it with this point
      if (startNewSegment) {
        segments.push([d]);
        startNewSegment = false;
  
      // otherwise see if we are adding to the last segment
      } else {
        var lastSegment = segments[segments.length - 1];
        var lastDatum = lastSegment[lastSegment.length - 1];
        // if we expect this point to come next, add it to the segment
        if (isNext(lastDatum, d)) {
          lastSegment.push(d);
  
        // otherwise create a new segment
        } else {
          segments.push([d]);
        }
      }
  
      return segments;
    }, []);
  
    return segments;
  }