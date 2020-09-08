import React, { useState } from "react";
import FormationPicking from './FormationPicking';
import PlayerSelection from './PlayerSelection'
import AdvancedConstraints from './AdvancedConstraints';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
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
    padding: theme.spacing(0, 0, 3),
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
    marginBottom: 30,
  }
}));

const steps = ['Formation picking', 'Players selection', 'Teams selection'];


export default function ConstraintsCheckout() {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formation, setFormation] = useState('4-3-3');
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [warningMessage, setWarningMessage] = useState({ warningMessageOpen: false, warningMessageText: "" });

  const closeWarningMessage = () => {
    setWarningMessage({
      warningMessageOpen: false,
      warningMessageText: ""
    });
  }

  const onFormationChange = newFormation => {
    setFormation(newFormation);
  };

  const onPlayerSelectionChange = selectedPlayers => {
    setSelectedPlayers(selectedPlayers);
  };

  function getStepTitle(step) {
    switch (step) {
      case 0:
        return 'Pick your desired football formation'
      case 1:
        return 'Select your favorite players'
      case 2:
        return 'Select your favorite teams'
      default:
        throw new Error('Unknown step');
    }
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <FormationPicking onChange={onFormationChange} />;
      case 1:
        return <PlayerSelection onChange={onPlayerSelectionChange} />;
      case 2:
        return <AdvancedConstraints />;
      default:
        throw new Error('Unknown step');
    }
  }

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

  async function handleSubmitConstraints() {
    const updateConstraintsFetchParams = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formationPickConstraint: formation,
        playerSelectionConstraintList: selectedPlayers
      })
    }
    setIsLoading(true);

    let jsonUpdateApproval = await fetchItems(CONSTANTS.ENDPOINT.TEAM_CONSTRAINTS.UPDATE, updateConstraintsFetchParams)
      .catch(error => displayFetchErrors('Constraints updating', error));

    let jsonUltimateTeam = await fetchItems(CONSTANTS.ENDPOINT.MY_TEAM.CALCULATE_GET_ULTIMATE_TEAM, {})
      .catch(error => displayFetchErrors('Ultimate team', error));

    window.location = 'My_Team';
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmitConstraints();
    }
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <React.Fragment>
      <main className={classes.layout}>
        <Stepper activeStep={activeStep} className={classes.stepper}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel><h4><b>{label}</b></h4></StepLabel>
            </Step>
          ))}
        </Stepper>
        <React.Fragment>
          {activeStep === steps.length ? (
            <div className={classes.centralize}>
              <Typography variant="h5" gutterBottom>
                Thank you for setting your team constraints.
                </Typography>
              <Typography variant="subtitle1">
                Your ultimate team of UEFA Champions League Fantasy is ready!
                </Typography>
            </div>
          ) : (
              <React.Fragment>

                <div className={classes.centralize}>
                  <Chip className={classes.chip} color="primary" label={getStepTitle(activeStep)} />

                  {getStepContent(activeStep)}

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
                      color="primary"
                      onClick={handleNext}
                      className={classes.button}>
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next step'}
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
    </React.Fragment>
  );
}
