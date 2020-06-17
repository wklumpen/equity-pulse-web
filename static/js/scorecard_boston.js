// set the dimensions and margins of the graph
var width = 150
    height = 150
    margin = 10

// Create dummy data
var accessBaseline = 75
var accessCurrent = 70

var equityBaseline = 40
var equityCurrent = 20

if (accessCurrent > accessBaseline){
    var accessData = {a: accessBaseline, b: accessCurrent - accessBaseline,  c: 100-accessCurrent}
    var accessColorSet = ["#2d74ed", "#4c7a34", "#CDCDCD"]
}
else {
    var accessData = {a: accessCurrent, b: accessBaseline - accessCurrent, c: 100-accessBaseline}
    var accessColorSet = ["#2d74ed", "#a01212", "#CDCDCD"]
}

if (equityCurrent > equityBaseline){
    var equityData = {a: equityBaseline, b: equityCurrent - equityBaseline,  c: 100-equityCurrent}
    var equityColorSet = ["#2d74ed", "#4c7a34", "#CDCDCD"]
}
else {
    var equityData = {a: equityCurrent, b: equityBaseline - equityCurrent, c: 100-equityBaseline}
    var equityColorSet = ["#2d74ed", "#a01212", "#CDCDCD"]
}

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) / 2 - margin
var innerRadius = radius - 20;

// append the svg object to the div
var accessSvg = d3.select("#boston-access")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", 'center-chart')
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// set the color scale
var accessColor = d3.scaleOrdinal()
    .domain(accessData)
    .range(accessColorSet)

var equityColor = d3.scaleOrdinal()
    .domain(equityData)
    .range(equityColorSet)

// Compute the position of each group on the pie:
var pie = d3.pie()
    .value(function(d) {return d.value; }).sort(null);

// Process data into pies
var accessDataReady = pie(d3.entries(accessData))
var equityDataReady = pie(d3.entries(equityData))


// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
accessSvg
    .selectAll('pie')
    .data(accessDataReady)
    .enter()
    .append('path')
    .attr('d', d3.arc()
    .innerRadius(innerRadius)         // This is the size of the donut hole
    .outerRadius(radius)
    )
    .attr('fill', function(d){ return(accessColor(d.data.key)) })
    .style("opacity", 0.7)

// Add the score label
accessSvg
    .append("text")
    .attr("x", d => {width/2})
    .attr("y", d => {height/2})
    .style('text-anchor', 'middle')
    .attr("class", "access-score")
    .text(accessCurrent)

// Add the reference label
accessSvg
    .append("text")
    .attr("x", d=> {width/2})
    .attr("y", d=> {height})
    .style('text-anchor', 'middle')
    .attr("class", "access-label")
    .text("of 100")
    .attr("transform", "translate(0," + (20) + ")");

var equitySVG = d3.select("#boston-equity")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", 'center-chart')
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

equitySVG
    .selectAll('pie')
    .data(equityDataReady)
    .enter()
    .append('path')
    .attr('d', d3.arc()
    .innerRadius(innerRadius)         // This is the size of the donut hole
    .outerRadius(radius)
    )
    .attr('fill', function(d){ return(equityColor(d.data.key)) })
    .style("opacity", 0.7)

