import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';


const useStyles = makeStyles((theme) => ({
  list: {
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    width: 200,
    height: 300,
    maxHeight: 300,
  },
}));

export default function StandardList(props) {
  const classes = useStyles();


  return (
    <List className={classes.list} dense component="div" role="list"
      style={{ width: props.listWidth }}>
      {props.items.map((item) => {
        const labelId = `transfer-list-all-item-${item}-label`;

        return (
          <ListItem
          selected={props.checkedItems.findIndex(obj => obj.id === item.id) !== -1}
          key={item.id} role="listitem" button onClick={props.handleToggle(item)}>
            <ListItemIcon>
              <Checkbox
                color={props.title === 'Selected players' ? 'secondary' : 'default'}
                checked={props.checkedItems.findIndex(obj => obj.id === item.id) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={item.value} />
          </ListItem>
        );
      })}
      <ListItem />
    </List>
  );
}
