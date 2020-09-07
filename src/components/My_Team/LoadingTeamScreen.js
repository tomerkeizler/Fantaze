import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
    },
    chip: {
        fontSize: '2rem',
        padding: 25,
        marginBottom: 30
    }
}));

const LoadingTeamScreen = ({ isLoading, text}) => {
    const classes = useStyles();

    return (
        <Backdrop className={classes.backdrop} open={isLoading}>
            <Grid container direction="column" justify="center" alignItems="center">
                <Grid item>
                    <Chip className={classes.chip} color="primary" label={text} />
                </Grid>
                <Grid item>
                    <CircularProgress size={100} thickness={2} />
                </Grid>
            </Grid>
        </Backdrop>
    );
}

export default LoadingTeamScreen;