from flask import Flask, jsonify, make_response, send_from_directory
from flask import request
from os.path import exists, join
from bson.json_util import dumps

import mongo
from create_team import create_team
from constants import CONSTANTS
from sample_data import sample_data
from sample_data import team_constraints
from sample_data import fantasy_team_data

app = Flask(__name__, static_folder='build')

###################################
####### ENDPOINTS - MY TEAM #######
###################################

@app.route(CONSTANTS['ENDPOINT']['MY_TEAM']['GET_ULTIMATE_TEAM'])
def get_ultimate_team():
    return jsonify(fantasy_team_data['ultimate_team'])


@app.route(CONSTANTS['ENDPOINT']['MY_TEAM']['CALCULATE_ULTIMATE_TEAM'], methods = ['POST'])
def calculate_team():
    fantasy_team_data['ultimate_team'].clear()
    data = request.get_json()
    list_player_id = [player['player_id'] for player in team_constraints['player_selection']]
    # for player in team_constraints['player_selection']:
    #     list_player_id.insert(0, player['player_id'])
    fantasy_league = create_team.get_used_players(data['season'], data['round'], list_player_id)
    fantasy_team_data['ultimate_team'] = fantasy_league

    # json_response = jsonify({'text': 'The ultimate team is ready'})
    # return make_response(json_response, CONSTANTS['HTTP_STATUS']['200_OK'])
    return jsonify(fantasy_team_data['ultimate_team'])


@app.route(CONSTANTS['ENDPOINT']['MY_TEAM']['ELIMINATED_PLAYERS'], methods = ['POST'])
def get_eliminated_players():
    data = request.get_json()
    list_player_id = [player['player_id'] for player in team_constraints['player_selection']]
    fantasy_team_data['eliminated_players'] = create_team.get_eliminated_players_from_constraints(data['season'], data['round'], list_player_id)
    return jsonify(fantasy_team_data['eliminated_players'])

#####################################################
####### ENDPOINTS - UPDATING TEAM CONSTRAINTS #######
#####################################################

@app.route(CONSTANTS['ENDPOINT']['TEAM_CONSTRAINTS']['UPDATE'], methods = ['POST'])
def update_constraints_data():
    data = request.get_json()
    # formation update
    team_constraints['formation_pick'] = data['formationPickConstraint']
    # selected players update
    team_constraints['player_selection'].clear()
    for playerSelected in data['playerSelectionConstraintList']:
        team_constraints['player_selection'].insert(0, playerSelected)
    return make_response('', CONSTANTS['HTTP_STATUS']['201_CREATED'])
    

#############################################################
####### ENDPOINTS - TEAM CONSTRAINTS - FORMATION PICK #######
#############################################################

@app.route(CONSTANTS['ENDPOINT']['TEAM_CONSTRAINTS']['FORMATION_PICK'])
def get_formation_pick_constraint_data():
    return jsonify(team_constraints['formation_pick'])


@app.route(CONSTANTS['ENDPOINT']['TEAM_CONSTRAINTS']['FORMATION_PICK'] + '/<int:id>', methods=['DELETE'])
def remove_formation_pick_constraint(id):
    team_constraints['formation_pick'] = ''
    json_response = jsonify({'text': 'The formation was deleted'})
    return make_response(json_response, CONSTANTS['HTTP_STATUS']['200_OK'])

###############################################################
####### ENDPOINTS - TEAM CONSTRAINTS - PLAYER SELECTION #######
###############################################################

@app.route(CONSTANTS['ENDPOINT']['TEAM_CONSTRAINTS']['PLAYER_SELECTION'])
def get_player_selection_constraint_data():
    return jsonify(team_constraints['player_selection'])


@app.route(CONSTANTS['ENDPOINT']['TEAM_CONSTRAINTS']['PLAYER_SELECTION'] + '/<int:id>', methods=['DELETE'])
def remove_single_player_constraint(id):
    list_players_to_remove = [player for player in team_constraints['player_selection'] if player['player_id'] == id]

    if not list_players_to_remove:
        json_response = jsonify({'error': 'Could not find a player with the given id'})
        return make_response(json_response, CONSTANTS['HTTP_STATUS']['404_NOT_FOUND'])

    if len(list_players_to_remove) > 1:
        json_response = jsonify({'error': 'More than one player found with the same id'})
        return make_response(json_response, CONSTANTS['HTTP_STATUS']['500_INTERNAL_SERVER_ERROR'])

    team_constraints['player_selection'] = [player for player in team_constraints['player_selection'] if player['player_id'] != id]
    json_response = jsonify({'player_id': id, 'text': 'The player was deleted'})
    return make_response(json_response, CONSTANTS['HTTP_STATUS']['200_OK'])


@app.route(CONSTANTS['ENDPOINT']['TEAM_CONSTRAINTS']['TEAM_FILTER'])
def get_all_teams():
    allTeams = mongo.find_from_collection(mongo.teams_collection, {})
    for team in allTeams:
        del team['_id']
    return jsonify(allTeams)
    # return dumps(allTeams)
    

@app.route(CONSTANTS['ENDPOINT']['TEAM_CONSTRAINTS']['PLAYER_FILTER'], methods = ['POST'])
def get_squad_by_team():
    data = request.get_json()
    players_by_team = mongo.find_from_collection(mongo.players_data_collection, {'team_id': { '$in' : data['teams_id'] }})
    for player in players_by_team:
        del player['_id']
    return jsonify(players_by_team)
    # return dumps(players_by_team)

#######################
####### GENERAL #######
#######################

# MasterDetail Page Endpoint
@app.route(CONSTANTS['ENDPOINT']['MASTER_DETAIL'])
def get_master_detail():
    return jsonify(sample_data['text_assets'])


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
