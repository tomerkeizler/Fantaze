import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SideMenu from './SideMenu';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import "./App.css";
import { Switch, Route } from "react-router-dom";
import AboutUs from "../AboutUs/AboutUs";
import MyTeam from "../My_Team/My_Team";
import ConstraintsView from "../List/List";
import ConstraintsCheckout from "../ConstraintsCheckout/ConstraintsCheckout";
import Master_Detail from "../Master_Detail/Master_Detail";
import Top_Scorers from "../Players_Statistics/Top_Scorers"
import Most_Assists from "../Players_Statistics/Most_Assists"
import Best_Goalkeepers from "../Players_Statistics/Best_Goalkeepers"
import Recent_Games_Stats from "../Players_Statistics/Recent_Games_Stats"



const drawerWidth = 240;
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
    // overflow: 'auto',
  },
  container: {
    // paddingTop: theme.spacing(4),
    // paddingBottom: theme.spacing(4),
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
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

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
              Fantasy Planner
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
              <Route path="/My_Team" component={MyTeam} />
              <Route exact path="/Constraints_Checkout" component={ConstraintsCheckout} />
              <Route path="/Constraints_View" component={ConstraintsView} />
              <Route path="/Master_Detail" component={Master_Detail} />
              <Route path="/Top_Scorers" component={Top_Scorers} />
              <Route path="/Most_Assists" component={Most_Assists} />
              <Route path="/Best_Goalkeepers" component={Best_Goalkeepers} />
              <Route path="/Recent_Games_Stats" component={Recent_Games_Stats} />
            </Switch>
          </Container>
        </main>

      </div>
    </React.Fragment>
  );
}
