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

/**
 * Get a color scheme based on quintile ranges. Note that the `data` array
 * passed to the function must have all NaN's removed and have been sorted,
 * ideally using d3.ascending.
 * @param {*} d Value to colorize
 * @param {Array} data Sorted, clean dataset to use for quintile.
 * @param {Array} colors Color data
 */
function getQuintileColor(d, data, colors) {
  // Handle NAN Value label
  if(isNaN(d) || d < 0.0){
    return nan_color;
  }
  else {
    return  d >= d3.quantile(data, 0.8) ? colors[4]: 
    d >= d3.quantile(data, 0.6) ? colors[3]:
    d >= d3.quantile(data, 0.4) ? colors[2]:
    d >= d3.quantile(data, 0.2) ? colors[1]:
    colors[0];
  }
}

/**
 * Get a color scheme based on quintile ranges. Note that the `data` array
 * passed to the function must have all NaN's removed and have been sorted,
 * ideally using d3.ascending.
 * @param {*} d Value to colorize
 * @param {Array} data Sorted, clean dataset to use for quintile.
 * @param {Array} colors Color data
 */
function getQuintileCumulativeColor(d, data, colors) {
  qData = data.filter(d => d >= 0.0)
  // Handle NAN Value label
  if(isNaN(d)){
    return nan_color;
  }
  if (d < 0.0){
    return colors[4]
  }
  else {
    return  d >= d3.quantile(data, 0.8) ? colors[4]: 
    d >= d3.quantile(data, 0.6) ? colors[3]:
    d >= d3.quantile(data, 0.4) ? colors[2]:
    d >= d3.quantile(data, 0.2) ? colors[1]:
    colors[0];
  }
}

/**
 * Get a color scheme based on bins provided by the user.
 * @param {*} d Value to colorize
 * @param {Array} data Sorted, clean dataset to use for quintile.
 * @param {Array} colors Color data
 */
 function getFiveBinCumulativeColor(d, bins, colors) {
  if(isNaN(d)){
    return nan_color;
  }
  if (d < 0.0){
    return colors[4]
  }
  else {
    return  d >= bins[4] ? colors[4]: 
      d >= bins[3] ? colors[3]:
      d >= bins[2] ? colors[2]:
      d >= bins[1] ? colors[1]:
      colors[0];
  }
}


/**
 * Get a color scheme based on quintile ranges. Note that the `data` array
 * passed to the function must have all NaN's removed and have been sorted,
 * ideally using d3.ascending.
 * @param {*} d Value to colorize
 * @param {Array} data Sorted, clean dataset to use for quintile.
 * @param {Array} colors Color data
 */
function getQuintileTravelTimeColor(d, data, colors) {
  qData = data.filter(d => d > 0.0)
  // Handle NAN Value label
  if(isNaN(d)){
    return nan_color;
  }
  if (d < 0.0){
    return colors[0]
  }
  else {
    return  d >= d3.quantile(qData, 0.8) ? colors[0]: 
    d >= d3.quantile(qData, 0.6) ? colors[1]:
    d >= d3.quantile(qData, 0.4) ? colors[2]:
    d >= d3.quantile(qData, 0.2) ? colors[3]:
    colors[4];
  }
}

/**
 * Get a color scheme based on fixed ranges. Note that the `data` array
 * passed to the function must have all NaN's removed and have been sorted,
 * ideally using d3.ascending.
 * @param {*} d Value to colorize
 * @param {Array} data Sorted, clean dataset to use for quintile.
 * @param {Array} colors Color data
 */
 function getFixedTravelTimeRatioColor(d, data, colors) {
  qData = data.filter(d => d > 0.0)
  // Handle NAN Value label
  if(isNaN(d)){
    return nan_color;
  }
  if (d < 0.0){
    return colors[0]
  }
  else {
    return  d >= 4 ? colors[0]: 
    d >= 3 ? colors[1]:
    d >= 2 ? colors[2]:
    d >= 1 ? colors[3]:
    colors[4];
  }
}

/**
 * Color labels based on quintiles.
 * @param {Number} data Data to quintile.
 * @param {String} unit Unit label.
 * @param {Array} colors Array of 5 colors to use.
 */
function getQuintileCumulativeLabels(data, unit, colors){
  // Drop out the NaNs
  qData = data.filter(d => d >= 0.0)
  return [
    {'label': "Top 20% (more than " + styleNumbers(d3.quantile(data, 0.8)) + " " + unit + ')', 'color': colors[4]},
    {'label': '60 to 80% (' + styleNumbers(d3.quantile(data, 0.6)) + " to " + styleNumbers(d3.quantile(data, 0.8))+ " " + unit + ")", 'color': colors[3]},
    {'label': '40 to 60% (' + styleNumbers(d3.quantile(data, 0.4)) + " to " + styleNumbers(d3.quantile(data, 0.6))+ " " + unit + ")", 'color': colors[2]},
    {'label': '20 to 40% (' + styleNumbers(d3.quantile(data, 0.2)) + " to " + styleNumbers(d3.quantile(data, 0.4))+ " " + unit + ")", 'color': colors[1]},
    {'label': 'Bottom 20% (less than ' + styleNumbers(d3.quantile(data, 0.2)) + " " + unit + ")", 'color': colors[0]},
    {'label': "No data/outside region", 'color': nan_color},
  ]
}

/**
 * Color labels based on quintiles.
 * @param {Number} data Data to quintile.
 * @param {String} unit Unit label.
 * @param {Array} colors Array of 5 colors to use.
 */
function getQuintileTravelTimeLabels(data, unit, colors){
  qData = data.filter(d => d >= 0.0)
  return [
    {'label': "Top 20% (less than " + styleNumbers(d3.quantile(qData, 0.2)) + " " + unit + ')', 'color': colors[4]},
    {'label': '60 to 80% (' + styleNumbers(d3.quantile(qData, 0.4)) + " to " + styleNumbers(d3.quantile(qData, 0.2)) + " " + unit + ")", 'color': colors[3]},
    {'label': '40 to 60% (' + styleNumbers(d3.quantile(qData, 0.6)) + " to " + styleNumbers(d3.quantile(qData, 0.4)) + " " + unit + ")", 'color': colors[2]},
    {'label': '20 to 40% (' + styleNumbers(d3.quantile(qData, 0.8)) + " to " + styleNumbers(d3.quantile(qData, 0.6)) + " " + unit + ")", 'color': colors[1]},
    {'label': 'Bottom 20% (more than ' + styleNumbers(d3.quantile(qData, 0.8)) + " " + unit + ")", 'color': colors[0]},
    {'label': "No data/outside region", 'color': nan_color},
  ]
}

/**
 * Color labels based on fixed values provided.
 * @param {Number} data Data to quintile.
 * @param {String} unit Unit label.
 * @param {Array} colors Array of 5 colors to use.
 */
 function getFiveBinCumulativeLabels(bins, unit, colors){
  return [
    {'label': styleNumbers(bins[4]) + " to " + styleNumbers(bins[5]) + " " + unit, 'color': colors[4]},
    {'label': styleNumbers(bins[3]) + " to " + styleNumbers(bins[4]) + " " + unit, 'color': colors[3]},
    {'label': styleNumbers(bins[2]) + " to " + styleNumbers(bins[3]) + " " + unit, 'color': colors[2]},
    {'label': styleNumbers(bins[1]) + " to " + styleNumbers(bins[2]) + " " + unit, 'color': colors[1]},
    {'label': 'Less than ' + styleNumbers(bins[1]) + " " + unit, 'color': colors[0]},
    {'label': "No data/outside region", 'color': nan_color},
  ]
}

/**
 * Color labels based on fixed ratios.
 * @param {Number} data Data to quintile.
 * @param {String} unit Unit label.
 * @param {Array} colors Array of 5 colors to use.
 */
 function getFixedTravelTimeRatioLabels(data, unit, colors){
  return [
    {'label': 'Less than 1', 'color': colors[4]},
    {'label': '1 to 2', 'color': colors[3]},
    {'label': '2 to 3', 'color': colors[2]},
    {'label': '3 to 4', 'color': colors[1]},
    {'label': 'More than 4', 'color': colors[0]},
    {'label': "No data/outside region", 'color': nan_color},
  ]
}

/**
 * Color labels based on quintiles.
 * @param {Number} data Data to quintile.
 * @param {String} unit Unit label.
 * @param {Array} colors Array of 5 colors to use.
 */
function getQuintileRatioLabels(data, unit, colors){
  qData = data.filter(d => d >= 0.0)
  return [
    {'label': "Top 20% (less than " + styleNumbers(d3.quantile(data, 0.2)) + " " + unit + ')', 'color': colors[4]},
    {'label': '60 to 80% (' + styleNumbers(d3.quantile(data, 0.2)) + " to " + styleNumbers(d3.quantile(data, 0.4))+ " " + unit + ")", 'color': colors[3]},
    {'label': '40 to 60% (' + styleNumbers(d3.quantile(data, 0.4)) + " to " + styleNumbers(d3.quantile(data, 0.6))+ " " + unit + ")", 'color': colors[2]},
    {'label': '20 to 40% (' + styleNumbers(d3.quantile(data, 0.6)) + " to " + styleNumbers(d3.quantile(data, 0.8))+ " " + unit + ")", 'color': colors[1]},
    {'label': 'Bottom 20% (more than ' + styleNumbers(d3.quantile(data, 0.8)) + " " + unit + ")", 'color': colors[0]},
    {'label': "No data/outside region", 'color': nan_color},
  ]
}

/**
 * Colour value based on pre-defiend travel time range.
 * @param {Number} data Data to quintile.
 * @param {String} unit Unit label.
 * @param {Array} colors Array of 5 colors to use.
 */
function getTravelTimeColor(d, colors){
  if(isNaN(d)){
    return nan_color;
  }
  else {
    return  d >= 40 ? colors[0]: 
      d >= 30 ? colors[1]:
      d >= 20 ? colors[2]:
      d >= 10 ? colors[3]:
      d >= 0 ? colors[4]:
      colors[0];
  }
}

function getTravelTimeLabels(colors){
  return [
    {'label': 'Less than 10 minutes', 'color': colors[4]},
    {'label': '10 to 20 minutes', 'color': colors[3]},
    {'label': '20 to 30 minutes', 'color': colors[2]},
    {'label': '30 to 40 minutes', 'color': colors[1]},
    {'label': 'More than 40 minutes', 'color': colors[0]},
    {'label': "No data/outside region", 'color': nan_color},
  ]
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
  if (Math.abs(val) >= 10000){
    val = Math.round(val/100)*100
    return val.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  else if (Math.abs(val) >= 1000){
    val = Math.round(val/10)*10
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