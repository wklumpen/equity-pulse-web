import json
import sys

# Temporary path to project
sys.path.append(r"C:\Users\Willem\Documents\Project\TransitCenter\TransitCenter\utils")

# Third Party Modules
from flask import Flask, render_template, jsonify
from playhouse.shortcuts import model_to_dict

# Configuration imports
from config import DevelopmentConfig, REGION_LIST

# Custom local imports
from db import Score, Population

app = Flask(__name__)
app.config.from_object(DevelopmentConfig)


@app.route('/')
def home():
    return render_template('scorecard.html')


@app.route('/<region>')
def region(region):
    if region.lower() in REGION_LIST:
        view = {'name': 'boston', 'lat': 42.3603578, 'lon': -71.0616172}
        return render_template('map.html', region=region.lower(), zoom=10.5, view=view)
    else:
        return render_template('map.html', region=region.lower())

# DATA API STARTS HERE
@app.route('/data/score/<tag>/<score_type>')
def data_score(tag, score_type):
    scores = Score.by_tag_type(tag, score_type)
    return jsonify([model_to_dict(s) for s in scores])

@app.route('/data/pop/<tag>/<pop_type>')
def data_population(tag, pop_type):
    pop = Population.by_tag_type(tag, pop_type)
    return jsonify([model_to_dict(p) for p in pop])

if __name__ == '__main__':
    app.run(host='0.0.0.0')