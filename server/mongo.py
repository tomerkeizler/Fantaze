from pymongo import MongoClient
import collections
from flask import jsonify, Response
from bson import json_util

def get_final_team():
    client = MongoClient("mongodb+srv://Wolfson:Noy123123@fantasy-9amla.mongodb.net/test?retryWrites=true&w=majority")  ## USER AND PASS
    db = client["Fantasy"]
    collection = db["Players_data"]
    single_player = collection.find({"player_id" : 1100})

    team_players = []
    for i in range(0,11):
        team_players.append(single_player[0])
    team_players = json_util.dumps(team_players)

    return team_players
