import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
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
    control: {
        marginTop: theme.spacing(1),
        '&:hover': {
            background: "#f00",
            color: 'white',
        },
    },
}));

export default function FormationConstraintCard(props) {
    const classes = useStyles();

    return (
        <Card>
            <CardContent className={classes.content}>

                <div className={classes.textContent}>
                    <Typography variant="h4">
                        <b>Formation</b>
                    </Typography>
                    <Typography variant="h4">
                        <b>{props.constraintTitle.split('').join(' ')}</b>
                    </Typography>
                    <Typography variant="h5" color="textSecondary">
                        {props.numOfDefenders}
                    </Typography>
                    <Typography variant="h5" color="textSecondary">
                        {props.numOfMidfielders}
                    </Typography>
                    <Typography variant="h5" color="textSecondary">
                        {props.numOfAttackers}
                    </Typography>

                    <Button variant="outlined" color="secondary" size="large"
                        startIcon={<DeleteIcon />}
                        className={classes.control}
                        onClick={props.deleteConstraint}>
                        Remove
                </Button>
                </div>

                <CardMedia
                    component="img"
                    image={props.image}
                    className={classes.image}
                    alt="" />

            </CardContent>
        </Card>
    );
}