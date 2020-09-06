import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import WarningMessage from "../WarningMessage";
import CONSTANTS from "../../constants";
import PlayerTile from "./PlayerTile";
import { getTeamShirtByIdMap } from '../../images/Team_Shirts'
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import FilterTeamBySeasonRound from './FilterTeamBySeasonRound'
import DraggableDialog from './DraggableDialog'
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';


const MyTeam = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [season, setSeason] = useState('2019/20');
  const [round, setRound] = useState('Final');

  const [ultimatePlayers, setUltimatePlayers] = useState([]);
  const [eliminatedPlayers, setEliminatedPlayers] = useState([]);

  const [teamShirtByIdMap, setTeamShirtByIdMap] = useState({ myMap: {} });
  const [warningMessage, setWarningMessage] = useState({ warningMessageOpen: false, warningMessageText: "" });

  
  // async function handleSeasonRoundSubmit() {
  const handleSeasonRoundSubmit = () => {
    setIsLoading(true);
    displayEliminatedPlayers();
    
    calculateTeam();

    // displayTeam();
  }

  const handleSeasonChange = (e) => {
    setSeason(e.target.value);
  }

  const handleRoundChange = (e) => {
    setRound(e.target.value);
  }

  const closeWarningMessage = () => {
    setWarningMessage({
      warningMessageOpen: false,
      warningMessageText: ""
    });
  }


  async function fetchItems(fetchURL, areSeasonRoundNeeded) {
  // const fetchItems = (fetchURL, areSeasonRoundNeeded) => {
    const fetchParams = !areSeasonRoundNeeded ? ({}) : (
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          season: season,
          round: round
        })
      });
    let promiseItems = await fetch(fetchURL, fetchParams)
    // const promiseItems = fetch(fetchURL, fetchParams)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      });

    return promiseItems;
  }

  const displayEliminatedPlayers = () => {
    fetchItems(CONSTANTS.ENDPOINT.MY_TEAM.ELIMINATED_PLAYERS, true)
      .then(eliminatedPlayers => {

        console.log(eliminatedPlayers);

        setEliminatedPlayers(eliminatedPlayers);
      })
      .catch(error =>
        setWarningMessage({
          warningMessageOpen: true,
          warningMessageText: `Request to get grid text failed: ${error}`
        })
      );
  }

  const calculateTeam = () => {
    fetchItems(CONSTANTS.ENDPOINT.MY_TEAM.CALCULATE_ULTIMATE_TEAM, true)
      .then(ultimatePlayers => {
        setUltimatePlayers(ultimatePlayers);
        setIsLoading(false);
      })
      .catch(error =>
        setWarningMessage({
          warningMessageOpen: true,
          warningMessageText: `Request to get grid text failed: ${error}`
        })
      );
  }

  const displayTeam = () => {
    fetchItems(CONSTANTS.ENDPOINT.MY_TEAM.GET_ULTIMATE_TEAM, false)

      // const promiseItems = fetch(CONSTANTS.ENDPOINT.MY_TEAM.GET_ULTIMATE_TEAM, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     season: season,
      //     round: round
      //   })
      // })
      //   .then(response => {
      //     if (!response.ok) {
      //       throw Error(response.statusText);
      //     }
      //     return response.json();
      //   });

      // return promiseItems;


      .then(ultimatePlayers => {
        setUltimatePlayers(ultimatePlayers);
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
    displayEliminatedPlayers();
    displayTeam();
  }, []);


  const useStyles = makeStyles({
    chip: {
      fontSize: '1.3rem',
      padding: 12,
      margin: 5
    }
  });

  const classes = useStyles();

  const InfoChip = props => (
    <Chip
      {...props}
      className={classes.chip}
      variant="outlined"
      color="primary"
      icon={<SportsSoccerIcon />}
      // deleteIcon={<DoneIcon />}
    // onDelete={}
    />
  );


  return (
    <main id="mainContent">
      <div className="container">

        <div className="row justify-content-center mt-5 p-0">
          <h2>My Ultimate Team</h2>
        </div>

        <div className="row justify-content-center">
          <InfoChip label={`Season: ${season}`}></InfoChip>
          <InfoChip label={`Round: ${round}`}></InfoChip>
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