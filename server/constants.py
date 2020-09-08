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
        'MY_TEAM': {
            'CHOSEN': '/api/my_team/chosen',
            'CALCULATE_TEAM': '/api/my_team/calculate_team',
            'ELIMINATED': '/api/my_team/eliminated',

        },

		'PLAYERS_STATS':{
			'TOP_SCORERS': '/api/players_stats/top_scorers',
			'MOST_ASSISTS': '/api/players_stats/most_assists',
			'RECENT_GAMES_STATS': '/api/players_stats/recent_games_stats',
			'BEST_GOALKEEPERS': '/api/players_stats/best_goolkeepers',
		},


        'TEAM_CONSTRAINTS': {
            'UPDATE': '/api/team_constraints/update',
            'FORMATION_PICK': '/api/team_constraints/formation_pick',
            'PLAYER_SELECTION': '/api/team_constraints/player_selection',
            'TEAM_FILTER': '/api/team_constraints/team_filter',
            'PLAYER_FILTER': '/api/team_constraints/player_filter',
        },

        'MASTER_DETAIL': '/api/masterdetail',
    }
}
