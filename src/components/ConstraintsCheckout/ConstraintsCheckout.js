import React, { useState } from "react";
import FormationPicking from './FormationPicking/FormationPicking';
import PlayerSelection from './PlayerSelection/PlayerSelection'
import AdvancedConstraints from './AdvancedConstraints';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import CONSTANTS from "../../constants";
import WarningMessage from "../WarningMessage";
import LoadingTeamScreen from '../My_Team/LoadingTeamScreen'
import Chip from '@material-ui/core/Chip';


const useStyles = makeStyles((theme) => ({
  layout: {
    width: '100%',
    // margin: theme.spacing(3),
    // [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
    //   width: '100%',
    //   marginLeft: '15',
    //   marginTop: '15',
    // },
  },
  stepper: {
    padding: theme.spacing(0, 0, 2),
  },
  centralize: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  chip: {
    fontSize: '1.5rem',
    padding: 18,
    marginBottom: 20,
  }
}));


export default function ConstraintsCheckout() {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isPlayerSelectionValid, setIsPlayerSelectionValid] = useState();
  const [formation, setFormation] = useState('4-3-3');
  const [favoritePlayers, setFavoritePlayers] = useState([]);
  const [warningMessage, setWarningMessage] = useState({ warningMessageOpen: false, warningMessageText: "" });

  const closeWarningMessage = () => {
    setWarningMessage({
      warningMessageOpen: false,
      warningMessageText: ""
    });
  }

  /* ---------------------------------------
 ------------ Constraints steps ------------
 --------------------------------------- */

  const steps = [
    {
      'label': 'Formation picking',
      'title': 'Pick your desired football formation',
      'validity': true,
      'component': <FormationPicking onChange={onFormationChange} />
    },
    {
      'label': 'Players selection',
      'title': 'Select your favorite players',
      'validity': isPlayerSelectionValid,
      'component': <PlayerSelection
        onPlayerSelectionChange={onPlayerSelectionChange}
        onPlayerLimitsChange={onPlayerLimitsChange}
        formation={formation} />
    },
    {
      'label': 'Teams selection',
      'title': 'Select your favorite teams',
      'validity': true,
      'component': <AdvancedConstraints />
    }
  ]

  function getStep(stepNumber, key) {
    switch (stepNumber) {
      case 0:
      case 1:
      case 2:
        return steps[stepNumber][key];
      default:
        throw new Error('Unknown step');
    }
  }

  /* ------------------------------------
  ----------- Fetch functions -----------
  ------------------------------------ */

  async function fetchItems(fetchURL, fetchParams) {
    let response = await fetch(fetchURL, fetchParams);
    return response.json();
  }

  const displayFetchErrors = (requestType, error) => {
    setWarningMessage({
      warningMessageOpen: true,
      warningMessageText: `${requestType} request failed: ${error}`
    })
  }

  /* ------------------------------------------------
  ----------- Constraints change Handlers -----------
  ------------------------------------------------ */

  function onFormationChange(newFormation) {
    setFormation(newFormation);
  };

  function onPlayerSelectionChange(selectedPlayers) {
    setFavoritePlayers(selectedPlayers);
  };

  function onPlayerLimitsChange(playerSelectionValidity) {
    setIsPlayerSelectionValid(playerSelectionValidity);
  };

  async function handleSubmitConstraints() {
    const updateConstraintsFetchParams = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formationPickConstraint: formation,
        playerSelectionConstraintList: favoritePlayers
      })
    }
    setIsLoading(true);

    let jsonUpdateApproval = await fetchItems(CONSTANTS.ENDPOINT.TEAM_CONSTRAINTS.UPDATE, updateConstraintsFetchParams)
      .catch(error => displayFetchErrors('Constraints updating', error));

    let jsonUltimateTeam = await fetchItems(CONSTANTS.ENDPOINT.MY_TEAM.CALCULATE_GET_ULTIMATE_TEAM, {})
      .catch(error => displayFetchErrors('Ultimate team', error));

    window.location = 'My_Team';
  };

  /* --------------------------------------
  ----------- Stepping handlers -----------
  -------------------------------------- */

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmitConstraints();
    }
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  /* -----------------------------------
  ----------- Main component -----------
  ----------------------------------- */

  return (
    <React.Fragment>
      <main className={classes.layout}>
        <Stepper activeStep={activeStep} className={classes.stepper}>
          {steps.map(({ label }) => (
            <Step key={label}>
              <StepLabel><h4><b>{label}</b></h4></StepLabel>
            </Step>
          ))}
        </Stepper>
        <React.Fragment>
          {activeStep === steps.length ? (
            <div className={classes.centralize}>
              <h3>Thank you for setting your team constraints</h3>
            </div>
          ) : (
              <React.Fragment>

                <div className={classes.centralize}>
                  <Chip className={classes.chip} color="primary" label={getStep(activeStep, 'title')} />

                  {getStep(activeStep, 'component')}

                  <div>
                    {activeStep !== 0 && (
                      <Button
                        variant="contained"
                        onClick={handleBack}
                        className={classes.button}>
                        Back
                    </Button>
                    )}
                    <Button
                      variant="contained"
                      disabled={!getStep(activeStep, 'validity')}
                      color="primary"
                      // color={!getStep(activeStep, 'validity')? `secondary` : `primary`}
                      onClick={handleNext}
                      className={classes.button}>
                      {activeStep === steps.length - 1 ? 'Create ultimate team' : 'Next step'}
                    </Button>
                  </div>

                </div>
              </React.Fragment>
            )}
        </React.Fragment>

        <LoadingTeamScreen isLoading={isLoading} text="Applying constraints..." />

        <WarningMessage
          open={warningMessage.warningMessageOpen}
          text={warningMessage.warningMessageText}
          onWarningClose={closeWarningMessage}
        />
      </main>
    </React.Fragment >
  );
}
