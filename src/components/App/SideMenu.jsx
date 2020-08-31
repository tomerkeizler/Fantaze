import React from 'react';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import PeopleIcon from '@material-ui/icons/People';
import StarIcon from '@material-ui/icons/Star';
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';
import SettingsIcon from '@material-ui/icons/Settings';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import LayersIcon from '@material-ui/icons/Layers';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';

import DashboardIcon from '@material-ui/icons/Dashboard';
import BarChartIcon from '@material-ui/icons/BarChart';
import AssignmentIcon from '@material-ui/icons/Assignment';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import ViewListIcon from '@material-ui/icons/ViewList';
import HelpIcon from '@material-ui/icons/Help';
import { fontStyle } from '@material-ui/system';


const useStyles = makeStyles((theme) => ({
  list: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
  },
  itemText: {
    color: 'black',
  },
  root: {
    '&$selected': {
      backgroundColor: '#CEDAEE',
      '&:hover': {
        backgroundColor: '#A5BFEC',
      }
    },
  },
  selected: {},
  itemLink: {
    color: 'black',
    '&:hover': {
      color: 'blue',
      textDecoration: 'none',
    },
  },
}));


export default function SideMenu() {
  const classes = useStyles();
  let initialCategories = { Constraints: false, Statistics: false, Predictions: false };
  const [areCategoriesOpen, setAreCategoriesOpen] = React.useState(initialCategories);

  const handleClick = (category) => {
    setAreCategoriesOpen(oldState => ({ ...oldState, [category]: !oldState[category] }));
  };


  const menuItems = [
    {
      'isCategory': false,
      'name': 'About Us',
      'icon': <PeopleIcon />,
      'link': ''
    },

    {
      'isCategory': false,
      'name': 'My Ultimate Team',
      'icon': <StarIcon />,
      'link': 'My_Team'
    },

    {
      'isCategory': true,
      'name': 'Constraints',
      'icon': <SettingsIcon />,
      'subItems': [
        {
          'name': 'Team Constraints',
          'icon': <DoubleArrowIcon />,
          'link': 'Constraints_View'
        },
        {
          'name': 'Set Constraints',
          'icon': <DoubleArrowIcon />,
          'link': 'Constraints_Checkout'
        },
      ]
    },

    {
      'isCategory': true,
      'name': 'Statistics',
      'icon': <EqualizerIcon />,
      'subItems': [
        {
          'name': 'Top scorers',
          'icon': <SportsSoccerIcon />,
          'link': ''
        },
        {
          'name': 'Top Defenders',
          'icon': <SportsSoccerIcon />,
          'link': ''
        },
      ]
    },

    {
      'isCategory': true,
      'name': 'Predictions',
      'icon': <LayersIcon />,
      'subItems': [
        {
          'name': 'Next Round',
          'icon': <ViewHeadlineIcon />,
          'link': ''
        },
        {
          'name': 'Next Year',
          'icon': <ViewHeadlineIcon />,
          'link': ''
        },
      ]
    },
  ]


  return (
    <List className={classes.list}>
      {menuItems.map((item) => {

        if (item.isCategory) {
          return (
            <>
              <ListItem button selected
                classes={{ root: classes.root, selected: classes.selected }}
                key={item}
                onClick={() => handleClick(item.name)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
                {areCategoriesOpen[item] ? <ExpandLess /> : <ExpandMore />}
              </ListItem>

              <Collapse in={areCategoriesOpen[item.name]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => {
                    return (
                      <Link to={subItem.link} className= {classes.itemLink}>
                        <ListItem button key={subItem.name}>
                          <ListItemIcon>{subItem.icon}</ListItemIcon>
                          <ListItemText primary={subItem.name} />
                        </ListItem>
                      </Link>
                    );
                  })}
                </List>
              </Collapse>
            </>
          )
        }

        else {
          return (
            <Link to={item.link} className= {classes.itemLink}>
              <ListItem button key={item.name}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItem>
            </Link>
          );
        }

      })
      }
    </List>
  );
}
