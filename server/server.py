from flask import Flask, jsonify, make_response, send_from_directory
from flask import request
from os.path import exists, join
from bson.json_util import dumps

import mongo
from create_team import create_team
from constants import CONSTANTS

from fantasyData import team_constraints
from fantasyData import fantasy_team_data
from players_statistics import players_statistics
from fixtures_and_results import fixtures_and_results

app = Flask(__name__, static_folder='build')

###############################################################
####### ENDPOINTS - Fixtures And Results #######
###############################################################
@app.route(CONSTANTS['ENDPOINT']['ALL_FIXTURES'], methods=['POST'])
def get_all_fixtures():
    return jsonify(fixtures_and_results.get_all_fixtures())

###############################################################
####### ENDPOINTS - STATISTICS #######
###############################################################

@app.route(CONSTANTS['ENDPOINT']['PLAYERS_STATS']['TOP_SCORERS'], methods=['POST'])
def get_top_scorers():
    data = request.get_json()
    return jsonify(players_statistics.get_top_scorers_stats(data['year']))

@app.route(CONSTANTS['ENDPOINT']['PLAYERS_STATS']['MOST_ASSISTS'], methods=['POST'])
def get_most_assists():
    data = request.get_json()
    return jsonify(players_statistics.get_most_assists_stats(data['year']))

@app.route(CONSTANTS['ENDPOINT']['PLAYERS_STATS']['BEST_GOALKEEPERS'], methods=['POST'])
def get_best_goalkeepers():
    data = request.get_json()
    return jsonify(players_statistics.get_best_goalkeepers_stats(data['year']))

@app.route(CONSTANTS['ENDPOINT']['PLAYERS_STATS']['RECENT_GAMES_STATS'], methods=['POST'])
def get_recent_games_stats():
    return jsonify(players_statistics.get_recent_games_stats())

###################################
####### ENDPOINTS - MY TEAM #######
###################################

@app.route(CONSTANTS['ENDPOINT']['MY_TEAM']['GET_ULTIMATE_TEAM'])
def get_ultimate_team():
    data = mongo.find_from_collection(mongo.fantaze_data, {'data_id' : 'data'})
    ultimate_team = data[0]['ultimate_team']
    return jsonify(ultimate_team)
    # return jsonify(fantasy_team_data['ultimate_team'])


@app.route(CONSTANTS['ENDPOINT']['MY_TEAM']['SEASON_ROUND'])
def get_season_round():
    fixture_info = {}
    # fixture_info['season'] = fantasy_team_data['season']
    # fixture_info['round'] = fantasy_team_data['round']
    data = mongo.find_from_collection(mongo.fantaze_data, {'data_id' : 'data'})
    fixture_info['season'] = data[0]['season']
    fixture_info['round'] = data[0]['round']
    return jsonify(fixture_info)


@app.route(CONSTANTS['ENDPOINT']['MY_TEAM']['SEASON_ROUND'], methods = ['POST'])
def set_season_round():
    data = request.get_json()
    # fantasy_team_data['season'] = data['season']
    # fantasy_team_data['round'] = data['round']
    mongo.update_collection(mongo.fantaze_data, 'season', data['season'])
    mongo.update_collection(mongo.fantaze_data, 'round', data['round'])
    json_response = jsonify({'text': 'The season and round are set'})
    return make_response(json_response, CONSTANTS['HTTP_STATUS']['200_OK'])


@app.route(CONSTANTS['ENDPOINT']['MY_TEAM']['CALCULATE_GET_ULTIMATE_TEAM'])
def calculate_team():
    mongo.update_collection(mongo.fantaze_data, 'ultimate_team', [])
    calc_team = create_team.get_team()
    mongo.update_collection(mongo.fantaze_data, 'ultimate_team', calc_team)
    data = mongo.find_from_collection(mongo.fantaze_data, {'data_id' : 'data'})
    team = data[0]['ultimate_team']
    return jsonify(team)

    # fantasy_team_data['ultimate_team'].clear()
    # fantasy_team_data['ultimate_team'] = create_team.get_team()
    # return jsonify(fantasy_team_data['ultimate_team'])


@app.route(CONSTANTS['ENDPOINT']['MY_TEAM']['INCLUDED_AND_ELIMINATED_SELECTED_PLAYERS'])
def get_selected_players_decisions():
    mongo.update_collection(mongo.fantaze_data, 'eliminated_players', [])
    mongo.update_collection(mongo.fantaze_data, 'eliminated_players', create_team.get_eliminated_players_from_constraints())
    # fantasy_team_data['eliminated_players'] = create_team.get_eliminated_players_from_constraints()
    data = mongo.find_from_collection(mongo.fantaze_data, {'data_id' : 'data'})
    eliminated_players = data[0]['eliminated_players']
    selected_players = data[0]['player_selection']
    # selected_players = team_constraints['player_selection']
    # eliminated_players_ids = [player['player_id'] for player in fantasy_team_data['eliminated_players']]
    eliminated_players_ids = [player['player_id'] for player in eliminated_players]
    included_players = [player for player in selected_players if player['player_id'] not in eliminated_players_ids]

    res = {}
    res['included_players'] = included_players
    res['eliminated_players'] = eliminated_players
    # res['eliminated_players'] = fantasy_team_data['eliminated_players']
    return jsonify(res)

#####################################################
####### ENDPOINTS - UPDATING TEAM CONSTRAINTS #######
#####################################################

@app.route(CONSTANTS['ENDPOINT']['TEAM_CONSTRAINTS']['UPDATE'], methods = ['POST'])
def update_constraints_data():
    data = request.get_json()
    # formation update
    mongo.update_collection(mongo.fantaze_data, 'formation_pick', data['formationPickConstraint'])
    # team_constraints['formation_pick'] = data['formationPickConstraint']
    # selected players update
    mongo.update_collection(mongo.fantaze_data, 'player_selection', [])
    mongo.update_collection(mongo.fantaze_data, 'player_selection', data['playerSelectionConstraintList'])

    # team_constraints['player_selection'].clear()
    # for playerSelected in data['playerSelectionConstraintList']:
    #     team_constraints['player_selection'].insert(0, playerSelected)
    
    json_response = jsonify({'text': 'The new constraints are set'})
    return make_response(json_response, CONSTANTS['HTTP_STATUS']['201_CREATED'])
    

#############################################################
####### ENDPOINTS - TEAM CONSTRAINTS - FORMATION PICK #######
#############################################################

@app.route(CONSTANTS['ENDPOINT']['TEAM_CONSTRAINTS']['FORMATION_PICK'])
def get_formation_pick_constraint_data():
    data = mongo.find_from_collection(mongo.fantaze_data, {'data_id' : 'data'})
    formation = data[0]['formation_pick']
    return jsonify(formation)
    # return jsonify(team_constraints['formation_pick'])


@app.route(CONSTANTS['ENDPOINT']['TEAM_CONSTRAINTS']['FORMATION_PICK'] + '/<int:id>', methods=['DELETE'])
def remove_formation_pick_constraint(id):
    mongo.update_collection(mongo.fantaze_data, 'formation_pick', '')
    # team_constraints['formation_pick'] = ''
    json_response = jsonify({'text': 'The formation was deleted'})
    return make_response(json_response, CONSTANTS['HTTP_STATUS']['200_OK'])

###############################################################
####### ENDPOINTS - TEAM CONSTRAINTS - PLAYER SELECTION #######
###############################################################

@app.route(CONSTANTS['ENDPOINT']['TEAM_CONSTRAINTS']['PLAYER_SELECTION'])
def get_player_selection_constraint_data():
    data = mongo.find_from_collection(mongo.fantaze_data, {'data_id' : 'data'})
    player_selection = data[0]['player_selection']
    return jsonify(player_selection)
    # return jsonify(team_constraints['player_selection'])


@app.route(CONSTANTS['ENDPOINT']['TEAM_CONSTRAINTS']['PLAYER_SELECTION'] + '/<int:id>', methods=['DELETE'])
def remove_single_player_constraint(id):
    data = mongo.find_from_collection(mongo.fantaze_data, {'data_id' : 'data'})

    player_selection = data[0]['player_selection']
    list_players_to_remove = [player for player in player_selection if player['player_id'] == id]
    # list_players_to_remove = [player for player in team_constraints['player_selection'] if player['player_id'] == id]

    if not list_players_to_remove:
        json_response = jsonify({'error': 'Could not find a player with the given id'})
        return make_response(json_response, CONSTANTS['HTTP_STATUS']['404_NOT_FOUND'])

    if len(list_players_to_remove) > 1:
        json_response = jsonify({'error': 'More than one player found with the same id'})
        return make_response(json_response, CONSTANTS['HTTP_STATUS']['500_INTERNAL_SERVER_ERROR'])

    new_players_selection = [player for player in player_selection if player['player_id'] != id]
    mongo.update_collection(mongo.fantaze_data, 'player_selection', new_players_selection)
    # team_constraints['player_selection'] = [player for player in team_constraints['player_selection'] if player['player_id'] != id]
    json_response = jsonify({'player_id': id, 'text': 'The player was deleted'})
    return make_response(json_response, CONSTANTS['HTTP_STATUS']['200_OK'])


@app.route(CONSTANTS['ENDPOINT']['TEAM_CONSTRAINTS']['TEAM_FILTER'])
def get_all_teams():
    allTeams = mongo.find_from_collection(mongo.teams_collection, {})
    for team in allTeams:
        del team['_id']
    return jsonify(allTeams)
    # return dumps(allTeams)
    
@app.route(CONSTANTS['ENDPOINT']['MY_TEAM']['SET_DEFAULT_DATA'])
def set_default_data():
    mongo.update_collection(mongo.fantaze_data, 'season', '2019/20')
    mongo.update_collection(mongo.fantaze_data, 'round', 'Final')
    mongo.update_collection(mongo.fantaze_data, 'ultimate_team', [])
    mongo.update_collection(mongo.fantaze_data, 'eliminated_players', [])
    mongo.update_collection(mongo.fantaze_data, 'player_selection', [])
    mongo.update_collection(mongo.fantaze_data, 'formation_pick', '')
    json_response = jsonify({'text': 'The data was updated'})
    return make_response(json_response, CONSTANTS['HTTP_STATUS']['200_OK'])

@app.route(CONSTANTS['ENDPOINT']['TEAM_CONSTRAINTS']['PLAYER_FILTER'], methods = ['POST'])
def get_squad_by_team():
    data = request.get_json()
    players_by_team = mongo.find_from_collection(mongo.players_data_collection, {'team_id': { '$in' : data['teams_id'] }})
    for player in players_by_team:
        del player['_id']
    return jsonify(players_by_team)
    # return dumps(players_by_team)
    

# Catching all routes
# This route is used to serve all the routes in the frontend application after deployment.
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    file_to_serve = path if path and exists(join(app.static_folder, path)) else 'index.html'
    return send_from_directory(app.static_folder, file_to_serve)


# Error Handler
@app.errorhandler(404)
def page_not_found(error):
    json_response = jsonify({'error': 'Page not found'})
    return make_response(json_response, CONSTANTS['HTTP_STATUS']['404_NOT_FOUND'])


if __name__ == '__main__':
    app.run(port=CONSTANTS['PORT'])
