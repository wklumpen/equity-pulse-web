import json
import sys
import datetime as dt

# Temporary path to project
# sys.path.append(r"C:\Users\Willem\Documents\Project\TransitCenter\TransitCenter\utils")

# Third Party Modules
from flask import Flask, render_template, jsonify
from playhouse.shortcuts import model_to_dict
import pandas as pd

# Configuration imports
from config import DevelopmentConfig, REGION_LIST

# Custom local imports
from db import Score, Population, BlockGroup, Dot, Tag

app = Flask(__name__)
app.config.from_object(DevelopmentConfig)


@app.route('/')
def home():
    return render_template('scorecard.html')


@app.route('/<region>')
def region(region):
    if region.lower() in REGION_LIST:
        # Get the maximum date
        start_date = Tag.max_tag_date(region.lower()).strftime("%Y-%m-%d")
        view = {'name': 'boston', 'lat': 42.3603578, 'lon': -71.0616172, 'max_date': start_date}
        return render_template('map.html', region=region.lower(), zoom=9.5, view=view)
    else:
        return render_template('map.html', region=region.lower())


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
    scores = Score.by_tag_type_with_date(zone, score_key, date)
    return jsonify([model_to_dict(s) for s in scores])

@app.route('/data/bg/<tag>')
def data_bg_tag(tag):
    bg = BlockGroup.by_tag(tag)
    return jsonify([model_to_dict(b) for b in bg])

@app.route('/data/pop/<zone>/<pop_key>')
def data_population(zone, pop_key):
    pop = Population.by_tag_type(zone, pop_key)
    return jsonify([model_to_dict(p) for p in pop])

@app.route('/data/time/<zone>/<score_key>')
def data_time(zone, score_key):
    """
    Format of score_key should be:
    """
    # Grab scores with dates
    scores = Score.by_tag_type_no_date(zone, score_key)
    # Now let's grab populations
    pop = Population.by_tag_type(zone, 'pop_total')
    df = pd.DataFrame(list(scores.dicts()))
    df = pd.merge(df, pd.DataFrame(list(pop.dicts())), on='id')
    # Now calculate the weighted average
    df = df[['score', 'date', 'value']].groupby("date").apply(lambda dfx: (dfx["value"] * dfx["score"]).sum() / dfx["value"].sum()).reset_index()
    df.columns = ['date', 'score']
    df['date'] = pd.to_datetime(df['date']).dt.date.astype(str)

    return jsonify(df.to_dict())

@app.route('/data/dot/<zone>/<pop_key>')
def data_dot(zone, pop_key):
    dots = Dot.by_tag_type(zone, pop_key)
    return jsonify([model_to_dict(d) for d in dots])


if __name__ == '__main__':
    app.run(host='0.0.0.0')