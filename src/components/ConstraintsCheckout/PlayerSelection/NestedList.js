import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';


const useStyles = makeStyles((theme) => ({
  list: {
    backgroundColor: theme.palette.background.paper,
    overflow: 'scroll',
    width: 200,
    height: 250,
    maxHeight: 270,
  },
  nested: {
    paddingLeft: theme.spacing(5),
  },
  root: {
    '&$selected': {
      backgroundColor: '#cfd8dc',
      '&:hover': {
        backgroundColor: '#b0bec5',
      }
    },
  },
  selected: {},
}));

export default function NestedList(props) {
  const classes = useStyles();

  const handleClick = (position) => {
    setAreGroupsOpen(oldState => ({ ...oldState, [position]: !oldState[position] }));
  };

  let _ = require('lodash');
  let playersGroupedByPosition = _.groupBy(props.items, 'position');

  // Object.keys(playersGroupedByPosition).map(group => initialAreGroupsOpen[group] = true);
  let initialAreGroupsOpen = { Goalkeeper: true, Defender: true, Midfielder: true, Attacker: true };
  const [areGroupsOpen, setAreGroupsOpen] = React.useState(initialAreGroupsOpen);


  return (
    <List className={classes.list} dense component="div" role="list"
      style={{ width: props.listWidth }}>

      {Object.keys(playersGroupedByPosition).map((position) => {
        return (
          <React.Fragment key={position}>
            <ListItem button selected divider
              classes={{ root: classes.root, selected: classes.selected }}
              key={position} onClick={() => handleClick(position)}>
              <ListItemText primary={`${position}s`} />
              {areGroupsOpen[position] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Divider />

            <Collapse in={areGroupsOpen[position]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {playersGroupedByPosition[position]
                  .sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
                  .map((player) => {
                    return (
                      <ListItem disableGutters
                        selected={props.checkedItems.findIndex(obj => obj.id === player.id) !== -1}
                        key={player.id} role="listitem" button onClick={props.handleToggle(player)}>
                        <ListItemIcon>
                          <Checkbox
                            color="default"
                            checked={props.checkedItems.findIndex(obj => obj.id === player.id) !== -1}
                            tabIndex={-1}
                            disableRipple
                          />
                        </ListItemIcon>
                        <ListItemText id={player.id} primary={player.value} />
                      </ListItem>
                    );
                  })}
              </List>
            </Collapse>
          </React.Fragment>
        );
      })
      }
      <ListItem />
    </List>
  );
}
