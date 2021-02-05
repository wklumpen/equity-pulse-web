from db import BlockGroup, Score, Population, Summary, Region
import os

# Edit this information to match a new region
region_tag = 'nyc'  # The lower-case tag used for the region (nyc, boston, etc)
region_name = 'New York'  # The proper name of the region
region_desc = 'This is a quick description' # A region description
county = '' # The county name that is the main city (for Covid-19 data)
state = ''  # The name of the state we're in
lat = 0.0 # Where to center the map, laterally
lon = 0.0  # Where to center the map, logitudinally
zoom = 8.2 # The zoom level to set
agencies = 'Test'  # A list of agencies included in the study for this region
live = False  # Whether the tile should be click-able at any point

# Base folder structure should remain consistent
data_folder = r"C:\Users\Willem\Documents\Project\TransitCenter\data\load"
data_folder = os.path.join(data_folder, 'region')

# Link up paths to various definitions
bg_path = os.path.join(data_folder, "block_groups.csv")
msa_path = os.path.join(data_folder, 'msa.csv')
urban_path = os.path.join(data_folder, "urban.csv")
equity_path = os.path.join(data_folder, 'equity.csv' )
pop_path = os.path.join(data_folder, "population.csv")
score_path = os.path.join(data_folder, "scores.csv")

# Load in block groups
BlockGroup.add_bg_from_csv(bg_path)

#Tag block groups with various keys
BlockGroup.tag_bg_from_csv(bg_path, f'{region_tag}', region_tag, 'all')
BlockGroup.tag_bg_from_csv(msa_path, f'{region_tag}-msa', region_tag, 'msa')
BlockGroup.tag_bg_from_csv(urban_path,  f'{region_tag}-urban', region_tag, 'urban')
BlockGroup.tag_bg_from_csv(equity_path, f'{region_tag}-equity', region_tag, 'equity')

# Load in population data
Population.population_from_csv(pop_path)

# Load in score data
Score.score_from_csv(score_path)

# Create the region
Region.create(
    name=region_name, 
    description=region_desc,
    tag=region_tag,
    county=county,
    state=state,
    lat=lat, lon=lon, zoom=zoom,
    agencies=agencies,
    live=live)
    
# Create a data summary
Summary.refresh()