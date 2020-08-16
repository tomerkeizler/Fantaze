import os

CONSTANTS = {
    'PORT': os.environ.get('PORT', 3001),
    'HTTP_STATUS': {
        '404_NOT_FOUND': 404,
        '201_CREATED': 201,
        '500_INTERNAL_SERVER_ERROR': 500
    },
    'ENDPOINT': {
        'TRY': '/api/try',
        'LIST': '/api/list',
        'MASTER_DETAIL': '/api/masterdetail',

        'MY_TEAM': '/api/my_team',
        
        'TEAM_FILTER': '/api/team_filter',
        'PLAYER_FILTER': '/api/player_filter'
    }
}
