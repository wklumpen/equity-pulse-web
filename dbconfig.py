from peewee import SqliteDatabase, MySQLDatabase

DEBUG = False
HOST = "wklumpen.mysql.pythonanywhere-services.com"
USERNAME = "wklumpen"
PWORD = "Justin!1"
DBNAME = "wklumpen$tcdemo"

# database = MySQLDatabase(DBNAME, host=HOST, port=3306, user=USERNAME, passwd=PWORD)
database = SqliteDatabase(r'results.db') # Temporary sqlite DB instance