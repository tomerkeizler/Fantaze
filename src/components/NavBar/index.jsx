import React from "react";
import { Link } from "react-router-dom";
import styles from "./navbar.module.css";
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';


let appBarStyle = { position: 'relative' };


const NavBar = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="absolute" color="default" style={appBarStyle}>
        <Toolbar>

          <Link className="navbar-brand" to="/">
            <Typography variant="h4" color="inherit" noWrap>
              Fantasy Planner
          </Typography>
          </Link>

          <nav className="navbar navbar-expand-sm navbar-light border-bottom justify-content-between">
            <div className="navbar-nav">
              <Link className="nav-item nav-link active" to="">About us</Link>
              <Link className="nav-item nav-link active" to="My_Team">My Team</Link>
              <Link className="nav-item nav-link active" to="Constraints_Checkout">Team constraints</Link>
              <Link className="nav-item nav-link active" to="List">List</Link>
              <Link className="nav-item nav-link active" to="Master_Detail">Statistics</Link>
            </div>
          </nav>

        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
export default NavBar;
