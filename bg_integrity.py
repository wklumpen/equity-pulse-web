import csv
import os

data_folder = r"C:\Users\Willem\Documents\Project\TransitCenter\data\nyc"
bg_path = os.path.join(data_folder, "bg.csv")
urban_path = os.path.join(data_folder, "bg_urban_core.csv")
msa_path = os.path.join(data_folder, 'bg.csv')
equity_path = os.path.join(data_folder, 'bg_equity.csv' )

bg = []
urban = []
with open(bg_path, 'r') as infile:
    r = csv.reader(infile)
    next(r)
    for row in r:
        bg.append(int(row[0]))

with open(equity_path, 'r') as infile:
    r = csv.reader(infile)
    next(r)
    for row in r:
        urban.append(int(row[0]))

extras = [i for i in urban if i  not in bg]
include = [i for i in urban if i in bg]
print (f"{len(extras)} out of {len(urban)}")

with open('equity_fixed.csv', 'w', newline='') as outfile:
    w = csv.writer(outfile)
    w.writerow(['bg_id'])
    for i in include:
        w.writerow([str(i)])