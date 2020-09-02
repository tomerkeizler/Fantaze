#import sys
# sys.path.insert(1, 'C:\\Users\\Noy Wolfson\\Dev\\Fantasy\\server')
#sys.path.insert(1, 'C:\\Users\\Noy Wolfson\\Dev\\Fantasy\\server\\create_team')
from server import mongo
import sample_data
from create_team import knapsack, create_team
from collections import OrderedDict 
import math

def convert_performances_list_to_avg(id_playerData_map):
    for player_id, player in id_playerData_map.items():
        sum = 0
        for score in player["performance"]:
            sum += score
        avg = int(math.floor(sum / len(player["performance"])))
        player["performance"] = avg
    return id_playerData_map

def update_id_playersData_map(id_playersData_map, current_player, performances):
    player_id = current_player["player_id"]
    id_playersData_map[player_id] = {
                                    "player_id" : player_id,
                                    "player_name" : current_player["player_name"],
                                    "price" : current_player["price"],
                                    "performance" : performances,
                                    "position" : current_player["position"],
                                    "team_id" : current_player["team_id"],
                                    "team_name" : current_player["team_name"]
                                    }
    return id_playersData_map

def get_all_players():
    all_players = mongo.find_from_collection(mongo.players_data_collection, {})
    return all_players

def create_id_players_map():
    players_map = {}
    all_players = get_all_players()
    for player in all_players:
        players_map[player["player_id"]] = player
    return players_map
    
def get_fixtures_id_by_league(league) -> list:
    fixtures = []
    result = list(mongo.find_from_collection(mongo.fixtures_collection, {"league": {'$in': league } } ))
    for i in range(len(result)):
        fixtures.extend(result[i]["fixtures_id"])
    return fixtures

def get_leagues(year):
    leagues = []
    switcher = OrderedDict([ 
        ("2018/19" , 132),
        ("2019/20" , 530)
    ])

    for league in switcher.values():
        leagues.append(league)

    league = switcher.get(year)
    seasons = leagues.index(league) + 1
    relevant_leagues = leagues[:seasons]
    return relevant_leagues

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

def get_fixtures(year, round):
    fixtures = []
    leagues_id = get_leagues(year)
    possible_round = get_possible_rounds(round)
    fixtures_data = mongo.find_from_collection(mongo.data_fixtures_collection, {"league_id": leagues_id[-1], "round": { '$in' : possible_round } })
    for fixture_data in fixtures_data:
        fixtures.append(fixture_data["fixture_id"])
    prev_years_fixtures = get_fixtures_id_by_league(leagues_id[:len(leagues_id)-1])
    fixtures.extend(prev_years_fixtures)
    return fixtures

def create_id_playerData_map(year, round):
    id_playersData_map = {}
    fixtures = get_fixtures(year, round)
    all_performances = mongo.find_from_collection(mongo.player_performances_collection, {})
    players_map = create_id_players_map()
    for i in range(len(all_performances)):
        if all_performances[i]["event_id"] in fixtures and all_performances[i]["player_id"] in players_map:
            current_player = players_map[all_performances[i]["player_id"]]
            if current_player["price"] != 0:
                player_id = current_player["player_id"]
                performances = []
                if player_id in id_playersData_map:
                    performances = (id_playersData_map.get(player_id))["performance"]
                performances.append(all_performances[i]["performance"])
                update_id_playersData_map(id_playersData_map, current_player, performances)
    return id_playersData_map

def create_id_playerDataAvg_map(year, round):
    id_playerData_map = create_id_playerData_map(year, round)
    id_playerData_avg_performances = convert_performances_list_to_avg(id_playerData_map)
    return id_playerData_avg_performances

def get_id_player_map(year, round):
    players = create_id_playerDataAvg_map(year, round)
    return players

def get_price_of_chosen_players(chosen_players):
    price = 0
    for player in chosen_players:
        price += player["price"]
    return price

def is_knockout(round):
    perv_rounds = get_possible_rounds(round)
    return len(perv_rounds) > 5

def get_chosen_players(year, round, playersId_players_map, chosen_players_id_list):
    chosen_players = []
    for id in chosen_players_id_list:
        player = playersId_players_map.get(id)
        if player is not None:
            chosen_players.append(player)
            # if is_knockout(round):
            #     relevant_teams = sample_data.qualified_teams_id_by_year_round[year][round]
            #     if player["team_id"] in relevant_teams: 
            #         chosen_players.append(player)
            # else:
            # chosen_players.append(player)
    return chosen_players

def delete_chosen_players(playersId_players_map, chosen_players):
    for player in chosen_players:
        playersId_players_map.pop(player['player_id'], None)
    return playersId_players_map

def delete_eliminated_teams(year, round, playersId_players_map):
    if(is_knockout(round)):
        relevant_teams = sample_data.qualified_teams_id_by_year_round[year][round]
        for playerId in list(playersId_players_map):
            if playersId_players_map[playerId]["team_id"] not in relevant_teams:
                del playersId_players_map[playerId]
    return playersId_players_map

def get_eliminated_players_from_constraints(year, round, chosen_players_id_list):
    eliminated_players = []
    id_players_map = create_id_players_map()
    if(is_knockout(round)):
        relevant_teams = sample_data.qualified_teams_id_by_year_round[year][round]
        for id in chosen_players_id_list:
            if(id_players_map[id]["team_id"]) not in relevant_teams:
                update_id_playersData_map(id_players_map, id_players_map[id], 0)
                eliminated_players.append(id_players_map[id])
    sample_data.fantasy_team_data['eliminated_players'] = eliminated_players
    return eliminated_players

def get_used_players(year, round, chosen_players_id_list):
    playersId_players_map = get_id_player_map(year, round)
    playersId_players_map = delete_eliminated_teams(year, round, playersId_players_map)
    
    chosen_players = get_chosen_players(year, round, playersId_players_map, chosen_players_id_list)
    chosen_players_price = get_price_of_chosen_players(chosen_players)
    playersId_players_map = delete_chosen_players(playersId_players_map, chosen_players)

    players = list(playersId_players_map.values())
    final_matrix = create_team.knapsack.dynamic_program_knapsack(100 - chosen_players_price, playersId_players_map, 11 - len(chosen_players))
    used_indexes = create_team.knapsack.get_used_indexes(100 - chosen_players_price, playersId_players_map, 11 - len(chosen_players), final_matrix)
    fantasy_league = []
    for i in range(len(used_indexes)):
        if used_indexes[i] == 1:
            fantasy_league.append(players[i])
    fantasy_league.extend(chosen_players)
    return fantasy_league

# get_used_players('2019/20', 'Final', [154])
# ===========================================
# ===========================================
# ===========================================


def filter_by_position(position, id_player_map):
    filtered_map = {}
    for id, player in id_player_map.items():
        if player["position"] == position:
            filtered_map[id] = player
    return filtered_map

def get_team(year, round, formation, chosen_players_id_list):
    playersId_players_map = get_id_player_map(year, round)
    playersId_players_map = delete_eliminated_teams(year, round, playersId_players_map)
    
    Goalkeeper_map = filter_by_position("Goalkeeper", playersId_players_map)
    Attacker_map = filter_by_position("Attacker", playersId_players_map)
    Midfielder_map = filter_by_position("Midfielder", playersId_players_map)
    Defender_map = filter_by_position("Defender", playersId_players_map)


