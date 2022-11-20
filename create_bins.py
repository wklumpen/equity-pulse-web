"""This script creates Jenks-based bins for visualization based on all
available score data.
"""

import pandas as pd
import jenkspy
import numpy as np
import os
data_folder = r"C:\Users\Willem\Documents\Project\TransitCenter Equity Pulse\data"
regions = ['boston', 'chicago', 'dc', 'la', 'nyc', 'philadelphia', 'sf']
score_keys = [
    'C000_P_c30_AM_autoN_fareN',
    'C000_P_c30_AM_autoN_fareY',
    'C000_P_c45_AM_autoN_fareN',
    'C000_P_c45_AM_autoN_fareY',
    'C000_P_c60_AM_autoN_fareN',
    'C000_P_c60_AM_autoN_fareY',
    'CE01_P_c30_AM_autoN_fareN',
    'CE01_P_c30_AM_autoN_fareY',
    'CE01_P_c45_AM_autoN_fareN',
    'CE01_P_c45_AM_autoN_fareY',
    'CE01_P_c60_AM_autoN_fareN',
    'CE01_P_c60_AM_autoN_fareY',
    'parks_P_c15_AM_autoN_fareN',
    'parks_P_c30_AM_autoN_fareN',
    'C000_P_c30_AM_autoY_fareN',
    'C000_P_c30_AM_autoY_fareY',
    'C000_P_c45_AM_autoY_fareN',
    'C000_P_c45_AM_autoY_fareY',
    'C000_P_c60_AM_autoY_fareN',
    'C000_P_c60_AM_autoY_fareY',
    'CE01_P_c30_AM_autoY_fareN',
    'CE01_P_c30_AM_autoY_fareY',
    'CE01_P_c45_AM_autoY_fareN',
    'CE01_P_c45_AM_autoY_fareY',
    'CE01_P_c60_AM_autoY_fareN',
    'CE01_P_c60_AM_autoY_fareY',
    'parks_P_c15_AM_autoY_fareN',
    'parks_P_c30_AM_autoY_fareN',
    'C000_P_c30_PM_autoN_fareN',
    'C000_P_c30_PM_autoN_fareY',
    'C000_P_c45_PM_autoN_fareN',
    'C000_P_c45_PM_autoN_fareY',
    'C000_P_c60_PM_autoN_fareN',
    'C000_P_c60_PM_autoN_fareY',
    'CE01_P_c30_PM_autoN_fareN',
    'CE01_P_c30_PM_autoN_fareY',
    'CE01_P_c45_PM_autoN_fareN',
    'CE01_P_c45_PM_autoN_fareY',
    'CE01_P_c60_PM_autoN_fareN',
    'CE01_P_c60_PM_autoN_fareY',
    'parks_P_c15_PM_autoN_fareN',
    'parks_P_c30_PM_autoN_fareN',
    'C000_P_c30_PM_autoY_fareN',
    'C000_P_c30_PM_autoY_fareY',
    'C000_P_c45_PM_autoY_fareN',
    'C000_P_c45_PM_autoY_fareY',
    'C000_P_c60_PM_autoY_fareN',
    'C000_P_c60_PM_autoY_fareY',
    'CE01_P_c30_PM_autoY_fareN',
    'CE01_P_c30_PM_autoY_fareY',
    'CE01_P_c45_PM_autoY_fareN',
    'CE01_P_c45_PM_autoY_fareY',
    'CE01_P_c60_PM_autoY_fareN',
    'CE01_P_c60_PM_autoY_fareY',
    'parks_P_c15_PM_autoY_fareN',
    'parks_P_c30_PM_autoY_fareN',
    'C000_P_c30_WE_autoN_fareN',
    'C000_P_c30_WE_autoN_fareY',
    'C000_P_c45_WE_autoN_fareN',
    'C000_P_c45_WE_autoN_fareY',
    'C000_P_c60_WE_autoN_fareN',
    'C000_P_c60_WE_autoN_fareY',
    'CE01_P_c30_WE_autoN_fareN',
    'CE01_P_c30_WE_autoN_fareY',
    'CE01_P_c45_WE_autoN_fareN',
    'CE01_P_c45_WE_autoN_fareY',
    'CE01_P_c60_WE_autoN_fareN',
    'CE01_P_c60_WE_autoN_fareY',
    'parks_P_c15_WE_autoN_fareN',
    'parks_P_c30_WE_autoN_fareN',
    'C000_P_c30_WE_autoY_fareN',
    'C000_P_c30_WE_autoY_fareY',
    'C000_P_c45_WE_autoY_fareN',
    'C000_P_c45_WE_autoY_fareY',
    'C000_P_c60_WE_autoY_fareN',
    'C000_P_c60_WE_autoY_fareY',
    'CE01_P_c30_WE_autoY_fareN',
    'CE01_P_c30_WE_autoY_fareY',
    'CE01_P_c45_WE_autoY_fareN',
    'CE01_P_c45_WE_autoY_fareY',
    'CE01_P_c60_WE_autoY_fareN',
    'CE01_P_c60_WE_autoY_fareY',
    'parks_P_c15_WE_autoY_fareN',
    'parks_P_c30_WE_autoY_fareN',
    'los_trips_WKD',
    'los_trips_SAT'
]

out = []

dtype={'bg_id':str, 'score':float, 'score_key':str, 'date':str}
for region in regions:
    print(f"Running {region}")
    scores = pd.read_csv(os.path.join(data_folder, 'load', region, 'scores.csv'), dtype=dtype)
    print(f"    Data Loaded For {region}")
    # score_keys = ['CE01_P_c60_WE_autoY_fareY', 'parks_P_c15_AM_autoY_fareN']
    for score_key in score_keys:
        keyed = scores[scores.score_key == score_key]
        max_val = keyed['score'].max()
        min_val = keyed['score'].min()
        breaks = jenkspy.jenks_breaks(keyed['score'].sample(5000), nb_class=5)
        breaks[0] = min_val
        breaks[-1] = max_val
        data = {'region':region, 'score_key':score_key, 'bin_0':breaks[0], 'bin_1':breaks[1], 'bin_2':breaks[2], 'bin_3':breaks[3], 'bin_4':breaks[4], 'bin_5':breaks[5]}
        out.append(data)
        print(f"    Jenks complete for {score_key}")
    print(f"Finished {region}")
out_df = pd.DataFrame(out)
out_df.to_csv('bins.csv', index=False)