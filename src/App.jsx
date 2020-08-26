import React from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

import AboutUs from "./components/AboutUs/AboutUs";
import MyTeam  from "./components/My_Team/My_Team";
import ConstraintsCheckout from "./components/ConstraintsCheckout/ConstraintsCheckout";
import List from "./components/List/List";
import Master_Detail from "./components/Master_Detail/Master_Detail";
import Players_Statistics from "./components/Players_Statistics/Players_Statistics"


//TODO Web Template Studio: Add routes for your new pages here.
const App = () => {
    return (
      <React.Fragment>
        <NavBar />
        <Switch>
          <Route exact path = "/" component = { AboutUs } />
          <Route path = "/My_Team" component = { MyTeam } />
          <Route exact path = "/Constraints_Checkout" component = { ConstraintsCheckout } />
          <Route path = "/List" component = { List } />
          <Route path="/Master_Detail" component={Master_Detail} />
          <Route path="/Players_Statistics" component={Players_Statistics} />
        </Switch>
        <Footer />
      </React.Fragment>
    );
}

export default App;
