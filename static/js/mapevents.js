


function transitToggle(value){
  if (document.getElementById('transitToggle').checked){
      transitLayer.setStyle({
      weight: 1
      })
  }
  else{
      transitLayer.setStyle({
      weight: 0
      })
  }
}

function sliderTrigger(value){
  var m = moment(value) // Easier to format using moments.
  var newDate = m.format('YYYYMMDD')
  if (newDate != state['date']){
    queryParams = new URLSearchParams(window.location.search);
    queryParams.set('date', newDate)
    history.replaceState(null, null, "?" + queryParams.toString())

    setStateFromParams();
  }
}