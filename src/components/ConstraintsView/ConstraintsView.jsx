import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import WarningMessage from "../WarningMessage";
import CONSTANTS from "../../constants";
import PlayerConstraintCard from "./PlayerConstraintCard"
import FormationConstraintCard from "./FormationConstraintCard"
import Zoom from '@material-ui/core/Zoom';
import { getTeamShirtByIdMap } from '../../images/Team_Shirts'
import Chip from '@material-ui/core/Chip';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import LoadingTeamScreen from '../My_Team/LoadingTeamScreen'


const useStyles = makeStyles((theme) => ({
  cardGrid: {
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'flex-start',
    alignContent: 'space-around',
    margin: theme.spacing(0),
  },
  formationCardItem: {
    flex: '2 0 content',
    margin: theme.spacing(2),
  },
  playerCardItem: {
    flex: '1 0 content',
    margin: theme.spacing(2),
  },
  chip: {
    fontSize: '2rem',
    padding: 25,
    marginBottom: 30
  },
  removeAllButton: {
    marginTop: theme.spacing(1),
    '&:hover': {
      background: 'lightgray',
      color: 'black',
    },
  },
}));


const ConstraintsView = () => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [warningMessage, setWarningMessage] = useState({ warningMessageOpen: false, warningMessageText: "" });
  const [teamShirtByIdMap, setTeamShirtByIdMap] = useState({ myMap: {} });

  const [formationConstraint, setFormationConstraint] = useState({ value: '', isVisible: false });
  const [playersConstraint, setPlayersConstraint] = useState([]);

  const [isFormationToDelete, setIsFormationToDelete] = useState(false);
  const [playersToDeleteListID, setPlayersToDeleteListID] = useState([]);

  /* ---------------------------------------------
    ------------ General fetch function ------------
    --------------------------------------------- */

  async function customFetch(fetchURL, isDeleteRequest) {
    const fetchParams = isDeleteRequest ? { method: "DELETE" } : {};
    let response = await fetch(fetchURL, fetchParams);
    return response.json();
  }

  const displayFetchErrors = (requestType, error) => {
    setWarningMessage({
      warningMessageOpen: true,
      warningMessageText: `${requestType} request failed: ${error}`
    })
  }

  /* -----------------------------------------
  ----------- fetch calls - DELETE -----------
  ----------------------------------------- */

  const deleteFormationConstraint = () => {
    if (isFormationToDelete)
      customFetch(`${CONSTANTS.ENDPOINT.TEAM_CONSTRAINTS.FORMATION_PICK}/1`, true)
        .then(setFormationConstraint({ value: '', isVisible: false }))
        .catch(error => displayFetchErrors('DELETE formation', error));
  }

  const deletePlayerConstraint = () => {
    playersToDeleteListID.map(playerID => {
      customFetch(`${CONSTANTS.ENDPOINT.TEAM_CONSTRAINTS.PLAYER_SELECTION}/${playerID}`, true)
        .catch(error => displayFetchErrors('DELETE player', error));
      setPlayersConstraint(playersConstraint.filter(({ player_id }) => !playersToDeleteListID.includes(player_id)));
    });
  }

  /* -----------------------------------------------
  ----------- remove constraints locally -----------
  ----------------------------------------------- */

  const removeFormationConstraintLocally = () => {
    setIsFormationToDelete(true);
  }

  const removePlayerConstraintLocally = (playerToDeleteID) => {
    setPlayersToDeleteListID([...playersToDeleteListID, playerToDeleteID]);
  }

  /* -----------------------------------------------
  ----------- restore constraints locally -----------
  ----------------------------------------------- */

  const restoreFormationConstraintLocally = () => {
    setIsFormationToDelete(false);
  }

  const restorePlayerConstraintLocally = (playerToRestoreID) => {
    setPlayersToDeleteListID(playersToDeleteListID.filter(playerID => playerID !== playerToRestoreID));
  }

  /* ----------------------------------------------------------
  ----------- DELETE selected constraints entyirely -----------
  ---------------------------------------------------------- */

  async function deleteConstraints() {
    /* ---------------------------------------------------------------------------
    marking selected constraints as hidden (for triggering disappearing animation)
    --------------------------------------------------------------------------- */
    if (isFormationToDelete)
      setFormationConstraint(oldFormationConstraint => ({ value: oldFormationConstraint.value, isVisible: false }));

    setPlayersConstraint(playersConstraint.map(player => (
      (playersToDeleteListID.includes(player.player_id)) ? { ...player, isVisible: false } : player
    )))

    /* --------------------------------------------------------------
    removing selected constraints
    both from react states (for rearranging the grid) and from server
    -------------------------------------------------------------- */
    setTimeout(() => {
      deleteFormationConstraint();
      deletePlayerConstraint();
    }, 1000)

    /* -------------------------------------------------
    calculate ultimate team and redirect to My team page
    ------------------------------------------------- */
    setIsLoading(true);
    let jsonUltimateTeam = await customFetch(CONSTANTS.ENDPOINT.MY_TEAM.CALCULATE_GET_ULTIMATE_TEAM, false)
      .catch(error => displayFetchErrors('Ultimate team', error));
    window.location = 'My_Team';
  }

  /* ----------------------------
  ----------- general -----------
  ---------------------------- */

  const closeWarningMessage = () => {
    setWarningMessage({
      warningMessageOpen: false,
      warningMessageText: ""
    });
  };

  const getFormationImage = (formation) => {
    switch (formation) {
      case '4-3-3':
        return 'https://montreal-mp7static.mlsdigital.net/elfinderimages/1-4-3-3.png';
      case '4-5-1':
        return 'https://montreal-mp7static.mlsdigital.net/elfinderimages/1-4-2-3-1.png';
      case '4-4-2':
        return 'https://montreal-mp7static.mlsdigital.net/elfinderimages/1-4-4-2%20flat.png';
      case '3-5-2':
        return 'https://montreal-mp7static.mlsdigital.net/elfinderimages/1-3-5-2.png';
      case '3-4-3':
        return 'https://montreal-mp7static.mlsdigital.net/elfinderimages/1-3-4-3%20diamant.png';
      default:
        return 'https://montreal-mp7static.mlsdigital.net/elfinderimages/1-5-3-2.png';
    }
  };

  React.useEffect(() => {
    setTeamShirtByIdMap(getTeamShirtByIdMap());

    customFetch(CONSTANTS.ENDPOINT.TEAM_CONSTRAINTS.FORMATION_PICK, false)
      .then(formation => setFormationConstraint({ value: formation, isVisible: true }))
      .catch(error => displayFetchErrors('GET formation', error));

    customFetch(CONSTANTS.ENDPOINT.TEAM_CONSTRAINTS.PLAYER_SELECTION, false)
      .then(players => setPlayersConstraint(players.map(player => ({ ...player, isVisible: true }))))
      .catch(error => displayFetchErrors('GET player selection', error));
  }, []);

  /* ---------------------------
  ----------- render -----------
  --------------------------- */

  return (
    <div>
      {(!formationConstraint.value && playersConstraint.length === 0) ? (
        <center>
          <Chip className={classes.chip} color="primary" label="There are no Constraints" />
        </center>
      ) : (
          <div>
            <center>
              <Zoom in={(isFormationToDelete || playersToDeleteListID.length > 0) ? true : false}>
                <Button variant="outlined" size="large"
                  startIcon={<DeleteIcon />}
                  className={classes.removeAllButton}
                  onClick={() => { deleteConstraints() }}>
                  Remove selected constraints
              </Button>
              </Zoom>
            </center>

            <div className={classes.cardGrid} maxWidth="md">
              {/* -------- formation constraint -------- */}
              {!formationConstraint.value ? '' : (
                <Zoom in={formationConstraint.isVisible}>
                  <div className={classes.formationCardItem}>
                    <FormationConstraintCard
                      formation={formationConstraint.value}
                      onRemoveFormation={removeFormationConstraintLocally}
                      onRestoreFormation={restoreFormationConstraintLocally}
                      image={getFormationImage(formationConstraint.value)} />
                  </div>
                </Zoom>
              )}

              {/* -------- players constraint -------- */}
              {playersConstraint.map((playerItem, index) => (
                <Zoom in={playerItem.isVisible} key={playerItem.player_id}
                  style={{ transitionDelay: playerItem.isVisible ? `${300 * (index + 1)}ms` : '0ms' }}>
                  <div className={classes.playerCardItem}>
                    <PlayerConstraintCard
                      player={playerItem}
                      onRemovePlayer={removePlayerConstraintLocally}
                      onRestorePlayer={restorePlayerConstraintLocally}
                      image={teamShirtByIdMap.get(playerItem.team_id)} />
                  </div>
                </Zoom>
              ))}
            </div>
          </div>
        )}

      <LoadingTeamScreen isLoading={isLoading} text="Updating constraints..." />

      <WarningMessage
        open={warningMessage.warningMessageOpen}
        text={warningMessage.warningMessageText}
        onWarningClose={closeWarningMessage}
      />
    </div>
  );
}

export default ConstraintsView;