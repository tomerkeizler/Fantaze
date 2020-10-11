import os

CONSTANTS = {
    'PORT': os.environ.get('PORT', 3001),
    'HTTP_STATUS': {
        '404_NOT_FOUND': 404,
        '200_OK': 200,
        '201_CREATED': 201,
        '500_INTERNAL_SERVER_ERROR': 500
    },

    'ENDPOINT': {
        'ALL_FIXTURES': '/api/fixtures_and_results',

        'MY_TEAM': {
            'GET_ULTIMATE_TEAM': '/api/my_team/get_ultimate_team',
            'SEASON_ROUND': '/api/my_team/season_round',
            'CALCULATE_GET_ULTIMATE_TEAM': '/api/my_team/calculate_get_ultimate_team',
            'INCLUDED_AND_ELIMINATED_SELECTED_PLAYERS': '/api/my_team/included_and_eliminated_selected_players',
            'SET_DEFAULT_DATA': '/api/my_team/set_default_data'
        },

        'TEAM_CONSTRAINTS': {
            'UPDATE': '/api/team_constraints/update',
            'FORMATION_PICK': '/api/team_constraints/formation_pick',
            'PLAYER_SELECTION': '/api/team_constraints/player_selection',
            'TEAM_FILTER': '/api/team_constraints/team_filter',
            'PLAYER_FILTER':'/api/team_constraints/player_filter',
        },

        'PLAYERS_STATS': {
			'TOP_SCORERS': '/api/players_stats/top_scorers',
			'MOST_ASSISTS': '/api/players_stats/most_assists',
			'RECENT_GAMES_STATS': '/api/players_stats/recent_games_stats',
			'BEST_GOALKEEPERS': '/api/players_stats/best_goolkeepers',
		},
    }
}
