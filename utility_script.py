from db import setup_region, create_tables, BlockGroup

bg_path = r"C:\Users\Willem\Documents\Project\TransitCenter\boston_sample.csv"
pop_path = r"C:\Users\Willem\Documents\Project\TransitCenter\demographics_whole.csv"
bg_msa_path = r"C:\Users\Willem\Documents\Project\TransitCenter\boston-msa.csv"

# Starting with a blank DB
create_tables()
setup_region(bg_path, pop_path, "boston")

# # Use this to tag a region
# BlockGroup.tag_bg_from_csv(bg_msa_path, "boston-msa")