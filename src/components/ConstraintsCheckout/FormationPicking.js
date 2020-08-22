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
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';


const formationsData = [
  {
    formation: '3-5-2',
    description: 'In the same manner as the 1-3-4-3, the interesting options are in the middle. With three central defenders, three central midfielders and two forwards, many combinations become possible and space can be found on the wings, where only one player patrols the whole corridor. Most of the time with this tactical choice, the 1-3-5-2 is used when the team is in possession of the ball, but reverts to a 5-3-2 when defending, to suppress space and penetration possibilities on the sides.',
    image: 'https://montreal-mp7static.mlsdigital.net/elfinderimages/1-3-5-2.png'
  },
  {
    formation: '3-4-3',
    description: 'A formation with a high attacking mindset, the 1-3-4-3 is deployed with either a diamond midfield (like the ‘70s Ajax or Johan Cruyff’s Barça, as he explained himself here) or with a flat midfield (like Antonio Conte’s Chelsea). In the diamond’s case, the attacking wingers are responsible for stretching the opposition’s defensive line by providing width, while when the midfield is flat, it’s the wide midfielders who take care of the wings – from a lower position on the field –, in turn allowing the left and right forwards to play inside, meaning they will patrol the corridors between the full-backs and the centre backs.',
    image: 'https://montreal-mp7static.mlsdigital.net/elfinderimages/1-3-4-3%20diamant.png'
  },
  {
    formation: '4-5-1',
    description: 'The five midfielders in this type of formation give a bit of freedom to the manager. The tactical choices will determine the roles given to the central midfielders: one defensive mid and we are closer to a 4-1-4-1; two defensive mids and we touch a 4-2-3-1. It is rare to see all five midfielders on the same line. The numerical advantage in the midfield allows to create layers and to limit space in between the lines, all the while allowing counter-attacking occasions to the offensive mids.',
    image: 'https://montreal-mp7static.mlsdigital.net/elfinderimages/1-4-2-3-1.png'
  },
  {
    formation: '4-3-3',
    description: 'This is a system that favours talented wingers. It is the formation that was most commonly used by the Impact in last year’s playoff run and it paid its dividends. The complementarity between the central midfielders is important to prevent the opponent from going quickly on a counter and to take advantage of the space on the wings, but the risk might be worth it. We will let Thierry Henry explain the attacking animation of Pep Guardiola’s Barcelona, one of the best teams in history to play with this tactical deployment.',
    image: 'https://montreal-mp7static.mlsdigital.net/elfinderimages/1-4-3-3.png'
  },
  {
    formation: '4-4-2',
    description: 'This is the basic modern formation. As Arsène Wenger said, it is the best system to cover in a mathematical and rational way the space on a soccer field: six players cover 60% of the field in the middle (two centre backs, two centre mids, two forwards), while the wings (20% of the space on each side) are each covered by two players (a full-back and a winger). The weaknesses of this type of formation are found in between the lines: with two banks of four players, penetration becomes easier, as there are less layers to go through to get close to goal.',
    image: 'https://montreal-mp7static.mlsdigital.net/elfinderimages/1-4-4-2%20flat.png'
  },
  {
    formation: '5-3-2',
    description: 'Another formation inviting the opponent’s pressure to take advantage of the space left behind with quick transitions and counter-attacks, the 1-5-3-2 is a cousin of the 1-3-5-2, but asks the wing players to play a little lower and to choose carefully the moments to get forward. The two forwards, on their side, have to be complementary: usually, one of the two is good with his back to goal and is more physical, while the other one is quicker and more technical (Giovinco and Altidore come to mind, notably).',
    image: 'https://montreal-mp7static.mlsdigital.net/elfinderimages/1-5-3-2.png'
  }
];




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
  tabRoot: {
    fontSize: '1.7rem',
    fontWeight: 'bold',
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
                key={formationItem.color}
                in={value === index}
                timeout={transitionDuration}
                style={{ transitionDelay: `${value === index ? transitionDuration.exit : 0}ms`, }}
                unmountOnExit>
                <img src={formationItem.image} width="300" />
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
                variant="fullwidth"
                className={classes.tabs}
                classes={{ indicator: classes.bigIndicator }}>
                {formationsData.map((formationItem, i) =>
                  <Tab
                    className={classes.tabRoot}
                    classes={{ selected: classes.tabSelected }}
                    label={formationItem.formation} {...a11yProps(i)} />)}
              </Tabs>
            </AppBar>
          </Grid>

          <Grid item>
            <SwipeableViews
              axis={theme.direction === 'ltr' ? 'x-reverse' : 'x'}
              index={value}
              onChangeIndex={handleChangeIndex}>
              {formationsData.map((formationItem, index) =>
                <TabPanel formationItem={formationItem} value={value} index={index} dir={theme.direction} />)}
            </SwipeableViews>
          </Grid>

        </Grid>
      </div>
    </React.Fragment>
  );

}
