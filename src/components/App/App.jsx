import "./App.css";
import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import MenuIcon from '@material-ui/icons/Menu';
import SideMenu from './SideMenu';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { Switch, Route } from "react-router-dom";
import AboutUs from "../AboutUs/AboutUs";
import GettingStarted from "../GettingStarted/GettingStarted";
import MyTeam from "../My_Team/My_Team";
import ConstraintsView from "../ConstraintsView/ConstraintsView";
import ConstraintsCheckout from "../ConstraintsCheckout/ConstraintsCheckout";
// import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Top_Scorers from "../Players_Statistics/Top_Scorers"
import Most_Assists from "../Players_Statistics/Most_Assists"
import Best_Goalkeepers from "../Players_Statistics/Best_Goalkeepers"
import Recent_Games_Stats from "../Players_Statistics/Recent_Games_Stats"
import Fixtures_And_Results from "../Fixtures_And_Results/Fixtures_And_Results"
import CONSTANTS from "../../constants";


const drawerWidth = 260;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    // height: '75vh'
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    backgroundColor: '#3f51b5',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));


export default function App() {
  const classes = useStyles();
  let routes = require('./appRoutes.js').routes;

  const [open, setOpen] = React.useState(true);
  const [pageTitle, setPageTitle] = React.useState('');

  async function myFetch(url) {
    let response = await fetch(url);
    return response.json();
  }

  React.useEffect(() => {
    myFetch(CONSTANTS.ENDPOINT.MY_TEAM.SET_DEFAULT_DATA)
      .catch(err => console.log(err));
  }, [])

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const getPageNameByPath = (path) => {
    let route;
    for (route of routes) {
      if (route.isCategory) {
        let subRoute;
        for (subRoute of route.subItems) {
          if (subRoute.link === path) {
            return subRoute.name;
          }
        }
      }
      else if (route.link === path) {
        return route.name;
      }
    }
  }


  return (
    <React.Fragment>
      <div className={classes.root}>
        <CssBaseline />

        <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleDrawerOpen}
              className={clsx(classes.menuButton, open && classes.menuButtonHidden)}>
              <MenuIcon />
            </IconButton>
            <Typography component="h4" variant="h4" color="inherit" noWrap className={classes.title}>
              Fantaze {pageTitle === '' ? '' : `  >>  ${pageTitle}`}
            </Typography>
            <Typography component="h6" variant="subtitle1" color="inherit" noWrap>
              The ultimate app for UEFA Champions Legaue Fantasy gamblers
            </Typography>
            {/* <IconButton color="inherit" size="medium">
              <AccountCircleIcon />
          </IconButton> */}
          </Toolbar>
        </AppBar>

        <Drawer variant="permanent" open={open}
          classes={{ paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose), }}>
          <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ArrowBackIosIcon style={{ color: 'white' }} />
            </IconButton>
          </div>
          <Divider />
          <SideMenu />
        </Drawer>

        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Switch>
              <Route exact path="/" component={AboutUs} />
              <Route path="/Getting_Started" component={GettingStarted} />
              <Route path="/My_Team" component={MyTeam} />
              <Route exact path="/Constraints_Checkout" component={ConstraintsCheckout} />
              <Route path="/Constraints_View" component={ConstraintsView} />
              <Route path="/Top_Scorers" component={Top_Scorers} />
              <Route path="/Most_Assists" component={Most_Assists} />
              <Route path="/Best_Goalkeepers" component={Best_Goalkeepers} />
              <Route path="/Recent_Games_Stats" component={Recent_Games_Stats} />
              <Route path="/Fixtures_And_Results" component={Fixtures_And_Results} />

            </Switch>

            <Route render={({ history }) => {
              let currentPath = history.location.pathname.substring(1);
              let currentPageName = getPageNameByPath(currentPath);
              setPageTitle(currentPageName);
            }} />

          </Container>
        </main>

      </div>
    </React.Fragment>
  );
}
