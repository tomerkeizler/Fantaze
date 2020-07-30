from pymongo import MongoClient
import collections
from flask import jsonify, Response
from bson import json_util

def get_players():
    client = MongoClient("mongodb+srv://Wolfson:Noy123123@fantasy-9amla.mongodb.net/test?retryWrites=true&w=majority")  ## USER AND PASS
    db = client["Fantasy"]
    collection = db["Players_data"]
    x = collection.find_one()

    return json_util.dumps(x)
    #return Response(json_util.dumps(x), mimetype='application/json')

HEY = get_players
