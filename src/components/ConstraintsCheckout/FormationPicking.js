import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Zoom from '@material-ui/core/Zoom';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import UpIcon from '@material-ui/icons/KeyboardArrowUp';
import { green } from '@material-ui/core/colors';
import Box from '@material-ui/core/Box';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`action-tabpanel-${index}`}
      aria-labelledby={`action-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `action-tab-${index}`,
    'aria-controls': `action-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 1000,
    position: 'relative',
    minHeight: 200,
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


export default function FormationPicking() {

  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const fabs = [
    {
      color: 'primary',
      className: classes.fab,
      icon: <AddIcon />,
      label: 'Add',
    },
    {
      color: 'secondary',
      className: classes.fab,
      icon: <EditIcon />,
      label: 'Edit',
    },
    {
      color: 'inherit',
      className: clsx(classes.fab, classes.fabGreen),
      icon: <UpIcon />,
      label: 'Expand',
    },
  ];

  return (
    <React.Fragment>
      <Typography variant="h5"><b>
        Pick your desired football formation.
        </b></Typography>
      <Typography variant="h6">
        Take the first step for creating your ultimate team!
      </Typography>

      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="3-5-2" {...a11yProps(0)} />
            <Tab label="3-4-3" {...a11yProps(1)} />
            <Tab label="4-5-1" {...a11yProps(2)} />
            <Tab label="4-3-3" {...a11yProps(3)} />
            <Tab label="4-4-2" {...a11yProps(4)} />
            <Tab label="5-3-2" {...a11yProps(5)} />
          </Tabs>
        </AppBar>

        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <img src="https://montreal-mp7static.mlsdigital.net/elfinderimages/1-3-5-2.png" width="200"></img>
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <img src="https://montreal-mp7static.mlsdigital.net/elfinderimages/1-3-4-3%20diamant.png" width="200"></img>
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <img src="https://montreal-mp7static.mlsdigital.net/elfinderimages/1-4-2-3-1.png" width="200"></img>
          </TabPanel>
          <TabPanel value={value} index={3} dir={theme.direction}>
            <img src="https://montreal-mp7static.mlsdigital.net/elfinderimages/1-4-3-3.png" width="200"></img>
          </TabPanel>
          <TabPanel value={value} index={4} dir={theme.direction}>
            <img src="https://montreal-mp7static.mlsdigital.net/elfinderimages/1-4-4-2%20flat.png" width="200"></img>
          </TabPanel>
          <TabPanel value={value} index={5} dir={theme.direction}>
            <img src="https://montreal-mp7static.mlsdigital.net/elfinderimages/1-5-3-2.png" width="200"></img> */}
        </TabPanel>
        </SwipeableViews>

        {fabs.map((fab, index) => (
          <Zoom
            key={fab.color}
            in={value === index}
            timeout={transitionDuration}
            style={{
              transitionDelay: `${value === index ? transitionDuration.exit : 0}ms`,
            }}
            unmountOnExit
          >
            <Fab aria-label={fab.label} className={fab.className} color={fab.color}>
              {fab.icon}
            </Fab>
          </Zoom>
        ))}
      </div>
    </React.Fragment>
  );

}
