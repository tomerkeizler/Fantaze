import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ListSubheader from '@material-ui/core/ListSubheader';
import DeleteIcon from '@material-ui/icons/Delete';
import SendIcon from '@material-ui/icons/Send';
import Chip from '@material-ui/core/Chip';
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';
import SettingsIcon from '@material-ui/icons/Settings';
import Grid from '@material-ui/core/Grid';
import EventNoteIcon from '@material-ui/icons/EventNote';
import ScheduleIcon from '@material-ui/icons/Schedule';


const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  chip: {
    fontSize: '1.3rem',
    padding: 12,
    margin: 5
  },
  blueButton: {
    margin: theme.spacing(1),
    '&:hover': {
      background: "#3f51b5",
      color: 'white',
    },
  },
  redButton: {
    margin: theme.spacing(1),
    '&:hover': {
      background: "#f00",
      color: 'white',
    },
  },
}));


export default function FilterTeamBySeasonRound(props) {
  const classes = useStyles();
  const [doesTeamExist, setDoesTeamExist] = useState(false);
  const [open, setOpen] = useState(false);
  const [teamFormation, setTeamFormation] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const ClickableChip = props => (
    <Chip
      {...props}
      // variant="outlined"
      className={classes.chip}
      onDelete={handleClickOpen}
    />
  );

  React.useEffect(() => {
    setDoesTeamExist(props.doesTeamExist === 0 ? false : true);
  }, [props.doesTeamExist]);


  return (
    <div>
      {doesTeamExist ? (
        <div className="row justify-content-center" style={{ marginBottom: 10 }}>
          <Chip label={`Formation: ${props.formation}`} className={classes.chip} icon={<SportsSoccerIcon />} />
          <ClickableChip label={`Season: ${props.currentSeason}`}  icon={<EventNoteIcon />}/>
          <ClickableChip label={`Round: ${props.currentRound}`}  icon={<ScheduleIcon />}/>
        </div>
      ) : (
          <Grid container direction="column" alignItems="center">
            <Button variant="outlined" color="primary" size="large"
              startIcon={<SettingsIcon />}
              className={classes.blueButton}
              onClick={handleClickOpen}>
              Set up your first team
              </Button>
          </Grid>
        )}

      <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Set season and round</DialogTitle>

        <DialogContent>
          <form className={classes.container}>
            <FormControl className={classes.formControl}>
              <InputLabel>Season</InputLabel>
              <Select
                value={props.selectedSeason}
                onChange={props.onSeasonChange}
              >
                <MenuItem value="2018/19" disabled={props.selectedRound === 'Group Stage - 1' ? true : false}>2018/19</MenuItem>
                <MenuItem value="2019/20">2019/20</MenuItem>
              </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
              <InputLabel>Round</InputLabel>
              <Select
                value={props.selectedRound}
                onChange={props.onRoundChange}
              >
                <ListSubheader>Group stage</ListSubheader>
                <MenuItem value="Group Stage - 1" disabled={props.selectedSeason === '2018/19' ? true : false}>Fixture 1</MenuItem>
                <MenuItem value="Group Stage - 2">Fixture 2</MenuItem>
                <MenuItem value="Group Stage - 3">Fixture 3</MenuItem>
                <MenuItem value="Group Stage - 4">Fixture 4</MenuItem>
                <MenuItem value="Group Stage - 5">Fixture 5</MenuItem>
                <MenuItem value="Group Stage - 6">Fixture 6</MenuItem>

                <ListSubheader>Knockout phase</ListSubheader>
                <MenuItem value="8th Finals">8th Finals</MenuItem>
                <MenuItem value="Quarter-finals">Quarter finals</MenuItem>
                <MenuItem value="Semi-finals">Semi finals</MenuItem>
                <MenuItem value="Final">Final</MenuItem>
              </Select>
            </FormControl>
          </form>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" color="secondary"
            className={classes.redButton}
            startIcon={<DeleteIcon />}
            onClick={() => { handleClose(); props.onClose() }}>
            Cancel
      </Button>
          <Button variant="outlined" color="primary"
            className={classes.blueButton}
            startIcon={<SendIcon />}
            onClick={() => { handleClose(); props.onSubmit(); setDoesTeamExist(true) }}>
            Get your team!
      </Button>
        </DialogActions>

      </Dialog>
    </div>
  );
}
