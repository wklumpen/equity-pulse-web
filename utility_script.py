from db import setup_region, create_tables, delete_tables, BlockGroup, Score, Population, Summary
import os

data_folder = r"C:\Users\Willem\Documents\Project\TransitCenter\data\nyc"
bg_path = os.path.join(data_folder, "bg.csv")
urban_path = os.path.join(data_folder, "bg_urban_core.csv")
msa_path = os.path.join(data_folder, 'bg.csv')
equity_path = os.path.join(data_folder, 'bg_equity.csv' )
pop_path = os.path.join(data_folder, "nyc_demographics.csv")
score_paths = ['measures_2020-02-23_LOS.csv', 'measures_2020-05-10_LOS.csv', 'measures_2020-09-20_LOS.csv', 'measures_2020-10-11_LOS.csv']

# Starting with a blank DB
# delete_tables()
create_tables()
BlockGroup.add_bg_from_csv(bg_path)
# BlockGroup.tag_bg_from_csv(bg_path, 'nyc', 'nyc', 'all')
# BlockGroup.tag_bg_from_csv(msa_path, 'nyc-msa', 'nyc', 'msa')
# BlockGroup.tag_bg_from_csv(urban_path,  'nyc-urban', 'nyc', 'urban')
# BlockGroup.tag_bg_from_csv(equity_path, 'nyc-equity', 'nyc', 'equity')
# for s in score_paths:
#     score_path = os.path.join(data_folder, s)
#     Score.score_from_csv(score_path)
Population.population_from_csv(pop_path)
# Summary.refresh()