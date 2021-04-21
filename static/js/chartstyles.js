var popStyle = {
    'pop_total' : {
        'label': 'Everyone',
        'color': "#1F77B4"
    },
    'pop_asiapacific' : {
        'label': "Asian",
        'color': "#FF7F0E"
    },
    'pop_black': {
        'label': "Black",
        'color': "#2CA02C"
    },
    'pop_hispanic': {
        'label': "Latinx",
        'color': "#D62728"
    },
    'pop_white': {
        'label': "White",
        'color': "#9467BD"
    },
    'pop_poverty': {
        'label': "Low Income",
        'color': '#8C564B'
    },
    'hhld_single_mother': {
        'label': 'Single Mother',
        'color': '#E377C2'
    },
    'workers_essential': {
        'label': 'Essential Worker',
        'color': '#7F7F7F'
    },
    'everyone_fares': {
        'label': 'Limited Fares',
        'color': '#bcbd22'
    },
    'everyone_weeknights': {
        'label': 'Weeknights',
        'color': '#8c564b'
    }
}

var colorList = ['#1F77B4', '#FF7F0E', '#D62728', '#9467BD', '#8C564B']

// Shorthands for collections
var ethnicGroups = ['pop_total', 'pop_asiapacific', 'pop_black', 'pop_hispanic', 'pop_white']
var econGroups = ['pop_total', 'pop_poverty', 'hhld_single_mother', 'workers_essential']
var allGroups = ['pop_total', 'pop_asiapacific', 'pop_black', 'pop_hispanic', 'pop_white', 'pop_poverty', 'hhld_single_mother', 'workers_essential']
var incomeGroups = ['pop_total', 'pop_poverty']

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