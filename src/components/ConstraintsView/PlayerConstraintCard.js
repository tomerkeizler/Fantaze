import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles((theme) => ({
    content: {
        display: 'flex',
        flexFlow: 'column wrap',
        alignItems: 'center',
        minWidth: 180,
    },
    image: {
        marginBottom: theme.spacing(1),
        height: 180,
        maxWidth: 150,
    },
    removeButton: {
        marginTop: theme.spacing(1),
        '&:hover': {
            background: "#f00",
            color: 'white',
        },
    },
    restoreButton: {
        marginTop: theme.spacing(1),
        '&:hover': {
            background: "#3f51b5",
            color: 'white',
        },
    },
}));

export default function PlayerConstraintCard(props) {
    const classes = useStyles();
    const [isActive, setIsActive] = useState(true);

    const styles = {
        opacityArea: {
            opacity: isActive ? 1 : 0.3
        }
    };
    const { opacityArea } = styles;


    return (
        <Card>
            <CardContent className={classes.content}>

                <CardMedia
                    style={opacityArea}
                    component="img"
                    image={props.image}
                    className={classes.image}
                    alt="" />

                <Typography variant="h5" style={opacityArea}>
                    <b>{props.player.player_name}</b>
                </Typography>
                <Typography variant="h6" color="textSecondary" style={opacityArea}>
                    {props.player.position}
                </Typography>
                <Typography variant="h6" color="textSecondary" style={opacityArea}>
                    {props.player.team_name}
                </Typography>

                {isActive ?
                    (<Button variant="outlined" color="secondary" size="large"
                        startIcon={<DeleteIcon />}
                        className={classes.removeButton}
                        onClick={() => { setIsActive(false); props.onRemovePlayer(props.player.player_id) }}>
                        Remove
                        </Button>)

                    : (<Button variant="outlined" color="primary" size="large"
                        startIcon={<RestoreFromTrashIcon />}
                        className={classes.restoreButton}
                        onClick={() => { setIsActive(true); props.onRestorePlayer(props.player.player_id) }}>
                        Restore
                        </Button>)}

            </CardContent>
        </Card>
    );
}