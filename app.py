import json
import sys
import datetime as dt

# Temporary path to project
# sys.path.append(r"C:\Users\Willem\Documents\Project\TransitCenter\TransitCenter\utils")

# Third Party Modules
from flask import Flask, render_template, jsonify, redirect
from playhouse.shortcuts import model_to_dict
from peewee import DoesNotExist
import pandas as pd

# Configuration imports
from config import DevelopmentConfig, REGION_LIST

# Custom local imports
from db import Score, Population, BlockGroup, Tag, Region, Summary
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


@app.route('/map/<region>')
def map(region):
    try:
        r = Region.get(Region.tag == region)
        # Get the maximum date
        start_date = Tag.max_tag_date(region.lower()).strftime("%Y-%m-%d")
        view = {'title': r.name, 'name': r.tag, 'lat': r.lat, 'lon': r.lon, 'max_date': start_date}
        return render_template('map.html', region=r.tag, zoom=r.zoom, view=view)
    except DoesNotExist:
        return redirect('/')

@app.route('/charts/<region>')
def charts(region):
    try:
        r = Region.get(Region.tag == region)
        view = {'title': r.name, 'name': r.tag, 'lat': r.lat, 'lon': r.lon, 'state': r.state, 'county': r.county, 'agencies': r.agencies}
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

@app.route('/data/bg/<tag>')
def data_bg_tag(tag):
    bg = BlockGroup.by_tag(tag)
    return jsonify([model_to_dict(b) for b in bg])

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
    # Grab scores with dates
    scores = Score.get_dates(f"{zone}-msa", score_key)
    score_d = [model_to_dict(s)['date'] for s in scores]

    return jsonify(score_d)

@app.route('/data/dates/<zone>')
def zone_dates(zone):
    dates = Tag.get_tag_dates(zone)
    return jsonify([model_to_dict(d)['date'] for d in dates])

@app.route('/data/dot/<zone>/<pop_key>')
def data_dot(zone, pop_key):
    dots = Dot.by_tag_type(zone, pop_key)
    return jsonify([model_to_dict(d) for d in dots])



if __name__ == '__main__':
    app.run(host='0.0.0.0')