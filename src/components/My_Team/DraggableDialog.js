import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';

function PaperComponent(props) {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

export default function DraggableDialog(props) {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        setOpen(props.data.length > 0);
    }, [props.data]);

    return (
        <div>
            <Dialog open={open} onClose={handleClose} PaperComponent={PaperComponent}>
                <DialogTitle id="draggable-dialog-title" style={{ cursor: 'move' }}>
                    Eliminated players
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <b>
                            The following players were selected in team constraints but were eliminated before {props.selectedSeason} {props.selectedRound}:
                        </b>
                    </DialogContentText>
                    <ul>
                        {props.data.map(player => (
                            <li key={player.player_id}>{player.player_name} ({player.position}, {player.team_name})</li>
                        ))}
                    </ul>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="contained" color="primary">
                        OK, Let's build a team!
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
