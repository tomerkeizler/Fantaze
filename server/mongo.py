from pymongo import MongoClient
from pymongo import UpdateOne
import collections
from flask import jsonify, Response
from bson import json_util
import math

class Player:
    def __init__(self, player_id, player_name, price, performance, position, team_id, team_name):
        self.player_id = player_id
        self.player_name = player_name
        self.price = price
        self.performance = performance
        self.position = position
        self.team_id = team_id
        self.team_name = team_name


client = MongoClient("mongodb+srv://Wolfson:Noy123123@fantasy-9amla.mongodb.net/test?retryWrites=true&w=majority")  ## USER AND PASS
db = client["Fantasy"]
players_collection = db["Players_data"]
fixtures_collection = db["Fixtures_id"]
players_data_collection = db["Players_data"]
player_performances_collection = db["Player_performances"]

def get_2018_19_fixtures_id() -> list:
    fixtures = fixtures_collection.find({"league": 132})
    return fixtures[0]['fixtures_id']

def get_players() -> list:
    all_players = list(players_data_collection.find({})) # few seconds
    return all_players

def create_players_performance_map():
    players_performances = {}
    fixtures = get_2018_19_fixtures_id()
    all_performances = list(player_performances_collection.find({})) # few seconds
    # relevant_performances = get_relevant(all_performances, fixtures)
    for i in range(len(all_performances)):
        if all_performances[i]["event_id"] in fixtures:
            current_player = list(players_data_collection.find({"player_id" : all_performances[i]["player_id"]}))
            if(len(current_player) != 0) and current_player[0]["price"] != 0:
                player_id = int(current_player[0]["player_id"])
                performances = []
                if player_id in players_performances:
                    performances = (players_performances.get(player_id)).performance
                performances.append(all_performances[i]["performance"])
                players_performances[player_id] = Player(player_id, current_player[0]["player_name"], int(current_player[0]["price"]), performances, current_player[0]["position"], int(all_performances[i]["team_id"]), all_performances[i]["team_name"])
    return players_performances


def create_player_avg_performance_map():
    player_performances = create_players_performance_map()
    for player_id, player in player_performances.items():
        sum = 0
        for score in player.performance:
            sum += score
        avg = int(math.floor(sum / len(player.performance)))
        player.performance = avg
    return player_performances

create_player_avg_performance_map()

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
print("bye")