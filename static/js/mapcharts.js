/**
* Creates a histogram in the bottom chart panel
* @param {Array} data Array of values to chart
* @param {Number} bins The number of bins for the histogram
* @param {String} xlabel The label for the x-axis
* @param {String} ylabel The label for the y-axis
*/
function histogramPlot(data, bins, xlabel, ylabel){
    plotSvg.selectAll("*").remove();
  
    var plotData = []
  
    // Gotta load the population data from the API
    $.getJSON("data/pop/" + state['tag'] + "/pop_total", function(dta) {
      $.each( dta, function( key, val ) {
        plotData.push(
          {
            'id': parseInt(val['block_group']['id']),
            'score': data[parseInt(val['block_group']['id'])], 
            'pop' : parseFloat(val['value'])
          }
        )         
        });
    }).done( function (dta) {
  
      // Remove some undefined
      plotData.forEach(d => {
        if (d['score'] === undefined) {
          delete d
        }
      });
  
      // Create the x range
      var x = d3.scaleLinear()
        .domain(d3.extent(plotData, d => d.score))
        .rangeRound([plotMargin.left, 300-plotMargin.right]);
  
      // Use the histogram function to get some bins
      var histogram = d3.histogram()
      .value(d => d.score)
      .domain(x.domain())
      .thresholds(x.ticks(bins));
  
      // Group the data for the bars
      var histBins = histogram(plotData);
      histBins.forEach(h =>{
          h.totPop = 0
      });
      // Now we go through and sum the total population in each bin
      plotData.forEach(d => {
        histBins.forEach(h =>{
          if ((d.score > h.x0) & (d.score <= h.x1)){
            h.totPop += parseInt(d.pop)
          }
        })
      })
  
      // Create breaks for jenks scaling and colors
      jenksData = Array.from(plotData, d => d.score)
      jenksData = jenksData.filter(Boolean).sort(d3.ascending)
      breaks = jenks(jenksData, 6)
  
      // Create the y range
      var y = d3.scaleLinear()
        .range([300-plotMargin.bottom, plotMargin.top]);
  
      // Scale the range of the data in the y domain
      y.domain([0, d3.max(histBins, h => h.totPop)]);
      // Append the bar rectangles to the svg element
  
      console.log(histBins)

      plotSvg.selectAll("rect")
        .data(histBins)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", 1)
        .attr("transform", function(d) {
          return "translate(" + x(d.x0) + "," + y(d.totPop) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
        .attr("height", function(d) { return (300 - plotMargin.bottom) - y(d.totPop); })
        .style('fill', function(d) {
          return getSevenBreaksColor(d.x0, breaks, YlGnBu7)
        });
  
      // Add the x-axis
      plotSvg.append("g")
        .attr("transform", "translate(0," + (300-plotMargin.bottom) + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("y", 6)
        .attr("x", 7)
        .attr("dy", ".35em")
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start");
  
      // Add the y-axis
      plotSvg.append("g")
        .attr("transform", "translate(" + plotMargin.left + ",0)")
        .call(d3.axisLeft(y));
  
      // Label the x-axis
      plotSvg.append("text")             
        // .attr("transform", getXLabelBuffer(d3.max(histBins, h => h.x1)))
        .attr("transform", "translate(" + (300 + plotMargin.left)/2 + ", 300)")
        .style("text-anchor", "middle")
        .style('font-weight', 'bold')
        .text(xlabel);
  
      // Label the y-axis
      plotSvg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", 0-((300-plotMargin.top - plotMargin.bottom)/2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style('font-weight', 'bold')
        .text(ylabel);
  
    });
  }

  /**
* Creates a scatter plot in the bottom chart panel
* @param {Array} data Array of values to chart
* @param {String} xlabel The label for the x-axis
* @param {String} ylabel The label for the y-axis
*/
function scatterPlot(data, xlabel, ylabel){
    plotSvg.selectAll("*").remove();
  
    // Get some breaks for color
    var jenksData = Array.from(data, d => d.x)
    jenksData = jenksData.filter(Boolean)
    breaks = jenks(jenksData, 6)
  
    // Add X axis
    var x = d3.scaleLinear()
      .domain(d3.extent(data, function(d) {return d.x}))
      .rangeRound([plotMargin.left, 300-plotMargin.right]);
  
    plotSvg.append("g")
    .attr("transform", "translate(0," + (300-plotMargin.bottom) + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("y", 6)
    .attr("x", 7)
    .attr("dy", ".35em")
    .attr("transform", "rotate(45)")
    .style("text-anchor", "start");
  
    // Add Y axis
    var y = d3.scaleLinear()
      .domain(d3.extent(data, function(d) {return d.y}))
      .range([300-plotMargin.bottom, plotMargin.top]);
  
    plotSvg.append("g")
      .attr("transform", "translate(" + plotMargin.left + ",0)")
      .call(d3.axisLeft(y));
  
    // Add dots
    plotSvg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) { return x(d.x); } )
      .attr("cy", function (d) { return y(d.y); } )
      .attr("r", 1.5)
      .style('fill', function(d) {
        return getSevenBreaksColor(d.x, breaks, YlGnBu7)
      })
      .style("opacity", 0.7)
  
    // Label the x-label
    plotSvg.append("text")             
      .attr("transform", "translate(" + (300 + plotMargin.left)/2 + ", 300)")
      .style("text-anchor", "middle")
      .style('font-weight', 'bold')
      .text(xlabel);
  
    // Label the y-axis
    plotSvg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x", 0-((300-plotMargin.top - plotMargin.bottom)/2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style('font-weight', 'bold')
      .text(ylabel);
  }