import React, { useState } from "react";
import FormationPicking from './FormationPicking';
import PlayerSelection from './PlayerSelection'
import AdvancedConstraints from './AdvancedConstraints';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CONSTANTS from "../../constants";


const useStyles = makeStyles((theme) => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: '80%',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const steps = ['Formation picking', 'Players selection', 'Advanced constraints'];


export default function ConstraintsCheckout() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [warningMessage, setWarningMessage] = useState({warningMessageOpen: false, warningMessageText: ""});

  const onPlayerSelectionChange = selectedPlayers => {
    setSelectedPlayers(selectedPlayers);
    console.log("I am Parent component. just got info");
    console.log(selectedPlayers);
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <FormationPicking />;
      case 1:
        return <PlayerSelection onChange={onPlayerSelectionChange} />;
      case 2:
        return <AdvancedConstraints />;
      default:
        throw new Error('Unknown step');
    }
  }

  const updatePlayerSelectionConstraint = () => {
    // Warning Pop Up if the user submits an empty message
    if (!selectedPlayers) {
      setWarningMessage({
        warningMessageOpen: true,
        warningMessageText: CONSTANTS.ERROR_MESSAGE.LIST_EMPTY_MESSAGE
      });
      return;
    }

    fetch(CONSTANTS.ENDPOINT.TEAM_CONSTRAINTS.PLAYER_SELECTION, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerSelectionConstraintList: selectedPlayers
      })
    })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .catch(error =>
        setWarningMessage({
          warningMessageOpen: true,
          warningMessageText: `${CONSTANTS.ERROR_MESSAGE.LIST_ADD} ${error}`
        })
      );
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      updatePlayerSelectionConstraint();
    }
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <React.Fragment>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Constraints for your ultimate team
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel><h4><b>{label}</b></h4></StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography variant="h5" gutterBottom>
                  Thank you for setting your team constraints.
                </Typography>
                <Typography variant="subtitle1">
                  Your ultimate team of UEFA Champions League Fantasy is ready!
                </Typography>
              </React.Fragment>
            ) : (
                <React.Fragment>

                  <div width="500px">
                    {getStepContent(activeStep)}
                  </div>

                  <div className={classes.buttons}>
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
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </div>
                </React.Fragment>
              )}
          </React.Fragment>
        </Paper>
      </main>
    </React.Fragment>
  );
}
