// ======== 3.3. LEGEND ====

function clearLegend(){
  legendSvg.selectAll("*").remove();
}
  
function setLegendBins(bins, title, is_ratio){
  clearLegend();
  if (is_ratio == true){
    var title_buffer = 38;
  }
  else{
    var title_buffer = 30;
  }
  legendSvg.selectAll("legendCircles")
    .data(bins)
    .enter()
    .append('circle')
    .attr('cx', legendMargin.left)
    .attr('cy', function(d, i){return legendMargin.top + title_buffer + i*20})
    .attr('r', 6)
    .style('fill', d => d.color)
    .style('opacity', 0.7)
    .style('stroke', 'black')
  
  legendSvg.selectAll("legendLabels")
    .data(bins)
    .enter()
    .append('text')
    .attr('x', legendMargin.left + 15)
    .attr('y', function(d, i){return legendMargin.top + title_buffer + i*20})
    .style('fill', 'black')
    .text(d => d.label)
    .attr('text-anchor', 'left')
    .style('alignment-baseline', 'middle')
  
  legendSvg.append('text')
    .attr('x', legendMargin.left)
    .attr('y', legendMargin.top)
    .text(title)
    .attr('text-anchor', 'left')
    .style('font-size', '1.2em')
    .style('font-weight', 'bold')
    .style('padding-top', '5px')

  if (is_ratio ==  true){
    legendSvg.append('text')
      .attr('x', legendMargin.left)
      .attr('y', legendMargin.top + 18)
      .text("Transit:Auto Ratio")
      .attr('text-anchor', 'left')
      .style('font-size', '1em')
      .style('font-style', 'italic')
      .style('padding-top', '5px')
  }
}