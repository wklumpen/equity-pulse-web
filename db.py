"""
Results database Peewee model library. STILL UNDER DEVELOPMENT

This file contains database table defintions using the Peewee database
object-relational-mapper, along with helper functions to assist data management.
"""
from datetime import date, datetime

from peewee import Model, SqliteDatabase, TextField, ForeignKeyField, IntegerField, BigIntegerField, FloatField, DateField, chunked, fn
import pandas as pd

from dbconfig import database

# database = SqliteDatabase(r'results.db') # Temporary sqlite DB instance

class BaseModel(Model):
    class Meta:
        database = database
        legacy_table_names = False


class BlockGroup(BaseModel):
    geoid = BigIntegerField(unique=True)

    @staticmethod
    def by_tag(tag):
        return (BlockGroup.select(BlockGroup.geoid)
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
            print(int(bg['block_group_id']))
            new_bg = BlockGroup(geoid=int(bg['block_group_id']))
            to_insert.append(new_bg)

        with database.atomic():
            BlockGroup.bulk_create(to_insert, batch_size=500)


class ScoreType(BaseModel):
    key = TextField()
    date = DateField()
    description = TextField(null=True)


class Score(BaseModel):
    block_group = ForeignKeyField(BlockGroup, field='geoid', backref='scores')
    score_type = ForeignKeyField(ScoreType, backref='scores')
    score = FloatField(null=True)

    @staticmethod
    def score_from_csv(filepath):
        print("Inserting Scores from CSV")
        df = pd.read_csv(filepath, dtype={'block_group_id': 'Int64'})
        df = df.fillna(0)
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
        q = (Score.select(Score.score, BlockGroup.geoid, ScoreType.date)
                .join(BlockGroup).join(BlockGroupTag).join(Tag)
                .where(Tag.name == tag)
                .switch(Score)
                .join(ScoreType)
                .where((ScoreType.key == score_key) & (ScoreType.date == date)))
        print(q)
        return q

    @staticmethod
    def by_tag_type_no_date(tag, score_key):
        # Parse the score key
        return (Score.select(Score.score, BlockGroup.geoid, ScoreType.date)
                .join(BlockGroup).join(BlockGroupTag).join(Tag)
                .where(Tag.name == tag)
                .switch(Score)
                .join(ScoreType)
                .where((ScoreType.key == score_key)
                ))

    @staticmethod
    def weighted_average(tag, score_type, pop_type):
        # Start by getting the appropriate score
        score = (Score.select(Score.score, BlockGroup.geoid)
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
    block_group = ForeignKeyField(BlockGroup, field='geoid', backref='populations')
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
                    Population.insert_many(batch).on_conflict('ignore').execute()

    @staticmethod
    def by_tag_type(tag, pop_type):
        return (Population.select(Population.value, BlockGroup.geoid)
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

    @staticmethod
    def get_tag_dates(tag_name):
        return (ScoreType.select(ScoreType.date)
                .join(Score)
                .join(BlockGroup)
                .join(BlockGroupTag)
                .join(Tag)
                .where(Tag.name == tag_name).distinct())
        # return (BlockGroup.select()
        #         .join(BlockGroupTag)
        #         .join(Tag)
        #         .switch(BlockGroup)
        #         .join(Score)
        #         .join(ScoreType)
        #         .where(Tag.name == tag_name)
        #         .distinct())


class BlockGroupTag(BaseModel):
    block_group = ForeignKeyField(BlockGroup, field="geoid", backref='block_group_tags')
    tag = ForeignKeyField(Tag, backref='block_group_tags')

class Region(BaseModel):
    name = TextField()
    description = TextField(null=True)
    tag = TextField(unique=True)
    county = TextField(unique=True)
    state = TextField()
    lat = FloatField()
    lon = FloatField()
    zoom = FloatField()


def create_tables():
    with database:
        print("Creating Tables on", database)
        database.create_tables([BlockGroup, ScoreType, Score, PopulationType, Population, Tag, BlockGroupTag], safe=True)

def setup_region(bg_filepath, pop_filepath, initial_zone_name):
    BlockGroup.add_bg_from_csv(bg_filepath)
    BlockGroup.tag_bg_from_csv(bg_filepath, initial_zone_name)
    Score.score_from_csv(bg_filepath)
    Population.population_from_csv(pop_filepath)


if __name__ == "__main__":
    pass