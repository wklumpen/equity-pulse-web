// ==== 3.4 STYLING ====

// Style function for the block groups
function bgStyleDefault(feature) {
    return {
      fillColor: 'none',
      weight: 1,
      opacity: 0.1,
      color: 'none',
      fillOpacity: 0.2
    };
  }
  
  // Style function for the overlay dots
  function dotStyle(feature) {
    return {
      radius: 8,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
  }
  
  // Default Placeholder Function (not currently used)
  function getColorPercent(d) {
    return  d > 80 ? "#edf8fb": 
            d > 60 ? "#b3cde3": 
            d > 40 ? "#8c96c6": 
            d > 20 ? "#8856a7" : 
            "#810f7c";
  }
  
  /**
   * Get a color scheme based on five equal ranges.
   * @param {*} d Value to colorize
   * @param {Number} min Minimum value in data range
   * @param {Number} max Maximum value in data range
   */
  function getFiveBinColor(d, min, max) {
    // Handle NAN Values
    if(isNaN(d)){
      return "#717678";
    }
    else {
      return  d > 4*(max-min)/5 + min ? "#810f7c": 
      d > 3*(max-min)/5 + min ? "#8856a7":
      d > 2*(max-min)/5 + min ? "#8c96c6": 
      d > 1*(max-min)/5 + min ? "#b3cde3": 
      "#edf8fb";
    }
  }
  
  /**
   * Get a color scheme based on five equal ranges. Note that the `data` array
   * passed to the function must have all NaN's removed and have been sorted,
   * ideally using d3.ascending.
   * @param {*} d Value to colorize
   * @param {Array} data Sorted, clean dataset to use for quartiles.
   */
  function getQuartileColor(d, data) {
    // Handle NAN Value label
    if(isNaN(d)){
      return "#717678";
    }
    else {
      return  d >= d3.quantile(data, 0.75) ? YlGnBu[1]: 
      d >= d3.quantile(data, 0.5) ? YlGnBu[2]:
      d >= d3.quantile(data, 0.25) ? YlGnBu[3]:
      YlGnBu[4];
    }
  }
  
  function getFiveJenksColor(d, breaks) {
    // Handle NAN Value label
    if(isNaN(d)){
      return "#717678";
    }
    else {
      return  d >= breaks[3] ? YlGnBu[0]: 
      d >= breaks[2] ? YlGnBu[1]:
      d >= breaks[1] ? YlGnBu[2]:
      d >= breaks[0] ? YlGnBu[3]:
      YlGnBu[4];
    }
  }
  
  function getSevenBreaksColor(d, breaks, colors, travel_time) {
    // Handle NAN Value label
    if(isNaN(d)){
      return nan_color;
    }
    else if(travel_time == true){
      if(d == -1.0){
        return colors[0] // Greater than 90; worst outcome
      }
      else {
        return  d >= breaks[5] ? colors[1]:
                d >= breaks[4] ? colors[2]:
                d >= breaks[3] ? colors[3]:
                d >= breaks[2] ? colors[4]:
                d >= breaks[1] ? colors[5]:
                colors[6];
      }
    }
    else{
      return  d >= breaks[5] ? colors[6]:
              d >= breaks[4] ? colors[5]:
              d >= breaks[3] ? colors[4]:
              d >= breaks[2] ? colors[3]:
              d >= breaks[1] ? colors[2]:
              colors[1];
    }
  }
  /**
   * Get color scheme labels on five equal ranges.
   * @param {Number} min Minimum value in data range
   * @param {Number} max Maximum value in data range
   */
  function getFiveBinLabels(min, max, unit){
    return [
      {'label': styleNumbers(min) + " to " + styleNumbers(min + (max-min)/5) + " " + unit, 'color': '#edf8fb'},
      {'label': styleNumbers(min + (max-min)/5) + " to " + styleNumbers(min + 2*(max-min)/5)+ " " + unit, 'color': '#b3cde3'},
      {'label': styleNumbers(min + 2*(max-min)/5) + " to " + styleNumbers(min + 3*(max-min)/5)+ " " + unit, 'color': '#8c96c6'},
      {'label': styleNumbers(min + 3*(max-min)/5) + " to " + styleNumbers(min + 4*(max-min)/5)+ " " + unit, 'color': '#8856a7'},
      {'label': styleNumbers(min + 4*(max-min)/5) + " to " + styleNumbers(max)+ " " + unit, 'color': '#810f7c'},
      {'label': "No data/outside region", 'color': '#717678'},
    ]
  }
  
  /**
   * Colour labels based on quartiles.
   * @param {Number} data Data to quartile.
   */
  function getQuartileLabels(data, unit){
    // Drop out the NaNs
    data = data.filter(Boolean)
    return [
      {'label': styleNumbers(d3.quantile(data, 0)) + " to " + styleNumbers(d3.quantile(data, 0.25)) + " " + unit, 'color': YlGnBu[4]},
      {'label': styleNumbers(d3.quantile(data, 0.25)) + " to " + styleNumbers(d3.quantile(data, 0.50))+ " " + unit, 'color': YlGnBu[3]},
      {'label': styleNumbers(d3.quantile(data, 0.50)) + " to " + styleNumbers(d3.quantile(data, 0.75))+ " " + unit, 'color': YlGnBu[2]},
      {'label': "More than " + styleNumbers(d3.quantile(data, 0.75)) + " " + unit, 'color': YlGnBu[1]},
      {'label': "No data", 'color': '#717678'},
    ]
  }
  
  function getSevenBreaksLabels(breaks, color, unit, travel_time){
    if (travel_time == true){
      return [
        {'label': styleNumbers(breaks[0]) + " to " + styleNumbers(breaks[1]) + " " + unit, 'color': color[6]},
        {'label': styleNumbers(breaks[1]) + " to " + styleNumbers(breaks[2])+ " " + unit, 'color': color[5]},
        {'label': styleNumbers(breaks[2]) + " to " + styleNumbers(breaks[3])+ " " + unit, 'color': color[4]},
        {'label': styleNumbers(breaks[3]) + " to " + styleNumbers(breaks[4])+ " " + unit, 'color': color[3]},
        {'label': styleNumbers(breaks[4]) + " to " + styleNumbers(breaks[5])+ " " + unit, 'color': color[2]},
        {'label': styleNumbers(breaks[5]) + " to " + styleNumbers(breaks[6])+ " " + unit, 'color': color[1]},
        {'label': "More than " + styleNumbers(breaks[6]) + " " + unit, 'color': color[0]},
        {'label': "No data/outside region", 'color': nan_color},
      ]
    }
    else{
      return [
        {'label': styleNumbers(breaks[0]) + " to " + styleNumbers(breaks[1]) + " " + unit, 'color': color[0]},
        {'label': styleNumbers(breaks[1]) + " to " + styleNumbers(breaks[2])+ " " + unit, 'color': color[1]},
        {'label': styleNumbers(breaks[2]) + " to " + styleNumbers(breaks[3])+ " " + unit, 'color': color[2]},
        {'label': styleNumbers(breaks[3]) + " to " + styleNumbers(breaks[4])+ " " + unit, 'color': color[3]},
        {'label': styleNumbers(breaks[4]) + " to " + styleNumbers(breaks[5])+ " " + unit, 'color': color[4]},
        {'label': styleNumbers(breaks[5]) + " to " + styleNumbers(breaks[6])+ " " + unit, 'color': color[5]},
        {'label': "More than " + styleNumbers(breaks[6]) + " " + unit, 'color': color[6]},
        {'label': "No data/outside region", 'color': nan_color},
      ]
    }

  }
  
  function getXLabelBuffer(maxVal){
    var buffer =  maxVal < 100 ? 8:
      maxVal < 1000 ? 18:
      maxVal < 10000 ? 28:
      38
    
    console.log(((300 - plotMargin.top) + buffer))
    return "translate(" + (300 + plotMargin.left + plotMargin.right)/2 + ", 300)"
  }
  
  function styleNumbers(val){
    if (Math.abs(val) >= 1000){
      return val.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    else if (Math.abs(val) > 10){
      return val.toFixed(0)
    }
    else if (val == 0.0){
      return val.toFixed(0)
    }
    else{
      return val.toFixed(2)
    }
  }