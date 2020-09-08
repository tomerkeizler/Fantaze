import React, { useState } from "react";
import WarningMessage from "../WarningMessage";
import CONSTANTS from "../../constants";
import PlayerTile from "./PlayerTile";
import { getTeamShirtByIdMap } from '../../images/Team_Shirts'
import FilterTeamBySeasonRound from './FilterTeamBySeasonRound'
import DraggableDialog from './DraggableDialog'
import LoadingTeamScreen from './LoadingTeamScreen'


const MyTeam = () => {
  const [season, setSeason] = useState('');
  const [round, setRound] = useState('');

  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedRound, setSelectedRound] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [ultimatePlayers, setUltimatePlayers] = useState([]);
  const [eliminatedPlayers, setEliminatedPlayers] = useState([]);

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
      displayEliminatedPlayers();
      displayTeam(true);
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
    // let promiseItems = await response.json();
    // return promiseItems;
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

  const displayEliminatedPlayers = () => {
    fetchItems(CONSTANTS.ENDPOINT.MY_TEAM.ELIMINATED_PLAYERS, false)
      .then(eliminatedPlayers => {
        setEliminatedPlayers(eliminatedPlayers);
      })
      .catch(error => displayFetchErrors('Eliminated players', error));
  }

  const displayTeam = (isCalculateNeeded) => {
    let fetchURL = isCalculateNeeded ?
      CONSTANTS.ENDPOINT.MY_TEAM.CALCULATE_GET_ULTIMATE_TEAM :
      CONSTANTS.ENDPOINT.MY_TEAM.GET_ULTIMATE_TEAM;
    fetchItems(fetchURL, false)
      .then(ultimatePlayers => {
        setUltimatePlayers(ultimatePlayers);
        setIsLoading(false);
      })
      .catch(error => displayFetchErrors('Ultimate team', error));
  }

  /* ------------------------------------------
  ------------- Initializing page -------------
  ------------------------------------------ */

  React.useEffect(() => {
    setTeamShirtByIdMap(getTeamShirtByIdMap());
    getSeasonRound();
    displayEliminatedPlayers();
    displayTeam(false);
  }, []);


  return (
    <main id="mainContent">
      <div className="container">

        <div className="row justify-content-center mt-5 p-0">
          <h2>My Ultimate Team</h2>
        </div>

        <FilterTeamBySeasonRound
          doesTeamExist={ultimatePlayers.length}
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

        {(ultimatePlayers.length > 0 && !isLoading) ?
          (<div className="row justify-content-around text-center pb-5">
            {ultimatePlayers.map(item => (
              <PlayerTile
                key={item.player_id}
                item={item}
                teamShirtImage={teamShirtByIdMap.get(item.team_id)}
              />
            ))}
          </div>)
          : (<h3></h3>)}

        {(ultimatePlayers.length > 0) ?
          (<DraggableDialog
            selectedSeason={season}
            selectedRound={round}
            data={eliminatedPlayers}
          />)
          : (<h3></h3>)}

        <WarningMessage
          open={warningMessage.warningMessageOpen}
          text={warningMessage.warningMessageText}
          onWarningClose={closeWarningMessage}
        />
      </div>
    </main>
  );
}

export default MyTeam;