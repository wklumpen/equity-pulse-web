"""
Results database Peewee model library. STILL UNDER DEVELOPMENT

This file contains database table defintions using the Peewee database
object-relational-mapper, along with helper functions to assist data management.
"""
from datetime import date, datetime

from peewee import Model, SqliteDatabase, TextField, ForeignKeyField, IntegerField, FloatField, DateField, chunked, fn
import pandas as pd

database = SqliteDatabase(r'results.db') # Temporary sqlite DB instance

class BaseModel(Model):
    class Meta:
        database = database
        legacy_table_names = False


class BlockGroup(BaseModel):
    id = IntegerField(primary_key=True)

    @staticmethod
    def by_tag(tag):
        return (BlockGroup.select(BlockGroup.id)
                    .join(BlockGroupTag).join(Tag)
                    .where(Tag.name == tag))

    @staticmethod
    def tag_bg_from_csv(filepath, tag):
        df = pd.read_csv(filepath, dtype={'block_group_id': 'Int64'})
        t, new = Tag.get_or_create(name=tag)
        to_insert = []
        for idx, bg in df.iterrows():
            to_tag = dict()
            to_tag['block_group_id'] = bg.block_group_id
            to_tag['tag_id'] = t.id
            to_insert.append(to_tag)

        with database.atomic():
            for batch in chunked(to_insert, 100):
                BlockGroupTag.insert_many(batch).execute()

    @staticmethod
    def add_bg_from_csv(filepath):
        print("Inserting Block Groups from CSV")
        df = pd.read_csv(filepath, dtype={'block_group_id': 'Int64'})
        to_insert = []
        for idx, bg in df.iterrows():
            new_bg = dict()
            new_bg['id'] = bg['block_group_id']
            to_insert.append(new_bg)
    
        with database.atomic():
            for batch in chunked(to_insert, 100):
                BlockGroup.insert_many(batch).execute()



class ScoreType(BaseModel):
    key = TextField()
    date = DateField()
    description = TextField(null=True)


class Score(BaseModel):
    block_group = ForeignKeyField(BlockGroup, backref='scores')
    score_type = ForeignKeyField(ScoreType, backref='scores')
    score = FloatField(null=True)

    @staticmethod
    def score_from_csv(filepath):
        print("Inserting Scores from CSV")
        df = pd.read_csv(filepath, dtype={'block_group_id': 'Int64'})
        # We'll build a dictionary of types to add and make sure they're
        score_types = dict()
        for score_column in df.columns[1:]:
            print(f"Score key: {score_column}")
            # Break it down and build it back up
            s_split = score_column.strip().split('_')
            date_key = s_split[-1]
            score_key = "_".join(s_split[:-1])

            score_type, new = ScoreType.get_or_create(
                key = score_key,
                date = datetime.strptime(date_key, '%Y-%m-%d'),
                )

            score_types[score_column] = score_type

            # Now we can package the column into a list of dictionaries and do a bulk insert
            to_insert = []
            for idx, score_row in df.iterrows():
                insert_row = dict()
                if score_row['block_group_id'] < 0:
                    print(score_row)
                else:
                    insert_row['block_group_id'] = score_row['block_group_id']
                    insert_row['score_type_id'] = score_type.id
                    insert_row['score'] = score_row[score_column]
                    to_insert.append(insert_row)

            with database.atomic():
                for batch in chunked(to_insert, 100):
                    Score.insert_many(batch).execute()
        
    @staticmethod
    def by_tag_type_with_date(tag, score_key, date):
        return (Score.select(Score.score, BlockGroup.id, ScoreType.date)
                .join(BlockGroup).join(BlockGroupTag).join(Tag)
                .where(Tag.name == tag)
                .switch(Score)
                .join(ScoreType)
                .where((ScoreType.key == score_key) & (ScoreType.date == date)))

    @staticmethod
    def by_tag_type_no_date(tag, score_key):
        # Parse the score key
        return (Score.select(Score.score, BlockGroup.id, ScoreType.date)
                .join(BlockGroup).join(BlockGroupTag).join(Tag)
                .where(Tag.name == tag)
                .switch(Score)
                .join(ScoreType)
                .where((ScoreType.key == score_key)
                ))
    
    @staticmethod
    def weighted_average(tag, score_type, pop_type):
        # Start by getting the appropriate score
        score = (Score.select(Score.score, BlockGroup.id)
                .join(BlockGroup).join(BlockGroupTag).join(Tag)
                .where(Tag.name == tag)
                .switch(Score)
                .join(ScoreType)
                .where(ScoreType.name == score_type)
                .switch(BlockGroup)
                .join(Population)
                .join(PopulationType)
                .where(PopulationType.name == pop_type))
        return score


class PopulationType(BaseModel):
    name = TextField()
    description = TextField(null=True)


class Population(BaseModel):
    block_group = ForeignKeyField(BlockGroup, backref='populations')
    population_type = ForeignKeyField(PopulationType, backref='populations')
    value = FloatField()

    @staticmethod
    def population_from_csv(filepath):
        print("Inserting Population from CSV")
        df = pd.read_csv(filepath, dtype={'block_group_id': 'Int64'})
        # We'll build a dictionary of types to add and make sure they're
        pop_types = dict()
        for pop_column in df.columns[1:]:
            print(f"Population Column: {pop_column}")

            pop_type, new = PopulationType.get_or_create(name=pop_column)
            description = pop_column
            pop_type.description = description
            pop_type.save()
            pop_types[pop_column] = pop_type

            # Now we can package the column into a list of dictionaries and do a bulk insert
            to_insert = []
            for idx, pop_row in df.iterrows():
                insert_row = dict()
                if pop_row['block_group_id'] < 0:
                    print(pop_row)
                else:
                    insert_row['block_group_id'] = pop_row['block_group_id']
                    insert_row['population_type_id'] = pop_type.id
                    insert_row['value'] = pop_row[pop_column]
                    to_insert.append(insert_row)

            with database.atomic():
                for batch in chunked(to_insert, 100):
                    Population.insert_many(batch).execute()

    @staticmethod
    def by_tag_type(tag, pop_type):
        return (Population.select(Population.value, BlockGroup.id)
                .join(BlockGroup).join(BlockGroupTag).join(Tag)
                .where(Tag.name == tag)
                .switch(Population)
                .join(PopulationType)
                .where(PopulationType.name == pop_type))

class Tag(BaseModel):
    name = TextField()

    @staticmethod
    def max_tag_date(tag_name):
        return (ScoreType.select(fn.MAX(ScoreType.date))).scalar()


class BlockGroupTag(BaseModel):
    block_group = ForeignKeyField(BlockGroup, backref='block_group_tags')
    tag = ForeignKeyField(Tag, backref='block_group_tags')


# DEPRECIATED
class Dot(BaseModel):
    block_group = ForeignKeyField(BlockGroup, backref='dots')
    population_type = ForeignKeyField(PopulationType, backref='dots')
    x = FloatField()
    y = FloatField()


    @staticmethod
    def by_tag_type(tag, pop_type):
        return (Dot.select(Dot.block_group_id, Dot.x, Dot.y)
                .join(PopulationType)
                .where(PopulationType.name == pop_type)
                .switch(Dot)
                .join(BlockGroup)
                .join(BlockGroupTag)
                .join(Tag)
                .where(Tag.name == tag))

    @staticmethod
    def dots_from_csv(filepath):
        df = pd.read_csv(filepath, dtype={'block_group_id': 'Int64'})
        types = dict()
        # Packgage up the types
        for name in df['var'].unique():
            pt, new = PopulationType.get_or_create(name=name, description=name)
            types[name] = pt
        
        # Now let's add them in
        to_insert = []
        for idx, dot_row in df.iterrows():
            if idx % 10000 == 0:
                print(f"{idx} rows packaged")
            insert_row = dict()
            insert_row['block_group_id'] = dot_row['block_group_id']
            insert_row['population_type_id'] = types[dot_row['var']].id
            insert_row['x'] = dot_row['x']
            insert_row['y'] = dot_row['y']
            to_insert.append(insert_row)
        
        with database.atomic():
                for batch in chunked(to_insert, 200):
                    Dot.insert_many(batch).execute()
        

def create_tables():
    database.connect()
    database.create_tables([BlockGroup, ScoreType, Score, PopulationType, Population, Tag, BlockGroupTag], safe=True)
    database.close()


def setup_region(bg_filepath, pop_filepath, initial_zone_name):
    BlockGroup.add_bg_from_csv(bg_filepath)
    BlockGroup.tag_bg_from_csv(bg_filepath, initial_zone_name)
    Score.score_from_csv(bg_filepath)
    Population.population_from_csv(pop_filepath)


if __name__ == "__main__":
    database.connect()
    database.drop_tables([Dot])
    database.close()
    create_tables()
    Dot.dots_from_csv(r"C:\Users\Willem\Documents\Project\TransitCenter\demo_dots.csv")
