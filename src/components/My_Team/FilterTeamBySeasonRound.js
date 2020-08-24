import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ListSubheader from '@material-ui/core/ListSubheader';
import DeleteIcon from '@material-ui/icons/Delete';
import SendIcon from '@material-ui/icons/Send';
import SettingsIcon from '@material-ui/icons/Settings';
import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  button: {
    margin: theme.spacing(1),
  },
}));


export default function FilterTeamBySeasonRound(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [season, setSeason] = useState('2019/20');
  const [round, setRound] = useState('Group Stage - 1');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSeasonChange = (e) => {
    setSeason(e.target.value);
  }

  const handleRoundChange = (e) => {
    setRound(e.target.value);
  }

  return (
    <div>
      <Grid container direction="column" alignItems="center">
        <Button variant="contained" color="primary" size="large"
          className={classes.button}
          startIcon={<SettingsIcon />}
          onClick={handleClickOpen}>
          Set season and round
      </Button>
      </Grid>

      <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Set season and round</DialogTitle>

        <DialogContent>
          <form className={classes.container}>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-dialog-select-label">Season</InputLabel>
              <Select
                labelId="demo-dialog-select-label"
                id="season"
                name="season"
                value={season}
                onChange={handleSeasonChange}
                input={<Input />}
              >
                <MenuItem value="2018/19">2018/19</MenuItem>
                <MenuItem value="2019/20">2019/20</MenuItem>
              </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
              <InputLabel id="demo-dialog-select-label">Round</InputLabel>
              <Select
                labelId="demo-dialog-select-label"
                id="round"
                name="round"
                value={round}
                onChange={handleRoundChange}
                input={<Input />}
              >
                <ListSubheader>Group stage</ListSubheader>
                <MenuItem value="Group Stage - 1">Fixture 1</MenuItem>
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
          <Button variant="contained" color="secondary"
            className={classes.button}
            startIcon={<DeleteIcon />}
            onClick={handleClose}>
            Cancel
      </Button>
          <Button variant="contained" color="primary"
            className={classes.button}
            startIcon={<SendIcon />}
            onClick={() => { handleClose(); props.handleSubmit(season, round) }}>
            Get your team!
      </Button>
        </DialogActions>

      </Dialog>
    </div>
  );
}
