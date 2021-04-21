import json
import sys
import datetime as dt

sys.path.append('../equity-pulse-db')

# Temporary path to project
# sys.path.append(r"C:\Users\Willem\Documents\Project\TransitCenter\TransitCenter\utils")

# Third Party Modules
from flask import Flask, render_template, jsonify, redirect, Response
from flask_csv import send_csv
from playhouse.shortcuts import model_to_dict
from peewee import DoesNotExist
import pandas as pd
from io import StringIO
import csv

# Configuration imports
from config import DevelopmentConfig, REGION_LIST

# Custom local imports
from db import Score, Population, BlockGroup, Tag, Region, Summary, Run, Realtime
from dbconfig import database

app = Flask(__name__)
app.config.from_object(DevelopmentConfig)

# This hook ensures that a connection is opened to handle any queries
# generated by the request.
@app.before_request
def _db_connect():
    database.connect()

# This hook ensures that the connection is closed when we've finished
# processing the request.
@app.teardown_request
def _db_close(exc):
    if not database.is_closed():
        database.close()

@app.route('/')
def home():
    return render_template('home.html', regions=Region.select().where(Region.live == True))

@app.route('/documentation')
def documentation():
    return render_template('documentation.html')

@app.route('/download')
def download():
    return redirect('/')

@app.route('/download/<region>')
def download_region(region):
    try:
        r = Region.get(Region.tag == region)
        dates = Run.select(Run.date, Run.note).where(Run.region == region).where(Run.live == True).order_by(Run.date.desc())
        datelist = []
        for d in dates:
            datelist.append([d.date, d.note])
        print(datelist)
        return render_template('download.html', tag=r.tag, title=r.name, dates=datelist)
    except DoesNotExist:
        return redirect('/')
    

@app.route('/map/<region>')
def map(region):
    try:
        r = Region.get(Region.tag == region)
        # Get the maximum date
        start_date = Run.max_run_date(region.lower()).strftime("%Y-%m-%d")
        view = {'title': r.name, 'name': r.tag, 'lat': r.lat, 'lon': r.lon, 'max_date': start_date}
        return render_template('map.html', region=r.tag, zoom=r.zoom, view=view)
    except DoesNotExist:
        return redirect('/')

@app.route('/charts/<region>')
def charts(region):
    try:
        r = Region.get(Region.tag == region)
        maxDate = Summary.max_date(f"{region}-msa")
        reliability = False
        if region in ['nyc', 'chicago', 'sf', 'philadelphia']:
            reliability = True
        view = {'title': r.name, 'name': r.tag, 'lat': r.lat, 'lon': r.lon, 
        'state': r.state, 'county': r.county, 'agencies': r.agencies, 
        'max_date': maxDate, 'reliability': reliability}
        return render_template('charts.html', view=view)
    except DoesNotExist:
        return redirect('/')


# DATA API STARTS HERE
@app.route('/data/score/<zone>/<score_key>/<date_key>')
def score(zone, score_key, date_key):
    """
    Data API call to retrieve score information.
    Format of score_key should be:
    measure_destination_function_date_period, where
        measure = the metric used (Access, Equity, Etc)
        destination = the destination (jobs, snap stores, etc)
        function = the measurement function (cumulative 45min, travel time)
        date = date key for the measure
        period = Morning peak (MP), etc.
    """
    date = dt.datetime.strptime(date_key, "%Y-%m-%d")
    scores = Score.by_tag_type_with_date(zone, score_key, date_key)
    return jsonify(scores)

# @app.route('/data/bg/<tag>')
# def data_bg_tag(tag):
#     bg = BlockGroup.by_tag(tag)
#     return jsonify([model_to_dict(b) for b in bg])

@app.route('/data/dl/view/csv/<zone>/<score_key>/<date_key>')
def current_data_csv(zone, score_key, date_key):
    scores = Score.by_tag_type_with_date(zone, score_key, date_key)
    out = []
    for key, val in scores.items():
        out.append({'block_group': key, 'score': val})
    return send_csv(out, f"tcep_{zone}_{score_key}_{date_key}.csv", ['block_group', 'score'])

@app.route('/data/dl/view/geojson/<zone>/<score_key>/<date_key>')
def current_data_geojson(zone, score_key, date_key):
    # Grab the data first
    scores = Score.by_tag_type_with_date(zone, score_key, date_key)
    out = {}
    for key, val in scores.items():
        out[int(key)] = val
    # Read in the json file
    with open(f'static/data/{zone}_bg.geojson') as bgfile:
        data = json.load(bgfile)
        for feature in data['features']:
           feature['properties']['score'] = out[int(feature['properties']['GEOID'])] 
        return Response(json.dumps(data),
            mimetype='application/json',
            headers={'Content-Disposition':f'attachment;filename=tcep_{score_key}_{date_key}.geojson'})

@app.route('/data/dl/all/<zone>/<date_key>')
def all_data_csv(zone, date_key):
    scores = Score.by_tag_type_with_date_all(zone, date_key)
    return send_csv(scores.to_dict(orient='records'), f"tcep_{zone}_{date_key}_all.csv", scores.columns)

@app.route('/data/dl/summary/<zone>')
def summary_data(zone):
    summary = Summary.select(Summary.zone, Summary.date, Summary.description, Summary.score_key, Summary.value).where(Summary.zone.contains(zone))
    summary_d = [model_to_dict(s) for s in summary]
    columns = ['zone', 'date', 'description', 'score_key', 'value']
    # Get rid of the ID column
    for item in summary_d:
        del(item['id'])
    return send_csv(summary_d, f"tcep_summary_{zone}.csv", columns)

@app.route('/data/pop/<zone>/<pop_key>')
def data_population(zone, pop_key):
    pop = Population.by_tag_type(zone, pop_key)
    return jsonify([model_to_dict(p) for p in pop])

@app.route('/data/theme/<theme>/<zone>/<score_key>')
def data_theme(theme, zone, score_key):
    if theme == '1':
        data = Score.weighted_average_all_pop_types(zone, score_key) 
        return jsonify(data)

@app.route('/data/summary/<zone>')
def data_summary(zone):
    q = (Summary.select().where(Summary.zone.contains(zone)))
    return jsonify([model_to_dict(p) for p in q])

@app.route('/data/time/<zone>/<score_key>')
def data_time(zone, score_key):
    """
    Format of score_key should be:
    """
    # Grab scores with dates, tag with MSA as we know that score is in the summary
    scores = Tag.get_tag_dates(zone)
    score_d = [model_to_dict(s)['date'] for s in scores]

    return jsonify(score_d)

@app.route('/data/dates/<zone>')
def zone_dates(zone):
    dates = Tag.get_tag_dates(zone)
    return jsonify([model_to_dict(d)['date'] for d in dates])

@app.route('/data/reliability/<zone>')
def reliability(zone):
    # A patch for bad spelling
    if zone == 'philadelphia':
        zone = 'philiadelphia'
    if zone == 'sf':
        data = data = Realtime.select(Realtime.agency, Realtime.mode, Realtime.otp, Realtime.timestamp).where(Realtime.region == zone, Realtime.otp > 0, Realtime.agency.in_(['AC TRANSIT', 'Bay Area Rapid Transit', 'San Francisco Municipal Transportation Agency']))
        data = [model_to_dict(r) for r in data]
    else:    
        data = Realtime.select(Realtime.agency, Realtime.mode, Realtime.otp, Realtime.timestamp).where(Realtime.region == zone, Realtime.otp > 0)
        data = [model_to_dict(r) for r in data]
    for entry in data:
        del(entry['region'])
        del(entry['delay_abs'])
        del(entry['delay_late'])
        del(entry['delay_early'])
        del(entry['fraction'])
        del(entry['id'])
    return jsonify(data)

@app.route('/data/dot/<zone>/<pop_key>')
def data_dot(zone, pop_key):
    dots = Dot.by_tag_type(zone, pop_key)
    return jsonify([model_to_dict(d) for d in dots])

if __name__ == '__main__':
    app.run(host='0.0.0.0')