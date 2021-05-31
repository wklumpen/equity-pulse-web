var popStyle = {
    'pop_total' : {
        'label': 'Everyone',
        'color': "#7F7F7F"
    },
    'pop_asiapacific' : {
        'label': "Asian",
        'color': "#1F77B4"
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
        'label': "In Poverty",
        'color': '#8C564B'
    },
    'hhld_single_mother': {
        'label': 'Single Mother',
        'color': '#E377C2'
    },
    'workers_essential': {
        'label': 'Essential Worker',
        'color': '#FF7F0E'
    },
    'everyone_fares': {
        'label': 'Low-Cost Fares',
        'color': '#bcbd22'
    },
    'everyone_weeknights': {
        'label': 'Weeknights',
        'color': '#17becf'
    }
}

var carLabels = {
    'snap_M_t3_WE': '3rd Grocery Store',
    'pharmacies_M_t3_WE': '3rd Pharmacy',
    'urgentcare_M_t1_WE': '1st Urgent Care',
    'hospitals_M_t1_WE': '1st Hospital',
    'schools_M_t1_WE': '1st College/University'
}

var subgroupLabels ={
    'car_time': 'by Car',
    'bus_time': 'by Transit'
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
      return val.toFixed(0)
    }
  }