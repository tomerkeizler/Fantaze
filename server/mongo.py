from pymongo import MongoClient

client = MongoClient("mongodb+srv://Wolfson:Noy123123@fantasy-9amla.mongodb.net/test?retryWrites=true&w=majority")  ## USER AND PASS
db = client["Fantasy"]
fixtures_collection = db["Fixtures_id"]
data_fixtures_collection = db["Data_per_fixture"]
players_data_collection = db["Players_data"]
player_performances_collection = db["Player_performances"]
teams_collection = db["Teams"]
player_season_performances_collection = db["Player_season_performances"]
league_info_collection = db["League_info"]
players_recent_games_performances_collection = db["Players_recent_games_performances"]
fantaze_data = db['Fantaze_data']

DATA_ID = 'data'

def find_from_collection(collection_name, query):
    return list(collection_name.find(query))

def get_collection(collection_name, query):
    return collection_name.find(query)

def update_collection(collection_name, field, value):
    return list(collection_name.update(
            {'data_id': DATA_ID } , 
            {'$set' : { field : value }}
        ))