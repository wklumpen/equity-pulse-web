
var chartData = []
var coronaData = []

var coronaMargin = {top: 20, right: 60, bottom: 40, left: 30}
var coronaBoxWidth = d3.select("#corona").node().getBoundingClientRect().width
var coronaBoxHeight = d3.select("#corona").node().getBoundingClientRect().height
var coronaChartWidth = coronaBoxWidth - coronaMargin.left - coronaMargin.right
var coronaChartHeight = coronaBoxHeight - coronaMargin.top - coronaMargin.bottom

var coronaBox = d3.select("#corona").append('svg').attr('width', coronaBoxWidth).attr('height', coronaBoxHeight)
var coronaSVG = coronaBox.append('g').attr("transform", "translate(" + coronaMargin.left + "," + coronaMargin.top + ")");

// jobs-access-groups-date chart shows access on a single date
var jobsAccessGroupsDateMargin = {top: 20, right: 20, bottom: 40, left: 40}
var jobsAccessGroupsDateBoxWidth = d3.select("#jobs-access-groups-date").node().getBoundingClientRect().width
var jobsAccessGroupsDateBoxHeight = d3.select("#jobs-access-groups-date").node().getBoundingClientRect().height
var jobsAccessGroupsDateChartWidth = jobsAccessGroupsDateBoxWidth - jobsAccessGroupsDateMargin.left - jobsAccessGroupsDateMargin.right
var jobsAccessGroupsDateChartHeight = jobsAccessGroupsDateBoxHeight - jobsAccessGroupsDateMargin.top - jobsAccessGroupsDateMargin.bottom

// jobs-access-series shows a time series of job access
var jobsAccessSeriesMargin = {top: 25, right: 120, bottom: 40, left: 40}
var jobsAccessSeriesBoxWidth = d3.select("#jobs-access-series").node().getBoundingClientRect().width
var jobsAccessSeriesBoxHeight = d3.select("#jobs-access-series").node().getBoundingClientRect().height
var jobsAccessSeriesChartWidth = jobsAccessSeriesBoxWidth - jobsAccessSeriesMargin.left - jobsAccessSeriesMargin.right
var jobsAccessSeriesChartHeight = jobsAccessSeriesBoxHeight - jobsAccessSeriesMargin.top - jobsAccessSeriesMargin.bottom

var storeAccessSeriesMargin = {top: 25, right: 120, bottom: 40, left: 40}
var storeAccessSeriesBoxWidth = d3.select("#store-access-series").node().getBoundingClientRect().width
var storeAccessSeriesBoxHeight = d3.select("#store-access-series").node().getBoundingClientRect().height
var storeAccessSeriesChartWidth = storeAccessSeriesBoxWidth - storeAccessSeriesMargin.left - storeAccessSeriesMargin.right
var storeAccessSeriesChartHeight = storeAccessSeriesBoxHeight - storeAccessSeriesMargin.top - storeAccessSeriesMargin.bottom

var jobsFaresSeriesMargin = {top: 25, right: 150, bottom: 40, left: 40}
var jobsFaresSeriesBoxWidth = d3.select("#jobs-fares-series").node().getBoundingClientRect().width
var jobsFaresSeriesBoxHeight = d3.select("#jobs-fares-series").node().getBoundingClientRect().height
var jobsFaresSeriesChartWidth = jobsFaresSeriesBoxWidth - jobsFaresSeriesMargin.left - jobsFaresSeriesMargin.right
var jobsFaresSeriesChartHeight = jobsFaresSeriesBoxHeight - jobsFaresSeriesMargin.top - jobsFaresSeriesMargin.bottom

var losSeriesMargin = {top: 25, right: 150, bottom: 40, left: 40}
var losSeriesBoxWidth = d3.select("#los-series").node().getBoundingClientRect().width
var losSeries = d3.select("#los-series").node().getBoundingClientRect().height
var losSeriesChartWidth = losSeriesBoxWidth - losSeriesMargin.left - losSeriesMargin.right
var losSeriesChartHeight = losSeries - losSeriesMargin.top - losSeriesMargin.bottom

var carJobsAccessSeriesMargin = {top: 25, right: 150, bottom: 40, left: 40}
var carJobsAccessSeriesBoxWidth = d3.select("#car-jobs-access-series").node().getBoundingClientRect().width
var carJobsAccessSeriesBoxHeight = d3.select("#car-jobs-access-series").node().getBoundingClientRect().height
var carJobsAccessSeriesChartWidth = carJobsAccessSeriesBoxWidth - carJobsAccessSeriesMargin.left - carJobsAccessSeriesMargin.right
var carJobsAccessSeriesChartHeight = carJobsAccessSeriesBoxHeight - carJobsAccessSeriesMargin.top - carJobsAccessSeriesMargin.bottom

var carLowWageJobsAccessSeriesMargin = {top: 25, right: 150, bottom: 40, left: 40}
var carLowWageJobsAccessSeriesBoxWidth = d3.select("#car-low-wage-jobs-access-series").node().getBoundingClientRect().width
var carLowWageJobsAccessSeriesBoxHeight = d3.select("#car-low-wage-jobs-access-series").node().getBoundingClientRect().height
var carLowWageJobsAccessSeriesChartWidth = carLowWageJobsAccessSeriesBoxWidth - carLowWageJobsAccessSeriesMargin.left - carLowWageJobsAccessSeriesMargin.right
var carLowWageJobsAccessSeriesChartHeight = carLowWageJobsAccessSeriesBoxHeight - carLowWageJobsAccessSeriesMargin.top - carLowWageJobsAccessSeriesMargin.bottom

var carHospitalTravelSeriesMargin = {top: 25, right: 150, bottom: 40, left: 40}
var carHospitalTravelSeriesBoxWidth = d3.select("#car-hospital-travel-series").node().getBoundingClientRect().width
var carHospitalTravelSeriesBoxHeight = d3.select("#car-hospital-travel-series").node().getBoundingClientRect().height
var carHospitalTravelSeriesChartWidth = carHospitalTravelSeriesBoxWidth - carHospitalTravelSeriesMargin.left - carHospitalTravelSeriesMargin.right
var carHospitalTravelSeriesChartHeight = carHospitalTravelSeriesBoxHeight - carHospitalTravelSeriesMargin.top - carHospitalTravelSeriesMargin.bottom

// Initialize the map boxes and the SVG elements for the charts
var jobsAccessGroupsDateBox = d3.select("#jobs-access-groups-date").append('svg').attr('width', jobsAccessGroupsDateBoxWidth).attr('height', jobsAccessGroupsDateBoxHeight)
var jobsAccessGroupsDateSVG = jobsAccessGroupsDateBox.append('g').attr("transform", "translate(" + jobsAccessGroupsDateMargin.left + "," + jobsAccessGroupsDateMargin.top + ")");
var jobsAccessSeriesBox = d3.select("#jobs-access-series").append('svg').attr('width', jobsAccessSeriesBoxWidth).attr('height', jobsAccessSeriesBoxHeight)
var jobsAccessSeriesSVG = jobsAccessSeriesBox.append('g').attr("transform", "translate(" + jobsAccessSeriesMargin.left + "," + jobsAccessSeriesMargin.top + ")");
var storeAccessSeriesBox = d3.select("#store-access-series").append('svg').attr('width', storeAccessSeriesBoxWidth).attr('height', storeAccessSeriesBoxHeight)
var storeAccessSeriesSVG = storeAccessSeriesBox.append('g').attr("transform", "translate(" + storeAccessSeriesMargin.left + "," + storeAccessSeriesMargin.top + ")");
var jobsFaresSereiesBox = d3.select("#jobs-fares-series").append('svg').attr('width', jobsFaresSeriesBoxWidth).attr('height', jobsFaresSeriesBoxHeight)
var jobsFaresSeriesSVG = jobsFaresSereiesBox.append('g').attr("transform", "translate(" + jobsFaresSeriesMargin.left + "," + jobsFaresSeriesMargin.top + ")");
var losSeriesBox = d3.select("#los-series").append('svg').attr('width', losSeriesBoxWidth).attr('height', losSeries)
var losSeriesSVG = losSeriesBox.append('g').attr("transform", "translate(" + losSeriesMargin.left + "," + losSeriesMargin.top + ")");
var carJobsAccessSeriesBox = d3.select("#car-jobs-access-series").append('svg').attr('width', carJobsAccessSeriesBoxWidth).attr('height', carJobsAccessSeriesBoxHeight)
var carJobsAccessSeriesSVG = carJobsAccessSeriesBox.append('g').attr("transform", "translate(" + carJobsAccessSeriesMargin.left + "," + carJobsAccessSeriesMargin.top + ")");
var carLowWageJobsAccessSeriesBox = d3.select("#car-low-wage-jobs-access-series").append('svg').attr('width', carLowWageJobsAccessSeriesBoxWidth).attr('height', carLowWageJobsAccessSeriesBoxHeight)
var carLowWageJobsAccessSeriesSVG = carLowWageJobsAccessSeriesBox.append('g').attr("transform", "translate(" + carLowWageJobsAccessSeriesMargin.left + "," + carLowWageJobsAccessSeriesMargin.top + ")");
var carHospitalTravelSeriesBox = d3.select("#car-hospital-travel-series").append('svg').attr('width', carHospitalTravelSeriesBoxWidth).attr('height', carHospitalTravelSeriesBoxHeight)
var carHospitalTravelSeriesSVG = carHospitalTravelSeriesBox.append('g').attr("transform", "translate(" + carHospitalTravelSeriesMargin.left + "," + carHospitalTravelSeriesMargin.top + ")");

d3.select(window).on('resize', handleResize);

loadCoronaData();
handleResize();

function loadCoronaData(){
    d3.csv("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv")
    .then(function(data){
        console.log("Loaded Corona Data");
        // First we filter down to the one region
        if (view['name'] == 'nyc'){
            counties = ['New York', 'Kings', 'Queens', 'Bronx', 'Richmond']
            d = data.filter(d => (counties.includes(d['Admin2']) & d['Province_State'] == view['state']));
        }
        else{
            d = data.filter(d => (d['Admin2'] == view['county'] & d['Province_State'] == view['state']));
        }
        
        coronaData = []

        $.each(d[0], function(key, val){
            if (moment(key, "M/D/YY", true).isValid()){
                if (val > 1){
                    coronaData.push({"date":moment(key, "MM/DD/YY").valueOf(), "cases": +val})
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

function loadChartData(){
    console.log("/data/summary/"+ view['name'])
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
        .call(d3.axisLeft(y).ticks(2));


    if (coronaBoxWidth < 600){
        coronaSVG.append("g")
            .attr("transform", "translate(0," + coronaChartHeight + ")")
            .call(d3.axisBottom(x).ticks(2).tickFormat(d3.timeFormat("%b %Y")));
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
                            return Math.round(hoverData.new) + " new cases"
                        }
                        else{
                            return Math.round(hoverData.new) + " new case"
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

    var maxDate = d3.max(chartData, d => d['date'])
    // == Get job access and add in fare capped data ==
    var scores = chartData.filter(d => (d['score_key'] == 'C000_P_c30_AM_autoN_fareN') & (d['zone'] == view['name']+'-urban'))
    var everyoneFares = chartData.filter(d => (d['score_key'] == 'C000_P_c30_AM_autoN_fareN') & (d['zone'] == view['name']+'-urban') & (d['description'] == 'pop_total'))
    everyoneFares.forEach(function(item, index){
        scores.push({
            'date':item.date, 
            'description': 
            'everyone_fares', 
            'zone': view['name'] + '-urban', 
            'value': item.value, 
            'score_key': 'C000_P_c30_AM_autoN_fareN'
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
        'everyone_fares'
    ]

    barChart(
        jobsAccessGroupsDateBox, 
        jobsAccessGroupsDateSVG, 
        scores.filter(d => d['date'] == maxDate),
        maxDate,
        '#jobs-access-groups-date', 
        jobsAccessGroupsDateMargin, 
        groups, 
        'Jobs Accessible in 30 minutes',
        'Data for weekdays 7am-9am in the Urban Core of ' + view['title']
    )

    // == Time series job access ==
    multilinePlot(
        jobsAccessSeriesBox, 
        jobsAccessSeriesSVG, 
        scores, 
        '#jobs-access-series', 
        jobsAccessSeriesMargin, 
        groups, 
        'Jobs Accessible in 30 min', 
        'Weekday morning peak in the Urban Core as of ' + moment.utc(maxDate).format('MMMM D, YYYY') + '.'
    )

    // == Time series SNAP store access ==
    scores = chartData.filter(d => (d['score_key'] == 'snap_M_t3_AM_autoN_fareN') & (d['zone'] == view['name']+'-msa'))
    multilinePlot(
        storeAccessSeriesBox, 
        storeAccessSeriesSVG, 
        scores, 
        '#store-access-series', 
        storeAccessSeriesMargin, 
        econGroups, 
        'Average Travel Time (min)', 
        'Weekday morning peak in the Urban Core as of ' + moment.utc(maxDate).format('MMMM D, YYYY') + '.'
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
    groups.forEach(function(key, index){
        var subset = scores.filter(d => d['description'] == key)
        // Now we get some dates
        var plotDates = []
        subset.forEach(function(dateKey, index){
            if (!plotDates.includes(dateKey.date)){
                plotDates.push(dateKey.date)
            }
        })
        plotDates.forEach(function(dateKey, index){
            var withFare = subset.filter(d => (d['date'] == dateKey) & (d.score_key == 'C000_P_c30_AM_autoN_fareY'))[0].value
            var withoutFare = subset.filter(d => (d['date'] == dateKey) & (d.score_key == 'C000_P_c30_AM_autoN_fareN'))[0].value
            var newValue = 100*((withoutFare/withFare) - 1)

            var ratio = subset.filter(d => (d['date'] == dateKey) & (d.score_key == 'C000_P_c30_AM_autoY_fareN'))[0].value
            var newAuto = 100*((1/ratio)-1)
            // One more time for low income jobs
            ratio = subset.filter(d => (d['date'] == dateKey) & (d.score_key == 'CE01_P_c30_AM_autoY_fareN'))[0].value
            var newAutoLow = 100*((1/ratio)-1)

            fareCompare.push({'date': dateKey, 'description': key, 'score_key':'extra_jobs_premium', 'value': newValue, 'zone': view['name']+'-msa'})
            autoCompareJobs.push({'date': dateKey, 'description': key, 'score_key':'extra_jobs_auto', 'value': newAuto, 'zone': view['name']+'-msa'})
            autoCompareLow.push({'date': dateKey, 'description': key, 'score_key':'extra_jobs_auto_low', 'value': newAutoLow, 'zone': view['name']+'-msa'})
        })
    })

    // == Time series comparison between fare capped and non-capped
    multilinePlot(
        jobsFaresSereiesBox, 
        jobsFaresSeriesSVG, 
        fareCompare, 
        '#jobs-fares-series', 
        jobsFaresSeriesMargin, 
        groups, 
        '% Additional Jobs Reachable Without Fare Cap', 
        'Weekday morning peak in the MSA as of ' + moment.utc(maxDate).format('MMMM D, YYYY') + '.'
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
        '#los-series', 
        losSeriesMargin, 
        groups, 
        'Average Trips/Week', 
        'Weekday morning peak in the Urban Core as of ' + moment.utc(maxDate).format('MMMM D, YYYY') + '.'
    )
    
    // == Time series comparison of car and auto
    multilinePlot(
        carJobsAccessSeriesBox, 
        carJobsAccessSeriesSVG, 
        autoCompareJobs, 
        '#car-jobs-access-series', 
        carJobsAccessSeriesMargin, 
        ['pop_total', 'pop_poverty'], 
        'Additional Jobs Reachable by Car (%)', 
        'Weekday morning peak in the MSA as of ' + moment.utc(maxDate).format('MMMM D, YYYY') + '.'
    )
    multilinePlot(
        carLowWageJobsAccessSeriesBox, 
        carLowWageJobsAccessSeriesSVG, 
        autoCompareLow, 
        '#car-low-wage-jobs-access-series', 
        carLowWageJobsAccessSeriesMargin, 
        ['pop_total', 'pop_poverty'], 
        'Additional Low-Income Jobs Reachable by Car (%)', 
        'Weekday morning peak in the MSA as of ' + moment.utc(maxDate).format('MMMM D, YYYY') + '.'
    )
    var scores = chartData.filter(d => (d['score_key'] == 'hospitals_M_t1_AM_autoY_fareN') & (d['zone'] == view['name']+'-msa'))
    multilinePlot(
        carHospitalTravelSeriesBox, 
        carHospitalTravelSeriesSVG, 
        scores, 
        '#car-hospital-travel-series', 
        carHospitalTravelSeriesMargin, 
        ['pop_total', 'pop_poverty'], 
        'Transit/Auto Travel Time Ratio', 
        'Weekday morning peak in the MSA as of ' + moment.utc(maxDate).format('MMMM D, YYYY') + '.' 
    )
}

function multilinePlot(box, svg, scores, id, margin, groups, ylabel, note){
    var boxWidth = d3.select(id).node().getBoundingClientRect().width
    var boxHeight = d3.select(id).node().getBoundingClientRect().height
    var chartWidth = boxWidth - margin.left - margin.right
    var chartHeight = boxHeight - margin.top - margin.bottom


    box.attr('width', boxWidth).attr('height', boxHeight);
    svg.selectAll('*').remove();

    scores.sort((a,b) => d3.ascending(a.date, b.date))
    // console.log(scores)

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
    svg.selectAll("stick")
        .data(dateList)
        .enter()
        .append("line")
        .attr("x1", d => x(d))
        .attr("x2", d => x(d))
        .attr("y1", 0)
        .attr("y2", chartHeight)
        .attr("stroke", "#F1F1F1")
        .style('stroke-width', '5px')
    
    svg.selectAll("stickLabel")
        .data(dateList)
        .enter()
        .append("text")
        .attr("x", d => x(d))
        .attr('y', -18)
        .attr("dy", "-.75em")
        .text(d => moment(d).format('MMM D'))
        .attr('text-anchor', 'middle')
        .attr("dy", ".35em")
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
            .style('stroke-width', 3)

        svg.append('text')
            .attr("x", x(d3.max(toPlot, d => d.date)) + 5)
            .attr('y', y(toPlot[toPlot.length - 1].value))
            .attr("dy", "-.75em")
            .text(item.label + " (" + styleNumbers(toPlot[toPlot.length - 1].value) + ")")
            .attr('text-anchor', 'start')
            .attr("dy", ".35em")
            .attr("font-size", "0.8em")
            .style('font-weight', 'bold')

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

    var y = d3.scaleLinear()
        .domain([0, d3.max(toPlot, d => d.value)])
        .range([chartHeight, 0])

    svg.append("g")
        .attr("transform", "translate(0," + chartHeight + ")")
        .call(d3.axisBottom(x))
        .selectAll('text')
        // .attr("transform", "translate(-10,0)")
        .style("text-anchor", "middle");
    
    svg.append("g")
        .attr("transform", "translate(" + margin.left + ", 0)")
        .call(d3.axisLeft(y));
    
    svg.selectAll('bars')
        .data(toPlot)
        .enter()
        .append('rect')
        .attr("x", d => x(popStyle[d.description].label))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => chartHeight - y(d.value))
        .attr("fill", d => popStyle[d.description].color)

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (chartHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(ylabel);

    svg.selectAll("stickLabel")
        .data(toPlot)
        .enter()
        .append("text")
        .attr("x", d => x(popStyle[d.description].label) + x.bandwidth()/2)
        .attr('y', d => y(d.value) - 10)
        .text(d => styleNumbers(d.value))
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

    console.log("/data/dates/" + view['name'])
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
