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
        'MASTER_DETAIL': '/api/masterdetail',
        'LIST': '/api/list',
        'GRID': '/api/grid',
    }
}
