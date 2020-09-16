import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import WarningMessage from "../WarningMessage";
import CONSTANTS from "../../constants";
import PlayerTile from "./PlayerTile";
import { getTeamShirtByIdMap } from '../../images/Team_Shirts'
import FilterTeamBySeasonRound from './FilterTeamBySeasonRound'
import DraggableDialog from './DraggableDialog'
import LoadingTeamScreen from './LoadingTeamScreen'
import Chip from '@material-ui/core/Chip';
import ClearIcon from '@material-ui/icons/Clear';
import DoneIcon from '@material-ui/icons/Done';
import Zoom from '@material-ui/core/Zoom';


const useStyles = makeStyles((theme) => ({
  largeChip: {
    fontSize: '2rem',
    padding: 25,
    marginTop: 60
  },
  chip: {
    fontSize: '1.3rem',
    padding: 12,
    margin: 2
  },
}));


const MyTeam = () => {
  const classes = useStyles();

  const [season, setSeason] = useState('');
  const [round, setRound] = useState('');

  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedRound, setSelectedRound] = useState('');

  const [ultimatePlayers, setUltimatePlayers] = useState([]);
  const [selectedPlayersIncluded, setSelectedPlayersIncluded] = useState([]);
  const [selectedPlayersEliminated, setSelectedPlayersEliminated] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isTeamDisplayed, setIsTeamDisplayed] = useState(false);

  const [welcomeWindow, setWelcomeWindow] = useState();
  const [formation, setFormation] = useState('4-3-3');
  const [teamShirtByIdMap, setTeamShirtByIdMap] = useState({ myMap: {} });
  const [warningMessage, setWarningMessage] = useState({ warningMessageOpen: false, warningMessageText: "" });

  const closeWarningMessage = () => {
    setWarningMessage({
      warningMessageOpen: false,
      warningMessageText: ""
    });
  }

  /* ----------------------------------------------
  ------------ Team and round handlers ------------
  ---------------------------------------------- */

  const initiateSeasonRoundSelections = () => {
    setSelectedSeason(season);
    setSelectedRound(round);
  }

  const handleSeasonRoundSubmit = () => {
    if (selectedSeason !== season || selectedRound !== round || !ultimatePlayers.length) {
      setIsLoading(true);
      setSeason(selectedSeason);
      setRound(selectedRound);
      storeSeasonRound();
      displayTeam(true);
      displaySelectedPlayers();
    }
  }

  const handleSeasonChange = (e) => {
    setSelectedSeason(e.target.value);
  }

  const handleRoundChange = (e) => {
    setSelectedRound(e.target.value);
  }

  /* ---------------------------------------------
  ------------ General fetch function ------------
  --------------------------------------------- */

  async function fetchItems(fetchURL, areSeasonRoundNeeded) {
    const fetchParams = !areSeasonRoundNeeded ? ({}) : (
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          season: selectedSeason,
          round: selectedRound
        })
      });
    let response = await fetch(fetchURL, fetchParams);
    return response.json();
  }

  const displayFetchErrors = (requestType, error) => {
    setWarningMessage({
      warningMessageOpen: true,
      warningMessageText: `${requestType} request failed: ${error}`
    })
  }

  /* ---------------------------------------------------
  ----------- fetch calls - season and round -----------
  --------------------------------------------------- */

  const getSeasonRound = () => {
    fetchItems(CONSTANTS.ENDPOINT.MY_TEAM.SEASON_ROUND, false)
      .then(res => {
        setSeason(res.season);
        setSelectedSeason(res.season);
        setRound(res.round);
        setSelectedRound(res.round);
      })
      .catch(error => displayFetchErrors('GET Season and round', error));
  }

  const storeSeasonRound = () => {
    fetchItems(CONSTANTS.ENDPOINT.MY_TEAM.SEASON_ROUND, true)
      .catch(error => displayFetchErrors('POST Season and round', error));
  }

  /* ----------------------------------------------------------------
  ------------ fetch calls - team and eliminated players ------------
  ---------------------------------------------------------------- */

  const displaySelectedPlayers = () => {
    fetchItems(CONSTANTS.ENDPOINT.MY_TEAM.INCLUDED_AND_ELIMINATED_SELECTED_PLAYERS, false)
      .then(res => {
        setSelectedPlayersIncluded(res.included_players);
        setSelectedPlayersEliminated(res.eliminated_players);
      })
      .catch(error => displayFetchErrors('GET included and eliminated players', error));

  }


  const displayTeam = (isCalculateNeeded) => {
    let fetchURL = isCalculateNeeded ?
      CONSTANTS.ENDPOINT.MY_TEAM.CALCULATE_GET_ULTIMATE_TEAM :
      CONSTANTS.ENDPOINT.MY_TEAM.GET_ULTIMATE_TEAM;
    fetchItems(fetchURL, false)
      .then(ultimatePlayers => {
        setUltimatePlayers(ultimatePlayers);
        setIsLoading(false);

        if (ultimatePlayers.length > 0)
          setIsTeamDisplayed(true);
        else
          setWelcomeWindow(<DraggableDialog />);
      })
      .catch(error => displayFetchErrors('Ultimate team', error));
  }

  /* ------------------------------------------
  ------------- Initializing page -------------
  ------------------------------------------ */

  React.useEffect(() => {
    fetchItems(CONSTANTS.ENDPOINT.TEAM_CONSTRAINTS.FORMATION_PICK, false)
      .then(res => { if (res) setFormation(res) })
      .catch(error => displayFetchErrors('GET formation', error));

    setTeamShirtByIdMap(getTeamShirtByIdMap());
    getSeasonRound();
    displaySelectedPlayers();
    displayTeam(false);
  }, []);


  /* ------------------------------------------
  ------------ interior components ------------
  ------------------------------------------ */

  function FavoritePlayersInfo() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {selectedPlayersIncluded.length ?
          (<div className="row justify-content-center" style={{ marginBottom: 14 }}>
            <Chip label={`${selectedPlayersIncluded.length} favorites included`}
              color="primary" className={classes.chip} />
            {selectedPlayersIncluded.map(player =>
              <Chip key={player.player_id} label={player.player_name} color="primary" variant="outlined" className={classes.chip} icon={<DoneIcon />} />
            )}
          </div>)
          : (<></>)}

        {selectedPlayersEliminated.length ?
          (<div className="row justify-content-center" style={{ marginBottom: 14 }}>
            <Chip label={`${selectedPlayersEliminated.length} favorites eliminated`}
              color="secondary" className={classes.chip} />
            {selectedPlayersEliminated.map(player =>
              <Chip key={player.player_id} label={player.player_name} color="secondary" variant="outlined" className={classes.chip} icon={<ClearIcon />} />
            )}
          </div>)
          : (<></>)}
      </div>
    );
  }

  function UltimateTeamDisplay() {
    return (
      ['Goalkeeper', 'Defender', 'Midfielder', 'Attacker'].map((position, i) => (
        <div key={position} className="row justify-content-around text-center">
          {ultimatePlayers.filter(player => player.position === position)
            .map(item => (
              // <Zoom in={isTeamDisplayed} key={item.player_id}
              //   style={{ transitionDelay: isTeamDisplayed ? `${600 * i}ms` : '0ms' }}>
              //   <div>
                  <PlayerTile
                    item={item}
                    teamShirtImage={teamShirtByIdMap.get(item.team_id)}
                  />
                /* </div>
              </Zoom> */
            ))}
        </div>
      ))
    );
  }

  /* --------------------------------------
  -------------- main render --------------
  -------------------------------------- */

  return (
    <main id="mainContent">

      <FilterTeamBySeasonRound
        doesTeamExist={ultimatePlayers.length}
        formation={formation}

        onClose={initiateSeasonRoundSelections}
        onSubmit={handleSeasonRoundSubmit}

        currentSeason={season}
        selectedSeason={selectedSeason}
        onSeasonChange={handleSeasonChange}

        currentRound={round}
        selectedRound={selectedRound}
        onRoundChange={handleRoundChange}
      />

      <LoadingTeamScreen isLoading={isLoading} text="Loading team..." />

      {/* {(ultimatePlayers.length > 0 && !isLoading) ? */}
      {(isTeamDisplayed) ?
        (<>
          <FavoritePlayersInfo />
          <UltimateTeamDisplay />
        </>)
        : (!isLoading) ? (welcomeWindow) : (<h3></h3>)}

      <WarningMessage
        open={warningMessage.warningMessageOpen}
        text={warningMessage.warningMessageText}
        onWarningClose={closeWarningMessage}
      />
    </main>
  );
}

export default MyTeam;