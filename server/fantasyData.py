
###################################
####### DATA - FANTASY TEAM #######
###################################

fantasy_team_data = {}

fantasy_team_data['season'] = '2019/20'
fantasy_team_data['round'] = 'Final'
fantasy_team_data['ultimate_team'] = []
fantasy_team_data['eliminated_players'] = []

#######################################
####### DATA - TEAM CONSTRAINTS #######
#######################################

team_constraints = {}

team_constraints['player_selection'] = []
team_constraints['formation_pick'] = ''
team_constraints['advanced_constraints'] = { }


#########################################################
####### DATA - TEAMS QUALIFIED TO KNOCKOUT PHASES #######
#########################################################

qualified_teams_id_by_year_round = {}

qualified_teams_id_by_year_round['2018/19'] = {
  '8th Finals': [47, 40, 194, 529, 496, 50, 212, 33, 174, 530, 85, 165, 80, 497, 157, 541],
  'Quarter-finals': [47, 40, 194, 529, 496, 50, 212, 33],
  'Semi-finals': [47, 40, 194, 529],
  'Final': [47, 40]
}

qualified_teams_id_by_year_round['2019/20'] = {
  '8th Finals': [85, 157, 80, 173, 530, 499, 529, 50, 165, 541, 532, 40, 49, 496, 47, 492],
  'Quarter-finals': [85, 157, 80, 173, 530, 499, 529, 50],
  'Semi-finals': [85, 157, 80, 173],
  'Final': [85, 157]
}
