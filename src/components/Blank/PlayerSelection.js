import React, { useState } from 'react';
import CONSTANTS from "../../constants";
import WarningMessage from "../WarningMessage";
import StandardList from "./StandardList";
import NestedList from "./NestedList";

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';


const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
  },
  cardHeader: {
    padding: theme.spacing(1, 2),
  },
  button: {
    margin: theme.spacing(0.5, 2),
  },
}));


// ---------------------------
// ---- Logical functions ----
// ---------------------------
function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}


// -----------------------------------------------
// ---- The entire Player selection component ----
// -----------------------------------------------
export default function PlayerSelection() {
  const classes = useStyles();
  const [warningMessage, setWarningMessage] = useState({ warningMessageOpen: false, warningMessageText: "" });

  const [teams, setTeams] = useState([]);
  const [checkedTeams, setCheckedTeams] = useState([{ id: 529, value: 'Barcelona' }]);

  const [positions, setPositions] = useState([]);
  const [checkedPositions, setCheckedPositions] = useState([]);

  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [checkedPlayers, setCheckedPlayers] = useState([]);

  const checkedAvailablePlayers = intersection(checkedPlayers, availablePlayers);
  const checkedSelectedPlayers = intersection(checkedPlayers, selectedPlayers);


  // --------------------------------------
  // ---- Handlers for list of teams ----
  // --------------------------------------
  const handleToggleTeam = (teamToggledObj) => () => {

    // ---- update state of checked teams
    const currentIndex = checkedTeams.findIndex(teamObj => teamObj.id === teamToggledObj.id);
    const newCheckedTeams = [...checkedTeams];

    if (currentIndex === -1) {
      newCheckedTeams.push(teamToggledObj);
    } else {
      newCheckedTeams.splice(currentIndex, 1);
    }
    setCheckedTeams(newCheckedTeams);
    // console.log(checkedTeams);

    // ---- initilize available players state
    getPlayersByTeam(checkedTeams.map((team) => team.id))
      .then(playerList => {
        setAvailablePlayers(playerList.map((playerObj) => ({
          ...playerObj,
          id: playerObj.player_id,
          value: `${playerObj.player_name} (${playerObj.team_name})`
        })))
      })
      .catch(error =>
        setWarningMessage({
          warningMessageOpen: true,
          warningMessageText: `Request to get players failed: ${error}`
        })
      );
  };

  const numberOfCheckedTeams = (items) => intersection(checkedTeams, items).length;


  // ----------------------------------------
  // ---- Handlers for list of positions ----
  // ----------------------------------------

  // ---- update state of checked positions
  const handleTogglePosition = (positionToggledObj) => () => {
    const currentIndex = checkedPositions.findIndex(positionObj => positionObj.id === positionToggledObj.id);
    const newCheckedPositions = [...checkedPositions];

    if (currentIndex === -1) {
      newCheckedPositions.push(positionToggledObj);
    } else {
      newCheckedPositions.splice(currentIndex, 1);
    }
    setCheckedPositions(newCheckedPositions);
    // console.log(checkedPositions);
  }

  const numberOfCheckedPositions = (items) => intersection(checkedPositions, items).length;

  const handleToggleAllPositions = (items) => () => {
    if (numberOfCheckedPositions(items) === items.length) {
      setCheckedPositions(not(checkedPositions, items));
    } else {
      setCheckedPositions(union(checkedPositions, items));
    }
  };


  // ------------------------------------------
  // ---- Handlers for two lists of player ----
  // ------------------------------------------

  // ---- update state of checked players
  const handleTogglePlayer = (value) => () => {
    const currentIndex = checkedPlayers.indexOf(value);
    const newCheckedPlayers = [...checkedPlayers];

    if (currentIndex === -1) {
      newCheckedPlayers.push(value);
    } else {
      newCheckedPlayers.splice(currentIndex, 1);
    }

    setCheckedPlayers(newCheckedPlayers);
  };

  const numberOfCheckedPlayers = (items) => intersection(checkedPlayers, items).length;

  const handleToggleAllPlayers = (items) => () => {
    if (numberOfCheckedPlayers(items) === items.length) {
      setCheckedPlayers(not(checkedPlayers, items));
    } else {
      setCheckedPlayers(union(checkedPlayers, items));
    }
  };

  const handleCheckedRight = () => {
    setSelectedPlayers(selectedPlayers.concat(checkedAvailablePlayers));
    setAvailablePlayers(not(availablePlayers, checkedAvailablePlayers));
    setCheckedPlayers(not(checkedPlayers, checkedAvailablePlayers));
  };

  const handleCheckedLeft = () => {
    setAvailablePlayers(availablePlayers.concat(checkedSelectedPlayers));
    setSelectedPlayers(not(selectedPlayers, checkedSelectedPlayers));
    setCheckedPlayers(not(checkedPlayers, checkedSelectedPlayers));
  };


  // ------------------------
  // ---- Fetching data  ----
  // ------------------------
  const getTeams = () => {
    let teamList = fetch(CONSTANTS.ENDPOINT.TEAM_FILTER)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
    return teamList;
  }


  const getPlayersByTeam = (teams_id_checked) => {
    const playerList = fetch(CONSTANTS.ENDPOINT.PLAYER_FILTER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teams_id: teams_id_checked
      })
    })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
    return playerList;
  }


  React.useEffect(() => {
    // ---- initilize teams state
    getTeams()
      .then(teamList => {
        setTeams(teamList.map((teamObj) => ({ id: teamObj.team_id, value: teamObj.team_name })));
      })
      .catch(error =>
        setWarningMessage({
          warningMessageOpen: true,
          warningMessageText: `Request to get teams failed: ${error}`
        })
      );

    // ---- initilize positions state
    let footballPositions = ['Goalkeeper', 'Defender', 'Midfielder', 'Attacker']
    setPositions(footballPositions.map((position, i) => ({ id: i, value: position })));
  }, []);


  // ---------------------------------
  // ---- A single list component ----
  // ---------------------------------
  const CustomSelectionList = (isNested, title, listWidth, listHeight, handleToggleAll, numberOfCheckedItems, items, handleToggle, checkedItems) => (
    <Card>
      <CardHeader
        className={classes.cardHeader}
        avatar=
        {handleToggleAll !== null ?
          (<Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfCheckedItems(items) === items.length && items.length !== 0}
            indeterminate={numberOfCheckedItems(items) !== items.length && numberOfCheckedItems(items) !== 0}
            disabled={items.length === 0}
            inputProps={{ 'aria-label': 'all items selected' }}
          />)
          : ('')}
        title={title}
        subheader={`${numberOfCheckedItems(items)}/${items.length} selected`}
      />
      <Divider />

      {isNested ? (
        <NestedList
          listWidth={listWidth}
          listHeight={listHeight}
          items={items}
          checkedItems={checkedItems}
          handleToggle={handleToggle}
        />
      ) : (
          <StandardList
            listWidth={listWidth}
            listHeight={listHeight}
            items={items}
            checkedItems={checkedItems}
            handleToggle={handleToggle}
          />
        )}

    </Card>
  );


  // -----------------------------------------------
  // ---- The entire Player selection component ----
  // -----------------------------------------------
  return (
    <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>


      <Grid container justify="center">
        <Grid container direction="row" alignItems="center" justify="center">

          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedRight}
            disabled={checkedAvailablePlayers.length === 0}
            aria-label="move selected right">
            Add player
          </Button>

          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedLeft}
            disabled={checkedSelectedPlayers.length === 0}
            aria-label="move selected left">
            Remove player
          </Button>

        </Grid>
      </Grid>

        <Grid item>{CustomSelectionList(false, 'Teams', 200, 300, null, numberOfCheckedTeams, teams, handleToggleTeam, checkedTeams)}</Grid>
        <Grid item>{CustomSelectionList(false, 'Position', 150, 300, handleToggleAllPositions, numberOfCheckedPositions, positions, handleTogglePosition, checkedPositions)}</Grid>
        <Grid item>{CustomSelectionList(true, 'Available players', 350, 300, null, numberOfCheckedPlayers, availablePlayers, handleTogglePlayer, checkedAvailablePlayers)}</Grid>
        <Grid item>{CustomSelectionList(false, 'Selected players', 300, 300, handleToggleAllPlayers, numberOfCheckedPlayers, selectedPlayers, handleTogglePlayer, checkedSelectedPlayers)}</Grid>
    </Grid>
  );
}
