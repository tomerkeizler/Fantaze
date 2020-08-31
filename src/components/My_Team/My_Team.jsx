import React, { useState } from "react";
import WarningMessage from "../WarningMessage";
import CONSTANTS from "../../constants";
import PlayerTile from "./PlayerTile";
import { getTeamShirtByIdMap } from '../../images/Team_Shirts'
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import FilterTeamBySeasonRound from './FilterTeamBySeasonRound'
import DraggableDialog from './DraggableDialog'


const MyTeam = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [season, setSeason] = useState('2019/20');
  const [round, setRound] = useState('Final');

  const [ultimatePlayers, setUltimatePlayers] = useState([]);
  const [eliminatedPlayers, setEliminatedPlayers] = useState([]);

  const [teamShirtByIdMap, setTeamShirtByIdMap] = useState({ myMap: {} });
  const [warningMessage, setWarningMessage] = useState({ warningMessageOpen: false, warningMessageText: "" });

  const handleSeasonChange = (e) => {
    setSeason(e.target.value);
  }

  const handleRoundChange = (e) => {
    setRound(e.target.value);
  }

  const getItems = () => {
    const promiseItems = fetch(CONSTANTS.ENDPOINT.MY_TEAM.CHOSEN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        year: season,
        round: round
      })
    })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      });

    return promiseItems;
  }

  const closeWarningMessage = () => {
    setWarningMessage({
      warningMessageOpen: false,
      warningMessageText: ""
    });
  }

  const handleSeasonRoundSubmit = () => {
    setIsLoading(true);
    updateTeam();
  }

  const updateTeam = () => {
    getItems()
      .then(res => {
        setUltimatePlayers(res.choosen);
        setEliminatedPlayers(res.defeated);
        setIsLoading(false);
      })
      .catch(error =>
        setWarningMessage({
          warningMessageOpen: true,
          warningMessageText: `Request to get grid text failed: ${error}`
        })
      );
  }

  React.useEffect(() => {
    setTeamShirtByIdMap(getTeamShirtByIdMap());
    // updateTeam();
  }, []);


  return (
    <main id="mainContent">
      <div className="container">
        <div className="row justify-content-center mt-5 p-0">
          <h3>My Ultimate Team</h3>
        </div>

        <DraggableDialog
        selectedSeason={season}
        selectedRound={round}
        data={eliminatedPlayers}
        />

        <FilterTeamBySeasonRound
        onSeasonChange={handleSeasonChange}
        onRoundChange={handleRoundChange}
        onSubmit={handleSeasonRoundSubmit}
        />

        {isLoading ? (
          <Grid container direction="column" justify="center" alignItems="center">
            <CircularProgress size={100} thickness={2} />
            <Typography gutterBottom variant="h5" color="textSecondary">
              Loading team...
          </Typography>
          </Grid>
        ) :
          (<div className="row justify-content-around text-center pb-5">
            {ultimatePlayers.map(item => (
              <PlayerTile
                key={item.player_id}
                item={item}
                teamShirtImage={teamShirtByIdMap.get(item.team_id)}
              />
            ))}
          </div>)}

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