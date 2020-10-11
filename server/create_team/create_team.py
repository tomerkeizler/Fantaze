from server import mongo
from fantasyData import qualified_teams_id_by_year_round
from fantasyData import team_constraints
from fantasyData import fantasy_team_data
from create_team import create_team
from collections import OrderedDict 
import math
import numpy
import copy

MAX_PRICE = 15
MIN_PRICE = 3

def convert_performances_list_to_avg(id_playerData_map):
    for player in id_playerData_map.values(): #.items(): 
        avg_performance = int(math.floor(sum(player['performance']) / len(player["performance"])))
        player["performance"] = avg_performance
        player['minutes_played'] = sum(player['minutes_played']) / len (player['minutes_played'])
        player['passes_accuracy'] = sum(player['passes_accuracy']) / len(player['passes_accuracy'])
    return id_playerData_map

def update_fields(id_playersData_map, performances_details):
    player_id = performances_details["player_id"]
    id_playersData_map[player_id]['performance'].append(performances_details['performance'])
    id_playersData_map[player_id]['startXI'] += performances_details['startXI']
    id_playersData_map[player_id]['substitute'] += performances_details['startXI'] == False and performances_details['minutes_played'] > 0 
    id_playersData_map[player_id]['goals'] += performances_details['goals']['total']
    id_playersData_map[player_id]['assists'] += performances_details['goals']['assists'] 
    id_playersData_map[player_id]['yellow'] += performances_details['cards']['yellow'] 
    id_playersData_map[player_id]['red'] += performances_details['cards']['red'] 
    id_playersData_map[player_id]['minutes_played'].append(performances_details['minutes_played']) 
    id_playersData_map[player_id]['passes_accuracy'].append(performances_details['passes']['accuracy'])
    if id_playersData_map[player_id].get('conceded') is not None:
        id_playersData_map[player_id]['conceded'] += performances_details['goals']['conceded']
    return id_playersData_map

def get_player_struct(current_player):
    player_struct = {
        "player_id" : current_player["player_id"],
        "player_name" : current_player["player_name"],
        "price" : current_player["price"],
        "performance" : [],
        "position" : current_player["position"],
        "team_id" : current_player["team_id"],
        "team_name" : current_player["team_name"],
        'startXI' : 0,
        'substitute': 0,
        'goals': 0, 
        'assists': 0,  
        'yellow': 0,
        'red': 0,
        'minutes_played': [],
        'passes_accuracy': []
    }
    if current_player['position'] == "Goalkeeper" or current_player['position'] == "Defender":
        player_struct['conceded'] = 0
    return player_struct

def update_id_playersData_map(id_playersData_map, current_player, performances_details):
    player_id = current_player["player_id"]
    if player_id not in id_playersData_map:
        id_playersData_map[player_id] = get_player_struct(current_player)
    update_fields(id_playersData_map, performances_details)
    return id_playersData_map

def create_id_players_map():
    players_map = {}
    # all_players = mongo.find_from_collection(mongo.players_data_collection, {})
    for player in all_players:
        players_map[player["player_id"]] = player
    return players_map

def get_leagues(season):
    leagues = []
    switcher = OrderedDict([ 
        ("2018/19" , 132),
        ("2019/20" , 530)
    ])

    for league in switcher.values():
        leagues.append(league)

    league = switcher.get(season)
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

def get_fixtures(season, round):
    fixtures = []
    leagues_id = get_leagues(season)
    possible_round = get_possible_rounds(round)
    for fixture_data in all_fixtures_data:
        if (fixture_data['league_id'] == leagues_id[-1] and fixture_data['round'] in possible_round) or (fixture_data['league_id'] in leagues_id[:len(leagues_id)-1]):
            fixtures.append(fixture_data["fixture_id"])
    return fixtures

def create_id_playerData_map(season, round):
    id_playersData_map = {}
    fixtures = get_fixtures(season, round)
    for i in range(len(all_performances)):
        if all_performances[i]["event_id"] in fixtures and all_performances[i]["player_id"] in id_players_map:
            current_player = id_players_map[all_performances[i]["player_id"]]
            if current_player["price"] != 0:
                update_id_playersData_map(id_playersData_map, current_player, all_performances[i])
    return id_playersData_map

def create_id_playerDataAvg_map(season, round):
    id_playerData_map = create_id_playerData_map(season, round)
    id_playerData_avg_performances = convert_performances_list_to_avg(id_playerData_map)
    return id_playerData_avg_performances

def update_formation(formation, chosen_players):
    updated_formation = {
        'Goalkeeper' : 1,
        'Defender' : 4,
        'Midfielder' : 3,
        'Attacker' : 3
    }
    if(formation != ''):
        updated_formation['Defender'] = int(formation[0])
        updated_formation['Midfielder'] = int(formation[2])
        updated_formation['Attacker'] = int(formation[4])

    for player in chosen_players:
        updated_formation[player['position']] -= 1
    return updated_formation

def get_price_of_chosen_players(chosen_players):
    price = 0
    for player in chosen_players:
        price += player["price"]
    return price

def is_knockout(round):
    perv_rounds = get_possible_rounds(round)
    return len(perv_rounds) > 5

def is_eliminated(player_id):
    eliminated_players = get_eliminated_players_from_constraints()
    for player in eliminated_players:
        if player_id == player['player_id']:
            return True
    return False

def get_chosen_players(playersId_players_map, chosen_players_id_list):
    chosen_players = []
    for id in chosen_players_id_list:
        if not is_eliminated(id):
            player = playersId_players_map.get(id)
            if player is None: 
                player_struct = get_player_struct(id_players_map[id])
                player_struct['performance'] = 0
                player = player_struct
            chosen_players.append(player)
    return chosen_players

def delete_chosen_players(playersId_players_map, chosen_players):
    for player in chosen_players:
        playersId_players_map.pop(player['player_id'], None)
    return playersId_players_map

def delete_eliminated_teams(season, round, playersId_players_map):
    if(is_knockout(round)):
        relevant_teams = qualified_teams_id_by_year_round[season][round]
        for playerId in list(playersId_players_map):
            if playersId_players_map[playerId]["team_id"] not in relevant_teams:
                del playersId_players_map[playerId]
    return playersId_players_map

def get_eliminated_players_from_constraints():
    # season = fantasy_team_data['season']
    # round = fantasy_team_data['round']
    data = mongo.find_from_collection(mongo.fantaze_data, {})
    season = data[0]['season']
    round = data[0]['round']
    player_selection = data[0]['player_selection']
    chosen_players_id_list = [player['player_id'] for player in player_selection]
    # chosen_players_id_list = [player['player_id'] for player in team_constraints['player_selection']]
    
    eliminated_players = []
    if(is_knockout(round)):
        relevant_teams = qualified_teams_id_by_year_round[season][round]
        for id in chosen_players_id_list:
            if(id_players_map[id]["team_id"]) not in relevant_teams:
                player_struct = get_player_struct(id_players_map[id])
                player_struct['performance'] = 0
                eliminated_players.append(player_struct)
    mongo.update_collection(mongo.fantaze_data, 'eliminated_players', eliminated_players)
    # fantasy_team_data['eliminated_players'] = eliminated_players
    return eliminated_players

def filter_by_position(position, id_player_map):
    filtered_map = {}
    for id, player in id_player_map.items():
        if player["position"] == position:
            filtered_map[id] = player
    return filtered_map

def create_players_per_position_map(playersId_players_map):
    position_players_map = {}
    position_players_map['Goalkeeper'] = filter_by_position("Goalkeeper", playersId_players_map)
    position_players_map['Attacker'] = filter_by_position("Attacker", playersId_players_map)
    position_players_map['Midfielder'] = filter_by_position("Midfielder", playersId_players_map)
    position_players_map['Defender'] = filter_by_position("Defender", playersId_players_map)
    return position_players_map

def create_price_buckets_per_position_sort_by_performance(players_map_per_position, price):
    price_buckets_map_sort_by_performance = {}
    for key in players_map_per_position.keys():
        price_buckets_map_sort_by_performance[key] = []
        for i in range(MAX_PRICE + 1):
            price_buckets_map_sort_by_performance[key].append([])
        for player in players_map_per_position[key].values():
            price_buckets_map_sort_by_performance[key][player['price']].append(player)
        for i in range(MAX_PRICE + 1):
            price_buckets_map_sort_by_performance[key][i] = sorted(price_buckets_map_sort_by_performance[key][i], key=lambda x: x['performance'], reverse=True)
    return price_buckets_map_sort_by_performance

def get_best_player_for_price(price_buckets_sorted_by_performance, rest_team, price):
    if price > MAX_PRICE: 
        price = MAX_PRICE
    best_player = None
    best_performance = 0
    performance = 0
    for i in range(MIN_PRICE, price + 1):
        if price_buckets_sorted_by_performance[i]:
            index = 0
            player = price_buckets_sorted_by_performance[i][index]
            while rest_team != 0 and rest_team != {} and player in rest_team['players']:
                index += 1
                if index < len(price_buckets_sorted_by_performance[i]):
                    player = price_buckets_sorted_by_performance[i][index]
                else: 
                    player = None
            if player != None:
                performance = player['performance']
                if performance > best_performance:
                    best_performance = performance
                    best_player = player
    return best_player

def is_smaller_team_size(rest_team, table_number):
    is_smaller = False
    if rest_team == 0:
        is_smaller = True
    elif len(rest_team['players']) != (table_number - 1):
        is_smaller = True
    return is_smaller 

def create_table(price_buckets_sorted_by_performance, prev_table ,price, table_number):
    table = [0] * (price + 1)
    if prev_table == None: # first table 
        for i in range(1, len(table)):
            best_player_for_price = get_best_player_for_price(price_buckets_sorted_by_performance, {}, i)
            if best_player_for_price:
                table[i] = update_table_cell(None, best_player_for_price)
    else: # rest tables
        for i in range(1, len(table)):
            for j in range(1, i):
                rest_team = prev_table[i-j]
                best_player_for_price = get_best_player_for_price(price_buckets_sorted_by_performance, rest_team, j)
                if best_player_for_price:
                    if not is_smaller_team_size(rest_team, table_number):
                        new_team = copy.deepcopy(rest_team)
                        if table[i] == 0:
                            table[i] = update_table_cell(new_team, best_player_for_price)
                        else:
                            if is_new_greater_then_prev(table[i], best_player_for_price, rest_team):
                                table[i] = update_table_cell(new_team, best_player_for_price)
    return table

def is_new_greater_then_prev(current_team, best_player_for_price, rest_team):
    current_performance = current_team['performance']
    new_performance = best_player_for_price['performance'] + rest_team['performance']
    return new_performance > current_performance

def update_table_cell(new_team, best_player_for_price):
    if new_team == None:
        new_team = {
            'players': [],
            'performance' : 0
        }
    new_team['players'].append(best_player_for_price)
    cell = { 'players' : new_team['players'], 
                'performance' : best_player_for_price['performance'] + new_team['performance']
                }
    return cell

def calc_positions_order(formation):
    position_order_table = {}
    for key in formation.keys():
        for i in range(formation[key]):
            position_order_table[len(position_order_table) + 1] = key
    return position_order_table

def get_tables(price_buckets_per_position_sorted_by_performance, formation, price):
    tables = {}
    positions_order = calc_positions_order(formation)
    for i in range(1, len(positions_order) + 1):
        current_position = positions_order[i]
        price_buckets_current_position_players = price_buckets_per_position_sorted_by_performance[current_position]
        tables[i] = create_table(price_buckets_current_position_players, tables.get(len(tables)), price, i)
    return tables

def get_team_from_tables(tables):
    team = {'players': [] }
    if len(tables) != 0:
        last_table = tables[len(tables)]
        if last_table[len(last_table) - 1] != 0:
            team = last_table[len(last_table) - 1] # last cell in last table
    return team

def get_team():
    # season = fantasy_team_data['season']
    # round = fantasy_team_data['round']
    data = mongo.find_from_collection(mongo.fantaze_data, {})
    season = data[0]['season']
    round = data[0]['round']
    player_selection = data[0]['player_selection']
    chosen_players_id_list = [player['player_id'] for player in player_selection]
    # chosen_players_id_list = [player['player_id'] for player in team_constraints['player_selection']]
    selected_formation = data[0]['formation_pick']
    # selected_formation = team_constraints['formation_pick']

    playersId_players_map = create_id_playerDataAvg_map(season, round)
    playersId_players_map = delete_eliminated_teams(season, round, playersId_players_map)
    
    chosen_players = get_chosen_players(playersId_players_map, chosen_players_id_list)
    chosen_players_price = get_price_of_chosen_players(chosen_players)
    playersId_players_map = delete_chosen_players(playersId_players_map, chosen_players)
    formation = update_formation(selected_formation, chosen_players)

    players_map_per_position = create_players_per_position_map(playersId_players_map)
    price_buckets_per_position_sorted_by_performance = create_price_buckets_per_position_sort_by_performance(players_map_per_position, 100 - chosen_players_price)
    tables = get_tables(price_buckets_per_position_sorted_by_performance, formation, 100 - chosen_players_price)
    team = get_team_from_tables(tables)
    team['players'].extend(chosen_players)
    return team['players']


all_fixtures_data = mongo.find_from_collection(mongo.data_fixtures_collection, {})
all_performances = mongo.find_from_collection(mongo.player_performances_collection, {})
all_players = mongo.find_from_collection(mongo.players_data_collection, {})
id_players_map = create_id_players_map()
# get_team()
