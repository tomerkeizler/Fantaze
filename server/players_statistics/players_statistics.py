from server import mongo
import json


def get_top_scorers_stats(year):
    all_players_stats = get_all_season_players_stats(year)  # work
    players_statistics = []
    players_statistics.append(get_all_teams_in_season(year))
    players_statistics.append(get_top_scorers(all_players_stats.__copy__()))
    return players_statistics


def get_most_assists_stats(year):
    all_players_stats = get_all_season_players_stats(year)  # work
    players_statistics = []
    players_statistics.append(get_all_teams_in_season(year))
    players_statistics.append(get_most_assists(all_players_stats.__copy__()))
    return players_statistics

def get_best_goalkeepers_stats(year):
    all_players_stats = get_all_season_players_stats(year)  # work
    players_statistics = []
    players_statistics.append(get_all_teams_in_season(year))
    players_statistics.append(get_best_goalkeepers(all_players_stats.__copy__()))
    return players_statistics


def get_recent_games_stats():
    # all_players_stats = get_all_season_players_stats(year)  # work
    players_statistics = []
    # players_statistics.append(get_all_teams_in_season(year))
    players_statistics.append(get_all_teams())
    players_statistics.append(list(mongo.get_collection(mongo.players_recent_games_performances_collection, {})))
    return players_statistics


def get_players_statistics(year):
    all_players_stats = get_all_season_players_stats(year)  # work
    players_statistics = []
    # players_statistics = [[{'name': 'Robert Lewandowski', 'goals': 14, 'team_id': 157}], [{'name': 'Riyad Mahrez', 'assists': 4, 'team_id': 50, 'place': 5}]]
    players_statistics.append(get_all_teams_in_season(year))
    players_statistics.append(get_top_scorers(all_players_stats.__copy__()))
    players_statistics.append(get_most_assists(all_players_stats.__copy__()))
    players_statistics.append(get_best_goalkeepers(all_players_stats.__copy__()))
    players_statistics.append(list(mongo.get_collection(mongo.players_recent_games_performances_collection, {})))
    return players_statistics


# return list of obj: {team: "Paris Saint Germain", team_id: 85}
def get_all_teams_in_season(year):
    season = 2019
    if year == '2018/19':
        season = 2018
    if year == '2017/18':
        season = 2017
    if year == '2016/17':
        season = 2016
    # league_info = MongodbWrapper.get_league_info({"season": season})[0]
    league_info = mongo.get_collection(mongo.league_info_collection, {"season": season})[0]
    # teams_info = MongodbWrapper.get_team_info()
    teams_info = mongo.get_collection(mongo.teams_collection, {})
    teams_in_season = []
    for team_id in league_info["teams_in_league"]:
        for team in teams_info.__copy__():
            if team['team_id'] == team_id:
                teams_in_season.append({"team_id": team['team_id'], "team_name": team['team_name']})
                break

    return teams_in_season


def get_all_teams():
    teams_info = mongo.get_collection(mongo.teams_collection, {})
    teams = []
    for team in teams_info.__copy__():
        teams.append({"team_id": team['team_id'], "team_name": team['team_name']})

    return teams


def get_best_goalkeepers(all_players_stats):
    best_goalkeepers = []
    # min_score = 0
    for player_stats in all_players_stats:
        if (player_stats["position"] == "Goalkeeper" and player_stats["games"]["minutes_played"] >= 91):
            insert_best_goalkeapers_list(best_goalkeepers, player_stats)

    num = 0
    for player in best_goalkeepers:
        num = num + 1
        player['place'] = num

    return best_goalkeepers


def insert_best_goalkeapers_list(best_goalkeapers, player_stats):
    index = 0
    goolkeaper_goals_conceded_per_match = player_stats["goals"]["conceded"] / player_stats["games"]["appearences"]
    for player in best_goalkeapers:
        if player["score"]["goals_per_game"] < goolkeaper_goals_conceded_per_match:
            index += 1

    new_goalkeapers = {'name': player_stats['player_name'],
                       'score': {'conceded_goals': player_stats["goals"]["conceded"],
                                 'games_played': player_stats["games"]["appearences"],
                                 'goals_per_game': goolkeaper_goals_conceded_per_match},
                       'team_id': player_stats["team_id"]}
    best_goalkeapers.insert(index, new_goalkeapers)


def get_most_assists(all_players_stats):
    most_assists = []
    min_assists = 0
    for player_stats in all_players_stats:
        if player_stats["goals"]["assists"] > min_assists:
            insert_most_assists_list(most_assists, player_stats)
            # if len(most_assists) == 10:
            # min_assists = most_assists[9]["assists"]

    num = 0
    for player in most_assists:
        num = num + 1
        player['place'] = num
    # print(player)

    return most_assists


def insert_most_assists_list(most_assists, player_stats):
    index = 0
    for player in most_assists:
        if int(player["score"]) > int(player_stats["goals"]["assists"]):
            index += 1

    new_assistster = {'name': player_stats['player_name'], 'score': player_stats["goals"]["assists"],
                      'team_id': player_stats["team_id"]}
    most_assists.insert(index, new_assistster)


def get_all_season_players_stats(season):
    all_players_stats = mongo.get_collection(mongo.player_season_performances_collection, {"season": season})
    return all_players_stats


def insert_top_scorer_list(top_scorers, player_stats):
    index = 0
    for player in top_scorers:
        if int(player["score"]) > int(player_stats["goals"]["total"]):
            index += 1

    new_top_scorer = {'name': player_stats['player_name'], 'score': player_stats["goals"]["total"],
                      'team_id': player_stats["team_id"]}
    top_scorers.insert(index, new_top_scorer)
    # if len(top_scorers) > 10:
    # top_scorers.pop()


def get_top_scorers(players_stats):
    top_scorers = []
    min_goals = 0
    for player_stats in players_stats:
        if player_stats["goals"]["total"] > min_goals:
            insert_top_scorer_list(top_scorers, player_stats)
    #      if len(top_scorers) == 10:
    #         min_goals = top_scorers[9]["goals"]

    num = 0
    for player in top_scorers:
        num = num + 1
        player['place'] = num
    # print(player)

    return top_scorers
