from pymongo import MongoClient
from pymongo import UpdateOne
import collections
from flask import jsonify, Response
from bson import json_util
import math

client = MongoClient("mongodb+srv://Wolfson:Noy123123@fantasy-9amla.mongodb.net/test?retryWrites=true&w=majority")  ## USER AND PASS
db = client["Fantasy"]
fixtures_collection = db["Fixtures_id"]
players_data_collection = db["Players_data"]
player_performances_collection = db["Player_performances"]

def get_2018_19_fixtures_id() -> list:
    fixtures = fixtures_collection.find({"league": 132})
    return fixtures[0]['fixtures_id']

def get_players() -> list:
    all_players = list(players_data_collection.find({}))
    return all_players

def create_players_performance_map():
    players_performances = {}
    fixtures = get_2018_19_fixtures_id()
    all_performances = list(player_performances_collection.find({}))
    players_map = create_players_map()
    for i in range(len(all_performances)):
        if all_performances[i]["event_id"] in fixtures and all_performances[i]["player_id"] in players_map:
            current_player = players_map[all_performances[i]["player_id"]]
            if current_player["price"] != 0:
                player_id = int(current_player["player_id"])
                performances = []
                if player_id in players_performances:
                    performances = (players_performances.get(player_id))["performance"]
                performances.append(all_performances[i]["performance"])
                players_performances[player_id] = {
                                                    "player_id" : player_id,
                                                    "player_name" : current_player["player_name"],
                                                    "price" : int(current_player["price"]),
                                                    "performance" : performances,
                                                    "position" : current_player["position"],
                                                    "team_id" : int(all_performances[i]["team_id"]),
                                                    "team_name" : all_performances[i]["team_name"]
                                                  }
    return players_performances


def create_player_avg_performance_map():
    player_performances = create_players_performance_map()
    for player_id, player in player_performances.items():
        sum = 0
        for score in player["performance"]:
            sum += score
        avg = int(math.floor(sum / len(player["performance"])))
        player["performance"] = avg
    return player_performances

def create_players_map():
    players_map = {}
    players = get_players()
    for player in players:
        players_map[int(player["player_id"])] = player
    return players_map


def get_fixtuers_by_time(month, year):
    switcher = {
        2017: [52, 31],    #also games from 2016-17(52) && 2017-18(31) are here 
        2018: [31, 132],    #also games from 2017-2018(31) && 2018-19(132) are here
        2019: [132, 530],    #also games from 2018-2019(132)  && 2019-2020(530) are here
        2020: [530, 530]    #also games from 2019-2020(530) are here
    }
    leagues = switcher.get(year)
    # fixtures = fixtures_collection.find({"league": {"$gt": leagues[0] })

# get_fixtuers_by_time(2, 2019)
