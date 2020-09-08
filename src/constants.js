const CONSTANTS = {};

CONSTANTS.ERROR_MESSAGE = {};

CONSTANTS.ERROR_MESSAGE.LIST_DELETE = "Request to delete list item failed:";
CONSTANTS.ERROR_MESSAGE.LIST_ADD = "Request to add list item failed:";
CONSTANTS.ERROR_MESSAGE.LIST_GET = "Request to get list items failed:";
CONSTANTS.ERROR_MESSAGE.LIST_EMPTY_MESSAGE = "Please enter a valid message";

CONSTANTS.ERROR_MESSAGE.GRID_GET = "Request to get grid text failed:";

CONSTANTS.ERROR_MESSAGE.MASTERDETAIL_GET = "Request to get master detail text failed:";

// ------------------------------------

CONSTANTS.ENDPOINT = {};

CONSTANTS.ENDPOINT.MY_TEAM = {};
CONSTANTS.ENDPOINT.MY_TEAM.CHOSEN = "/api/my_team/chosen";
CONSTANTS.ENDPOINT.MY_TEAM.CALCULATE_TEAM = "/api/my_team/calculate_team";
CONSTANTS.ENDPOINT.MY_TEAM.ELIMINATED= "/api/my_team/eliminated";

CONSTANTS.ENDPOINT.TEAM_CONSTRAINTS = {};
CONSTANTS.ENDPOINT.TEAM_CONSTRAINTS.UPDATE = "/api/team_constraints/update"
CONSTANTS.ENDPOINT.TEAM_CONSTRAINTS.FORMATION_PICK = "/api/team_constraints/formation_pick"
CONSTANTS.ENDPOINT.TEAM_CONSTRAINTS.PLAYER_SELECTION = "/api/team_constraints/player_selection"
CONSTANTS.ENDPOINT.TEAM_CONSTRAINTS.TEAM_FILTER = "/api/team_constraints/team_filter"
CONSTANTS.ENDPOINT.TEAM_CONSTRAINTS.PLAYER_FILTER = "/api/team_constraints/player_filter"

//CONSTANTS.ENDPOINT.PLAYER_STATS = "/api/players_statistics";
CONSTANTS.ENDPOINT.PLAYER_STATS = {};
CONSTANTS.ENDPOINT.PLAYER_STATS.TOP_SCORERS = "/api/players_stats/top_scorers";
CONSTANTS.ENDPOINT.PLAYER_STATS.MOST_ASSISTS = "/api/players_stats/most_assists";
CONSTANTS.ENDPOINT.PLAYER_STATS.BEST_GOALKEEPERS = "/api/players_stats/best_goolkeepers";
CONSTANTS.ENDPOINT.PLAYER_STATS.RECENT_GAMES_STATS = "/api/players_stats/recent_games_stats";

CONSTANTS.ENDPOINT.MASTERDETAIL = "/api/masterdetail";


export default CONSTANTS;
