#import sys
# sys.path.insert(1, 'C:\\Users\\Noy Wolfson\\Dev\\Fantasy\\server')
#sys.path.insert(1, 'C:\\Users\\Noy Wolfson\\Dev\\Fantasy\\server\\create_team')
from server import mongo
import sample_data
from create_team import knapsack, create_team
from collections import OrderedDict 
import math
import numpy
import copy

MAX_PRICE = 15
MIN_PRICE = 3

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
    for i in range(len(all_performances)):
        if all_performances[i]["event_id"] in fixtures and all_performances[i]["player_id"] in id_players_map:
            current_player = id_players_map[all_performances[i]["player_id"]]
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

def get_chosen_players(year, round, playersId_players_map, chosen_players_id_list):
    chosen_players = []
    for id in chosen_players_id_list:
        player = playersId_players_map.get(id)
        if player is None: 
            playersId_players_map = update_id_playersData_map(playersId_players_map, id_players_map.get(id), 0)
            player = playersId_players_map.get(id)
        chosen_players.append(player)
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
    if(is_knockout(round)):
        relevant_teams = sample_data.qualified_teams_id_by_year_round[year][round]
        for id in chosen_players_id_list:
            if(id_players_map[id]["team_id"]) not in relevant_teams:
                update_id_playersData_map(id_players_map, id_players_map[id], 0)
                eliminated_players.append(id_players_map[id])
    sample_data.fantasy_team_data['eliminated_players'] = eliminated_players
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

def get_team(year, round, chosen_players_id_list, selected_formation):
    playersId_players_map = create_id_playerDataAvg_map(year, round) # this is take 15 sec!!!
    playersId_players_map = delete_eliminated_teams(year, round, playersId_players_map)
    
    chosen_players = get_chosen_players(year, round, playersId_players_map, chosen_players_id_list)
    chosen_players_price = get_price_of_chosen_players(chosen_players)
    playersId_players_map = delete_chosen_players(playersId_players_map, chosen_players)
    formation = update_formation(selected_formation, chosen_players)

    players_map_per_position = create_players_per_position_map(playersId_players_map)
    price_buckets_per_position_sorted_by_performance = create_price_buckets_per_position_sort_by_performance(players_map_per_position, 100 - chosen_players_price)
    tables = get_tables(price_buckets_per_position_sorted_by_performance, formation, 100 - chosen_players_price)
    last_table = tables[len(tables)]
    team = last_table[len(last_table) - 1] # last cell in last table
    team['players'].extend(chosen_players)
    return team['players']

id_players_map = create_id_players_map()
get_team('2018/19', 'Group Stage - 3', [154, 519], '')


