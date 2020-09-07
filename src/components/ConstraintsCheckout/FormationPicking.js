import React from 'react';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Zoom from '@material-ui/core/Zoom';
import { green } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';


function a11yProps(index) {
  return {
    id: `action-tab-${index}`,
    'aria-controls': `action-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    flexGrow: 1,
    width: '100%',
    // width: 'auto',
    // position: 'relative',
    // minHeight: 200,
  },

  tabs: {
    // width: auto,
    borderBottom: `2px solid ${theme.palette.divider}`,
  },
  bigIndicator: {
    height: 3,
  },
  tab: {
    fontSize: '1.7rem',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#9fa8da',
    },
  },
  tabSelected: {
    backgroundColor: '#9fa8da',
  },

  details: {
    display: 'flex',
    // width: 970,
    // flexDirection: 'row',
    // alignItems: 'center',
  },
  content: {
    width: 670,
    flex: '1 0 auto',
  },

  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  fabGreen: {
    color: theme.palette.common.white,
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[600],
    },
  },
}));


export default function FormationPicking(props) {

  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  let formationsData = require('./FormationsData.js').formationsData;

  const handleChange = (event, newValue) => {
    setValue(newValue);
    props.onChange(formationsData[newValue].formation);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  function TabPanel(props) {
    const { value, index, formationItem } = props;

    return (
      <div
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`action-tabpanel-${index}`}>
        {value === index &&
          <Card className={classes.root}>
            <div className={classes.details}>
              <CardContent className={classes.content}>
                <Typography component="h5" variant="h5">
                  {formationItem.description}
                </Typography>
              </CardContent>

              <Zoom
                // key={formationItem.color}
                in={value === index}
                timeout={transitionDuration}
                style={{ transitionDelay: `${value === index ? transitionDuration.exit : 0}ms`, }}
                unmountOnExit>
                <img src={formationItem.image} width="300" alt="" />
              </Zoom>
            </div>
          </Card>}
      </div>
    );
  }

  TabPanel.propTypes = {
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Grid container spacing={2} direction="column" justify="center" alignItems="center">

          <Typography variant="h5"><b>
            Pick your desired football formation.
              </b></Typography>
          <Typography variant="h6" gutterBottom>
            Take the first step for creating your ultimate team!
              </Typography>

          <Grid item>
            <AppBar position="static" color="default">
              <Tabs
                centered
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                className={classes.tabs}
                classes={{ indicator: classes.bigIndicator }}>
                {formationsData.map((formationItem, index) =>
                  <Tab
                    key={index}
                    className={classes.tab}
                    classes={{ selected: classes.tabSelected }}
                    label={formationItem.formation} {...a11yProps(index)} />)}
              </Tabs>
            </AppBar>
          </Grid>

          <Grid item>
            <SwipeableViews
              axis={theme.direction === 'ltr' ? 'x-reverse' : 'x'}
              index={value}
              onChangeIndex={handleChangeIndex}>
              {formationsData.map((formationItem, index) =>
                <TabPanel formationItem={formationItem} value={value} key={index} index={index} dir={theme.direction} />)}
            </SwipeableViews>
          </Grid>

        </Grid>
      </div>
    </React.Fragment>
  );

}
