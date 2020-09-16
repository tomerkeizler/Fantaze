from server import mongo


def get_all_fixtures():
    # print("_______________________")
    fixtures_data = mongo.find_from_collection(mongo.data_fixtures_collection, {})
    for d in fixtures_data:
        d['_id'] = d['fixture_id']

    team_and_fixtures = [get_all_teams(), fixtures_data]

    return team_and_fixtures


def get_all_teams():
    teams_info = mongo.get_collection(mongo.teams_collection, {})
    teams = []
    for team in teams_info.__copy__():
        teams.append({"team_id": team['team_id'], "team_name": team['team_name']})

    return teams
