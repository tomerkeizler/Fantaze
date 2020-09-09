import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import WarningMessage from "../WarningMessage";
import CONSTANTS from "../../constants";
import PlayerConstraintCard from "./PlayerConstraintCard"
import FormationConstraintCard from "./FormationConstraintCard"
import Zoom from '@material-ui/core/Zoom';
import { getTeamShirtByIdMap } from '../../images/Team_Shirts'
import Chip from '@material-ui/core/Chip';


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
  }
}));


const ConstraintsView = () => {
  const classes = useStyles();
  const [displayed, setDisplayed] = useState(false);
  const [warningMessage, setWarningMessage] = useState({ warningMessageOpen: false, warningMessageText: "" });

  const [formationPositions, setFormationPositions] = useState([]);
  const [teamShirtByIdMap, setTeamShirtByIdMap] = useState({ myMap: {} });

  const [formationConstraint, setFormationConstraint] = useState();
  const [playersConstraint, setPlayersConstraint] = useState([]);


  async function fetchConstraint(fetchURL) {
    let response = await fetch(fetchURL)
    return response.json();
  }

  const removeFormationConstraint = () => {
    fetch(`${CONSTANTS.ENDPOINT.TEAM_CONSTRAINTS.FORMATION_PICK}/1`, { method: "DELETE", })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then(() => {
        setFormationConstraint('');
        setFormationPositions([]);
      })
      .catch(error => {
        setWarningMessage({
          warningMessageOpen: true,
          warningMessageText: `${CONSTANTS.ERROR_MESSAGE.LIST_DELETE} ${error}`
        });
      });
  }

  const removeSinglePlayerConstraint = (playerID) => {
    fetch(`${CONSTANTS.ENDPOINT.TEAM_CONSTRAINTS.PLAYER_SELECTION}/${playerID}`, { method: "DELETE" })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then(result => {
        setPlayersConstraint(playersConstraint.filter(player => player.player_id !== result.player_id));
      })
      .catch(error => {
        setWarningMessage({
          warningMessageOpen: true,
          warningMessageText: `${CONSTANTS.ERROR_MESSAGE.LIST_DELETE} ${error}`
        });
      });
  }

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

    fetchConstraint(CONSTANTS.ENDPOINT.TEAM_CONSTRAINTS.FORMATION_PICK)
      .then(formation => {
        setFormationConstraint(formation)
        setFormationPositions(formation.split('-', 3));
      })
      .catch(error =>
        setWarningMessage({
          warningMessageOpen: true,
          warningMessageText: `${CONSTANTS.ERROR_MESSAGE.LIST_GET} ${error}`
        })
      );

    fetchConstraint(CONSTANTS.ENDPOINT.TEAM_CONSTRAINTS.PLAYER_SELECTION)
      .then(players => { setPlayersConstraint(players) })
      .catch(error =>
        setWarningMessage({
          warningMessageOpen: true,
          warningMessageText: `${CONSTANTS.ERROR_MESSAGE.LIST_GET} ${error}`
        })
      );

    setDisplayed(true);
  }, []);


  return (
    <div>
      {(!formationConstraint && playersConstraint.length === 0) ? (
        <center>
          <Chip className={classes.chip} color="primary" label="There are no Constraints" />
        </center>
      ) : (

          <div className={classes.cardGrid} maxWidth="md">

            {/* formation constraint */}
            {!formationConstraint ? '' : (
              <Zoom in={displayed}>
                <div className={classes.formationCardItem}>
                  <FormationConstraintCard
                    constraintTitle={formationConstraint}
                    numOfDefenders={`${formationPositions[0]} Defenders`}
                    numOfMidfielders={`${formationPositions[1]} Midfielders`}
                    numOfAttackers={`${formationPositions[2]} Attackers`}
                    deleteConstraint={removeFormationConstraint}
                    image={getFormationImage(formationConstraint)} />
                </div>
              </Zoom>
            )}

            {/* players constraint */}
            {playersConstraint.map((playerItem, index) => (
              <Zoom in={displayed} key={playerItem.player_id}
                style={{ transitionDelay: displayed ? `${300 * (index + 1)}ms` : '0ms' }}>
                <div className={classes.playerCardItem}>
                  <PlayerConstraintCard
                    constraintTitle={playerItem.player_name}
                    position={playerItem.position}
                    teamName={playerItem.team_name}
                    deleteConstraint={() => removeSinglePlayerConstraint(playerItem.player_id)}
                    image={teamShirtByIdMap.get(playerItem.team_id)} />
                </div>
              </Zoom>
            ))}

          </div>
        )}

      <WarningMessage
        open={warningMessage.warningMessageOpen}
        text={warningMessage.warningMessageText}
        onWarningClose={closeWarningMessage}
      />
    </div>
  );
}

export default ConstraintsView;