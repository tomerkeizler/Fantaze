from flask import Flask, jsonify, make_response, send_from_directory
from flask import request
from os.path import exists, join
from bson.json_util import dumps

import mongo
from create_team import create_team
from constants import CONSTANTS
from sample_data import sample_data


app = Flask(__name__, static_folder='build')


# MasterDetail Page Endpoint
@app.route(CONSTANTS['ENDPOINT']['MASTER_DETAIL'])
def get_master_detail():
    return jsonify(sample_data['text_assets'])


# List Endpoints
@app.route(CONSTANTS['ENDPOINT']['LIST'])
def get_list():
    return jsonify(sample_data['list_text_assets']['list_items'])


@app.route(CONSTANTS['ENDPOINT']['LIST'], methods = ['POST'])
def add_list_item():
    data = request.get_json()
    list_item = {'_id': sample_data['list_text_assets']['list_id'], 'text': data['text']}
    sample_data['list_text_assets']['list_items'].insert(0, list_item)
    sample_data['list_text_assets']['list_id'] += 1
    json_response = jsonify(list_item)
    return make_response(json_response, CONSTANTS['HTTP_STATUS']['201_CREATED'])


@app.route(CONSTANTS['ENDPOINT']['LIST'] + '/<int:id>', methods=['DELETE'])
def delete_list_item(id):
    list_items_to_remove = [list_item for list_item in sample_data['list_text_assets']['list_items'] if list_item['_id'] == id]
    if not list_items_to_remove:
        json_response = jsonify({'error': 'Could not find an item with the given id'})
        return make_response(json_response, CONSTANTS['HTTP_STATUS']['404_NOT_FOUND'])
    if len(list_items_to_remove) > 1:
        json_response = jsonify({'error': 'More than one list items found with the same id'})
        return make_response(json_response, CONSTANTS['HTTP_STATUS']['500_INTERNAL_SERVER_ERROR'])
    sample_data['list_text_assets']['list_items'] = [list_item for list_item in sample_data['list_text_assets']['list_items'] if list_item['_id'] != id]
    return jsonify({'_id': id, 'text': 'This comment was deleted'})


# My Team Page Endpoint
@app.route(CONSTANTS['ENDPOINT']['MY_TEAM'], methods = ['POST'])
def get_final_team():
    data = request.get_json()
    return jsonify(create_team.get_used_players(data['year'], data['round']))


@app.route(CONSTANTS['ENDPOINT']['TEAM_FILTER'])
def get_all_teams():
    teams = mongo.find_from_collection(mongo.teams_collection, {})
    return dumps(teams)
    

@app.route(CONSTANTS['ENDPOINT']['PLAYER_FILTER'], methods = ['POST'])
def get_squad_by_team():
    data = request.get_json()
    players_by_team = mongo.find_from_collection(mongo.players_data_collection, {'team_id': data['team_id']})
    return dumps(players_by_team)


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
