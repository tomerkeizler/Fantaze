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
        flexFlow: 'column wrap',
        alignItems: 'center',
    },
    image: {
        marginBottom: theme.spacing(1),
        height: 180,
        maxWidth: 150,
    },
    control: {
        marginTop: theme.spacing(1),
        '&:hover': {
            background: "#f00",
            color: 'white',
        },
    },
}));

export default function PlayerConstraintCard(props) {
    const classes = useStyles();

    return (
        <Card>
            <CardContent className={classes.content}>

                <CardMedia
                    component="img"
                    image={props.image}
                    className={classes.image}
                    alt="" />

                <Typography variant="h5">
                    <b>{props.constraintTitle}</b>
                </Typography>
                <Typography variant="h6" color="textSecondary">
                    {props.position}
                </Typography>
                <Typography variant="h6" color="textSecondary">
                    {props.teamName}
                </Typography>

                <Button variant="outlined" color="secondary" size="large"
                    startIcon={<DeleteIcon />}
                    className={classes.control}
                    onClick={props.deleteConstraint}>
                    Remove
                </Button>

            </CardContent>
        </Card>
    );
}