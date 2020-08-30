import React, { useState } from "react";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import WarningMessage from "../WarningMessage";
import CONSTANTS from "../../constants";
import ConstraintCard from "./ConstraintCard"
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Zoom from '@material-ui/core/Zoom';
import { getTeamShirtByIdMap } from '../../images/Team_Shirts'


const useStyles = makeStyles((theme) => ({
  cardGrid: {
    display: 'flex',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(6),
  },
}));


const List = () => {
  const classes = useStyles();
  const [displayed, setDisplayed] = useState(false);
  const [warningMessage, setWarningMessage] = useState({ warningMessageOpen: false, warningMessageText: "" });
  
  const [formationConstraint, setFormationConstraint] = useState();
  const [formationPositions, setFormationPositions] = useState([]);

  const [playersConstraint, setPlayersConstraint] = useState([]);
  const [teamShirtByIdMap, setTeamShirtByIdMap] = useState({ myMap: {} });


  async function fetchConstraint(fetchURL) {
    let promiseList = await fetch(fetchURL)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
    return promiseList;
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
    <main id="mainContent" className="container">
      <div className="row justify-content-center py-4">
        <h2>Team Constraints</h2>
      </div>

      {(!formationConstraint & playersConstraint.length == 0) ? (
        <center><h3>There are no Constraints</h3></center>
      ) : (
          <div className="row">
            <Container className={classes.cardGrid} maxWidth="md">
              <Grid container spacing={4}>

                {/* formation constraint */}
                {!formationConstraint ? '' : (
                  <Zoom in={displayed}>
                    <Grid item key={formationConstraint} xs={12} sm={6} md={6}>
                      <ConstraintCard
                        constraintTitle={`Formation: ${formationConstraint}`}
                        firstDescription={`${formationPositions[0]} Defenders`}
                        secondDescription={`${formationPositions[1]} Midfielders`}
                        thirdDescription={`${formationPositions[2]} Attackers`}
                        deleteConstraint={removeFormationConstraint}
                        image={getFormationImage(formationConstraint)}
                        />
                    </Grid>
                  </Zoom>
                )}

                {/* players constraint */}
                {playersConstraint.map((playerItem, index) => (
                  <Zoom key={playerItem.player_id} in={displayed} style={{ transitionDelay: displayed ? `${300 * (index + 1)}ms` : '0ms' }}>
                    <Grid item key={playerItem.player_id} xs={12} sm={6} md={6}>
                      <ConstraintCard
                        constraintTitle={playerItem.player_name}
                        firstDescription={playerItem.position}
                        secondDescription={playerItem.team_name}
                        deleteConstraint={() => removeSinglePlayerConstraint(playerItem.player_id)}
                        image={teamShirtByIdMap.get(playerItem.team_id)}
                      />

                    </Grid>
                  </Zoom>
                ))}

              </Grid>
            </Container>
          </div>
        )}

      <WarningMessage
        open={warningMessage.warningMessageOpen}
        text={warningMessage.warningMessageText}
        onWarningClose={closeWarningMessage}
      />
    </main>
  );
}

export default List;