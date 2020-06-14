// set the dimensions and margins of the graph
var width = 150
    height = 150
    margin = 10

// Create dummy data
var baseline = 75
var current = 70
var deltaColor = 'green'
if (current > baseline){
    var data = {a: baseline, b: current - baseline,  c: 100-current}
    var colorSet = ["#2d74ed", "#4c7a34", "#FFFFFF"]
}
else {
    var data = {a: current, b: baseline - current, c: 100-baseline}
    var colorSet = ["#2d74ed", "#a01212", "#FFFFFF"]
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
var color = d3.scaleOrdinal()
    .domain(data)
    .range(colorSet)

// Compute the position of each group on the pie:
var pie = d3.pie()
    .value(function(d) {return d.value; }).sort(null);
var data_ready = pie(d3.entries(data))


// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
accessSvg
    .selectAll('pie')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', d3.arc()
    .innerRadius(innerRadius)         // This is the size of the donut hole
    .outerRadius(radius)
    )
    .attr('fill', function(d){ return(color(d.data.key)) })
    .style("opacity", 0.7)

// Add the score label
accessSvg
    .append("text")
    .attr("x", d => {width/2})
    .attr("y", d => {height/2})
    .style('text-anchor', 'middle')
    .attr("class", "access-score")
    .text(current)

Add the reference label
accessSvg
    .append("text")
    .attr("x", d=> {width/2})
    .attr("y", d=> {height})
    .style('text-anchor', 'middle')
    .attr("class", "access-label")
    .text("of 100")
