import React from 'react';
import PeopleIcon from '@material-ui/icons/People';
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
                'link': '',
            },
            {
                'isCategory': false,
                'name': 'Top Defenders',
                'icon': <SportsSoccerIcon />,
                'link': '',
            },
        ]
    },

    {
        'isCategory': true,
        'name': 'Predictions',
        'icon': <LayersIcon />,
        'subItems': [
            {
                'isCategory': false,
                'name': 'Next Round',
                'icon': <ViewHeadlineIcon />,
                'link': '',
            },
            {
                'isCategory': false,
                'name': 'Next Year',
                'icon': <ViewHeadlineIcon />,
                'link': '',
            },
        ]
    },
]

export {routes}
