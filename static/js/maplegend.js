// ======== 3.3. LEGEND ====

function clearLegend(){
    legendSvg.selectAll("*").remove();
  }
  
  function setLegendBins(bins, title){
    clearLegend();
    legendSvg.selectAll("legendCircles")
      .data(bins)
      .enter()
      .append('circle')
      .attr('cx', legendMargin.left)
      .attr('cy', function(d, i){return legendMargin.top + 20 + i*20})
      .attr('r', 6)
      .style('fill', d => d.color)
      .style('opacity', 0.7)
      .style('stroke', 'black')
    
    legendSvg.selectAll("legendLabels")
      .data(bins)
      .enter()
      .append('text')
      .attr('x', legendMargin.left + 20)
      .attr('y', function(d, i){return legendMargin.top + 20 + i*20})
      .style('fill', 'black')
      .text(d => d.label)
      .attr('text-anchor', 'left')
      .style('alignment-baseline', 'middle')
      .style('font-size', '1.1em')
    
    legendSvg.append('text')
      .attr('x', legendMargin.left)
      .attr('y', legendMargin.top)
      .text(title)
      .attr('text-anchor', 'left')
      .style('font-size', '1.6em')
      .style('padding-top', '5px')
  }