import React from 'react';
import Dialog from '@material-ui/core/Dialog';
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

    const handleClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        setOpen(props.data.length > 0);
    }, [props.data]);

    return (
        <div>
            <Dialog open={open} onClose={handleClose} PaperComponent={PaperComponent}>
                <DialogTitle id="draggable-dialog-title" style={{ cursor: 'move', backgroundColor: '#CEDAEE'}}>
                    Eliminated players - {props.selectedSeason} {props.selectedRound}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <b>Some of your favorite players were eliminated in a previous phase:</b>
                    </DialogContentText>
                    <ul>
                        {props.data.map(player => (
                            <li key={player.player_id}>{player.player_name} ({player.position}, {player.team_name})</li>
                        ))}
                    </ul>
                </DialogContent>
            </Dialog>
        </div>
    );
}
