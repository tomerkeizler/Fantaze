from pymongo import MongoClient
from pymongo import UpdateOne
import collections
from flask import jsonify, Response
from bson import json_util
from collections import OrderedDict 
import math

client = MongoClient("mongodb+srv://Wolfson:Noy123123@fantasy-9amla.mongodb.net/test?retryWrites=true&w=majority")  ## USER AND PASS
db = client["Fantasy"]
fixtures_collection = db["Fixtures_id"]
data_fixtures_collection = db["Data_per_fixture"]
players_data_collection = db["Players_data"]
player_performances_collection = db["Player_performances"]

def get_fixtures_id_by_league(league) -> list:
    fixtures = []
    result = list(fixtures_collection.find({"league": {'$in': league } } ))
    for i in range(len(result)):
        fixtures.extend(result[i]["fixtures_id"])
    return fixtures

def get_players() -> list:
    all_players = list(players_data_collection.find({}))
    return all_players

def create_players_performance_map(year, round):
    players_performances = {}
    fixtures = get_fixtures(year, round)
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

def create_player_avg_performance_map(year, round):
    player_performances = create_players_performance_map(year, round)
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

def get_possible_rounds(round):
    rounds = []
    switcher = OrderedDict([ 
        ("Group Stage - 1" , 0),
        ("Group Stage - 2" , 1),
        ("Group Stage - 3" , 2),
        ("Group Stage - 4" , 3),
        ("Group Stage - 5" , 4),
        ("Group Stage - 6" , 5),
        ("8th Finals" , 6),
        ("Quarter-finals" , 7),
        ("Semi-finals" , 8),
        ("Final" , 9)
    ])

    for level in switcher:
        rounds.append(level)

    level = switcher.get(round)
    possible_rounds = rounds[:level]
    return possible_rounds

def get_leagues(year):
    leagues = []
    switcher = OrderedDict([ 
        ("2018-19" , 132),
        ("2019-20" , 530)
    ])

    for league in switcher.values():
        leagues.append(league)

    league = switcher.get(year)
    seasons = leagues.index(league) + 1
    relevant_leagues = leagues[:seasons]
    return relevant_leagues

def get_fixtures(year, round):
    fixtures = []
    leagues_id = get_leagues(year)
    possible_round = get_possible_rounds(round)
    fixtures_data = list(data_fixtures_collection.find({"league_id": leagues_id[-1], "round": { '$in' : possible_round } }))
    for fixture_data in fixtures_data:
        fixtures.append(fixture_data["fixture_id"])
    prev_years_fixtures = get_fixtures_id_by_league(leagues_id[:len(leagues_id)-1])
    fixtures.extend(prev_years_fixtures)
    return fixtures

# fixtures = get_fixtures("2018-19", "Group Stage - 5")
# print("2019-20")