from flask import Flask, render_template

from config import DevelopmentConfig, REGION_LIST

import json

app = Flask(__name__)
app.config.from_object(DevelopmentConfig)


@app.route('/')
def home():
    return render_template('scorecard.html')


@app.route('/<region>')
def hello_name(region):
    if region.lower() in REGION_LIST:
        view = {'lat': 42.3603578, 'lon': -71.0616172}
        return render_template('map.html', region=region.lower(), zoom=8.5, view=view)
    else:
        return render_template('map.html', region='boston')

if __name__ == '__main__':
    app.run()