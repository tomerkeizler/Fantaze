import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 151,
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(3),
        paddingBottom: theme.spacing(3),
    },
}));

export default function ConstraintCard(props) {
    const classes = useStyles();
    // const theme = useTheme();

    return (
        <Card className={classes.root}>
            <div className={classes.details}>

                <CardContent className={classes.content}>
                    <Typography component="h5" variant="h5">
                        <b>{props.constraintTitle}</b>
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                        {props.firstDescription}
                        <br />
                        {props.secondDescription}
                        <br />
                        {props.thirdDescription}
                    </Typography>
                </CardContent>

                <div className={classes.controls}>
                    <Button variant="outlined" color="secondary" size="large"
                        startIcon={<DeleteIcon />}
                        onClick={props.deleteConstraint}>
                        Remove
                    </Button>
                </div>
            </div>

            <CardMedia
                className={classes.cover}
                image={props.image}
            />
        </Card>
    );
}