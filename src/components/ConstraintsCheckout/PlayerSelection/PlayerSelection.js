import React, { useState } from 'react';
import CONSTANTS from "../../../constants";
import WarningMessage from "../../WarningMessage";
import StandardList from "./StandardList";
import NestedList from "./NestedList";
import FavoritePlayersLimits from "./FavoritePlayersLimits";

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
export default function PlayerSelection(props) {
  const classes = useStyles();
  const [warningMessage, setWarningMessage] = useState({ warningMessageOpen: false, warningMessageText: "" });

  const [teams, setTeams] = useState([]);
  const [checkedTeams, setCheckedTeams] = useState([]);

  const [positions, setPositions] = useState([]);
  const [checkedPositions, setCheckedPositions] = useState([]);

  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [favoritePlayers, setFavoritePlayers] = useState([]);
  const [checkedPlayers, setCheckedPlayers] = useState([]);

  const checkedAvailablePlayers = intersection(checkedPlayers, availablePlayers);
  const checkedFavoritePlayers = intersection(checkedPlayers, favoritePlayers);
  

  const closeWarningMessage = () => {
    setWarningMessage({
      warningMessageOpen: false,
      warningMessageText: ""
    });
  }

  const initializeAvailablePlayers = (relevantTeams, relevantPositions) => {
    getPlayersByTeam(relevantTeams.map((team) => team.id))
      .then(playerList => {
        setAvailablePlayers(playerList.filter(playerObj =>
          relevantPositions.map(positionObj => positionObj.value).includes(playerObj.position)
          && !favoritePlayers.map(favoritePlayerObj => favoritePlayerObj.player_id).includes(playerObj.player_id)
          )
          .map((playerObj) => ({
            ...playerObj,
            id: playerObj.player_id,
            value: `${playerObj.player_name} (${playerObj.team_name}) - ${playerObj.price}M`
          })))
      })
      .catch(error => displayFetchErrors('GET players by team', error));
  }

  // --------------------------------------
  // ---- Handlers for list of teams ----
  // --------------------------------------

  const numberOfCheckedTeams = (items) => intersection(checkedTeams, items).length;

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

    // ---- initialize available players state
    initializeAvailablePlayers(newCheckedTeams, checkedPositions);
  }

  // ----------------------------------------
  // ---- Handlers for list of positions ----
  // ----------------------------------------

  const numberOfCheckedPositions = (items) => intersection(checkedPositions, items).length;

  const handleTogglePosition = (positionToggledObj) => () => {
    // ---- update state of checked positions
    const currentIndex = checkedPositions.findIndex(positionObj => positionObj.id === positionToggledObj.id);
    const newCheckedPositions = [...checkedPositions];
    if (currentIndex === -1) {
      newCheckedPositions.push(positionToggledObj);
    } else {
      newCheckedPositions.splice(currentIndex, 1);
    }
    setCheckedPositions(newCheckedPositions);

    // ---- initialize available players state
    initializeAvailablePlayers(checkedTeams, newCheckedPositions);
  }


  const handleToggleAllPositions = (items) => () => {
    // ---- update state of checked positions
    let newCheckedPositions;
    if (numberOfCheckedPositions(items) === items.length) {
      newCheckedPositions = not(checkedPositions, items);
    } else {
      newCheckedPositions = union(checkedPositions, items);
    }
    setCheckedPositions(newCheckedPositions);

    // ---- initialize available players state
    initializeAvailablePlayers(checkedTeams, newCheckedPositions);
  }


  // ------------------------------------------
  // ---- Handlers for two lists of player ----
  // ------------------------------------------

  const numberOfCheckedPlayers = (items) => intersection(checkedPlayers, items).length;

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


  const handleToggleAllPlayers = (items) => () => {
    if (numberOfCheckedPlayers(items) === items.length) {
      setCheckedPlayers(not(checkedPlayers, items));
    } else {
      setCheckedPlayers(union(checkedPlayers, items));
    }
  };

  const handleCheckedRight = () => {
    let newFavoritePlayers = favoritePlayers.concat(checkedAvailablePlayers);
    setFavoritePlayers(newFavoritePlayers);
    setAvailablePlayers(not(availablePlayers, checkedAvailablePlayers));
    setCheckedPlayers(not(checkedPlayers, checkedAvailablePlayers));

    props.onPlayerSelectionChange(newFavoritePlayers);
  };

  const handleCheckedLeft = () => {
    let newFavoritePlayers = not(favoritePlayers, checkedFavoritePlayers);
    setAvailablePlayers(availablePlayers.concat(checkedFavoritePlayers));
    setFavoritePlayers(newFavoritePlayers);
    setCheckedPlayers(not(checkedPlayers, checkedFavoritePlayers));

    props.onPlayerSelectionChange(newFavoritePlayers);
  };


  // ------------------------
  // ---- Fetching data  ----
  // ------------------------
  async function getTeams() {
    let teamListResponse = await fetch(CONSTANTS.ENDPOINT.TEAM_CONSTRAINTS.TEAM_FILTER);
    return teamListResponse.json();
  }

  async function getPlayersByTeam(teams_id_checked) {
    const playerListFetchParams = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teams_id: teams_id_checked
      })
    }
    let playerListResponse = await fetch(CONSTANTS.ENDPOINT.TEAM_CONSTRAINTS.PLAYER_FILTER, playerListFetchParams);
    return playerListResponse.json();
  }

  const displayFetchErrors = (requestType, error) => {
    setWarningMessage({
      warningMessageOpen: true,
      warningMessageText: `${requestType} request failed: ${error}`
    })
  }

  React.useEffect(() => {
    // ---- initilize teams state
    getTeams()
      .then(teamList => {
        setTeams(teamList.map((teamObj) => ({ id: teamObj.team_id, value: teamObj.team_name })));
      })
      .catch(error => displayFetchErrors('GET teams', error));

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
        style={(title === 'Favorite players') ? { backgroundColor: "#797ff0" } :
            { backgroundColor: "#cfd8dc" }}
        className={classes.cardHeader}
        avatar=
        {handleToggleAll !== null ?
          (<Checkbox
            onClick={handleToggleAll(items)}
            color={title === 'Favorite players' ? 'primary' : 'default'}
            checked={numberOfCheckedItems(items) === items.length && items.length !== 0}
            indeterminate={numberOfCheckedItems(items) !== items.length && numberOfCheckedItems(items) !== 0}
            disabled={items.length === 0}
            inputProps={{ 'aria-label': 'all items selected' }}
          />)
          : ('')}
        title={title}
        titleTypographyProps={{ variant: 'h5' }}
        subheader={`${numberOfCheckedItems(items)}/${items.length} selected`}
        subheaderTypographyProps={{ variant: 'h6' }}
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
            title={title}
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
    <React.Fragment>

      <FavoritePlayersLimits
      formation={props.formation}
      favoritePlayers={favoritePlayers}
      onPlayerLimitsChange={props.onPlayerLimitsChange} />

      <Grid container spacing={1} alignItems="center" justify="center" className={classes.root}>
        <Grid item>{CustomSelectionList(false, 'Teams', 200, 300, null, numberOfCheckedTeams, teams, handleToggleTeam, checkedTeams)}</Grid>
        <Grid item>{CustomSelectionList(false, 'Position', 200, 300, handleToggleAllPositions, numberOfCheckedPositions, positions, handleTogglePosition, checkedPositions)}</Grid>
        <Grid item>{CustomSelectionList(true, 'Available players', 300, 300, null, numberOfCheckedPlayers, availablePlayers, handleTogglePlayer, checkedAvailablePlayers)}</Grid>
        <Grid item>
          <Grid container direction="column" alignItems="center" justify="center">
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.button}
              onClick={() => { handleCheckedRight() }}
              disabled={checkedAvailablePlayers.length === 0}
              aria-label="move selected right">
              Add &gt;&gt;
          </Button>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              className={classes.button}
              onClick={() => { handleCheckedLeft() }}
              disabled={checkedFavoritePlayers.length === 0}
              aria-label="move selected left">
              &lt;&lt; Remove
          </Button>
          </Grid>
        </Grid>
        <Grid item>{CustomSelectionList(false, 'Favorite players', 300, 300, handleToggleAllPlayers, numberOfCheckedPlayers, favoritePlayers, handleTogglePlayer, checkedFavoritePlayers)}</Grid>
      </Grid>

      <WarningMessage
        open={warningMessage.warningMessageOpen}
        text={warningMessage.warningMessageText}
        onWarningClose={closeWarningMessage}
      />
    </React.Fragment>
  );
}
