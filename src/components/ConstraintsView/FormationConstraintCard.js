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
        flexFlow: 'row wrap',
        justifyContent: 'space-around',
    },
    textContent: {
        display: 'flex',
        flexFlow: 'column wrap',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    image: {
        padding: theme.spacing(2),
        maxWidth: 285,
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


export default function FormationConstraintCard(props) {
    const classes = useStyles();
    const [isActive, setIsActive] = useState(true);
    const [formationPositions, setFormationPositions] = useState([]);

    const styles = {
        opacityArea: {
            opacity: isActive ? 1 : 0.3
        }
    };
    const { opacityArea } = styles;


    React.useEffect(() => {
        setFormationPositions(props.formation.split('-', 3));
    }, [props.formation]);


    return (
        <Card>
            <CardContent className={classes.content}>

                <div className={classes.textContent}>
                    <Typography variant="h4" style={opacityArea}>
                        <b>Formation</b>
                    </Typography>
                    <Typography variant="h4" style={opacityArea}>
                        <b>{props.formation.split('').join(' ')}</b>
                    </Typography>
                    <Typography variant="h5" color="textSecondary" style={opacityArea}>
                        {formationPositions[0]} Defenders
                    </Typography>
                    <Typography variant="h5" color="textSecondary" style={opacityArea}>
                        {formationPositions[1]} Midfielders
                    </Typography>
                    <Typography variant="h5" color="textSecondary" style={opacityArea}>
                        {formationPositions[2]} Attackers
                    </Typography>

                    {isActive ?
                        (<Button variant="outlined" color="secondary" size="large"
                            startIcon={<DeleteIcon />}
                            className={classes.removeButton}
                            onClick={() => { setIsActive(false); props.onRemoveFormation(); }}>
                            Remove
                        </Button>)

                        : (<Button variant="outlined" color="primary" size="large"
                            startIcon={<RestoreFromTrashIcon />}
                            className={classes.restoreButton}
                            onClick={() => { setIsActive(true); props.onRestoreFormation() }}>
                            Restore
                        </Button>)}

                </div>

                <CardMedia
                    style={opacityArea}
                    component="img"
                    image={props.image}
                    className={classes.image}
                    alt="" />

            </CardContent>
        </Card>
    );
}