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

export default function DraggableDialog({ isValid }) {
    const [open, setOpen] = React.useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose} PaperComponent={PaperComponent}>
                <DialogTitle id="draggable-dialog-title"
                    style={{ cursor: 'move', backgroundColor: isValid ? '#CEDAEE' : '#ff4d4d', color: isValid ? 'black' : 'white' }}>
                    {isValid ? 'What are you waiting for?' : 'OOPS! Your team constraints are too strict'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <b>
                            {isValid ? 'Create your first ultimate team with Fantaze!'
                                : 'Please edit your favorite players OR choose an earlier round'}
                        </b>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
}
