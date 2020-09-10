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
  let routes = require('./appRoutes.js').routes;

  let initialCategories = { Constraints: false, Statistics: false, Predictions: false };
  const [areCategoriesOpen, setAreCategoriesOpen] = React.useState(initialCategories);

  const handleClick = (category) => {
    setAreCategoriesOpen(oldState => ({ ...oldState, [category]: !oldState[category] }));
  };


  return (
    <List className={classes.list}>
      {routes.map((item) => {

        if (item.isCategory) {
          return (
            <div key={item.name}>
              <ListItem button selected
                classes={{ root: classes.root, selected: classes.selected }}
                onClick={() => handleClick(item.name)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
                {areCategoriesOpen[item] ? <ExpandLess /> : <ExpandMore />}
              </ListItem>

              <Collapse in={areCategoriesOpen[item.name]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => {
                    return (
                      <Link to={subItem.link} className={classes.itemLink} key={subItem.name}>
                        <ListItem button>
                          <ListItemIcon>{subItem.icon}</ListItemIcon>
                          <ListItemText primary={subItem.name} />
                        </ListItem>
                      </Link>
                    );
                  })}
                </List>
              </Collapse>
            </ div>
          )
        }

        else {
          return (
            <Link to={item.link} className={classes.itemLink} key={item.name}>
              <ListItem button>
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
