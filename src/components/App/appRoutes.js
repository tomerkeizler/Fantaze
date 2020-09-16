import React from 'react';
import PeopleIcon from '@material-ui/icons/People';
import ScoreIcon from '@material-ui/icons/Score';
import StarIcon from '@material-ui/icons/Star';
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';
import SettingsIcon from '@material-ui/icons/Settings';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import LayersIcon from '@material-ui/icons/Layers';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';
import DashboardIcon from '@material-ui/icons/Dashboard';

// import BarChartIcon from '@material-ui/icons/BarChart';
// import AssignmentIcon from '@material-ui/icons/Assignment';
// import TrendingUpIcon from '@material-ui/icons/TrendingUp';
// import ViewListIcon from '@material-ui/icons/ViewList';
// import HelpIcon from '@material-ui/icons/Help';


const routes = [
    {
        'isCategory': false,
        'name': 'About Us',
        'icon': <PeopleIcon />,
        'link': '',
    },

    {
        'isCategory': false,
        'name': 'Getting Started',
        'icon': <DashboardIcon />,
        'link': 'Getting_Started',
    },

    {
        'isCategory': false,
        'name': 'My Ultimate Team',
        'icon': <StarIcon />,
        'link': 'My_Team',
    },

    {
        'isCategory': true,
        'name': 'Team constraints',
        'icon': <SettingsIcon />,
        'subItems': [
            {
                'isCategory': false,
                'name': 'View Constraints',
                'icon': <DoubleArrowIcon />,
                'link': 'Constraints_View',
            },
            {
                'isCategory': false,
                'name': 'Set Constraints',
                'icon': <DoubleArrowIcon />,
                'link': 'Constraints_Checkout',
            },
        ]
    },

    {
        'isCategory': true,
        'name': 'Statistics',
        'icon': <EqualizerIcon />,
        'subItems': [
            {
                'isCategory': false,
                'name': 'Top scorers',
                'icon': <SportsSoccerIcon />,
                'link': 'Top_Scorers',
            },
            {
                'isCategory': false,
                'name': 'Most Assists',
                'icon': <SportsSoccerIcon />,
                'link': 'Most_Assists',
            },
            {
                'isCategory': false,
                'name': 'Recent Games Stats',
                'icon': <SportsSoccerIcon />,
                'link': 'Recent_Games_Stats',
            },
            {
                'isCategory': false,
                'name': 'Best Goalkeepers',
                'icon': <SportsSoccerIcon />,
                'link': 'Best_Goalkeepers',
            },
        ]
    },
    {
        'isCategory': false,
        'name': 'Fixtures And Results',
        'icon': <ScoreIcon />,
        'link': 'Fixtures_And_Results'
    },
]

export { routes }
