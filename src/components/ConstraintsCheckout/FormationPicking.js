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
    // width: '100%',
    // width: 'auto',
    position: 'relative',
    minHeight: 200,
  },
  tabs: {
    // width: '100%',
    borderBottom: `0px solid ${theme.palette.divider}`,
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
  formationTabArea: {
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
  },
  formationContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    // width: 970,
  },
  content: {
    width: '100%',
    flex: '1 0 auto',
  },
  image: {
    marginLeft: theme.spacing(5),
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

  // ------------- formation tab content component -------------

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
            <CardContent className={classes.content}>
              <h5>{formationItem.description}</h5>
            </CardContent>
          </Card>}
      </div>
    );
  }
  TabPanel.propTypes = {
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };

  // ------------- formation image component -------------

  function FloatingImage(props) {
    const { value, index, formationItem } = props;
    return (
      <Zoom
        in={value === index}
        timeout={transitionDuration}
        style={{ transitionDelay: `${value === index ? transitionDuration.exit : 0}ms`, }}
        unmountOnExit>
        <img className={classes.image} src={formationItem.image} width="200" alt="" />
      </Zoom>
    );
  }
  FloatingImage.propTypes = {
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };
  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  // ------------- main render -------------

  return (
    <div className={classes.formationContainer}>

      <div className={classes.formationTabArea}>
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
                style={{ minWidth: 100 }}
                className={classes.tab}
                classes={{ selected: classes.tabSelected }}
                label={formationItem.formation} {...a11yProps(index)} />)}
          </Tabs>
        </AppBar>

        <SwipeableViews
          axis={theme.direction === 'ltr' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}>
          {formationsData.map((formationItem, index) =>
            <TabPanel formationItem={formationItem} value={value} key={index} index={index} dir={theme.direction} />)}
        </SwipeableViews>
      </div>

      {formationsData.map((formationItem, index) =>
        <FloatingImage
        formationItem={formationItem}
        value={value}
        key={index}
        index={index} />
        )}
    </div>
  );

}
