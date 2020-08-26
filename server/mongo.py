from pymongo import MongoClient

client = MongoClient("mongodb+srv://Wolfson:Noy123123@fantasy-9amla.mongodb.net/test?retryWrites=true&w=majority")  ## USER AND PASS
db = client["Fantasy"]
fixtures_collection = db["Fixtures_id"]
data_fixtures_collection = db["Data_per_fixture"]
players_data_collection = db["Players_data"]
player_performances_collection = db["Player_performances"]
teams_collection = db["Teams"]
player_season_performances = db["Player_season_performances"]
league_info = db["League_info"]


def find_from_collection(collection_name, query):
    return list(collection_name.find(query))

def get_collection(collection_name, query):
    return collection_name.find(query)
