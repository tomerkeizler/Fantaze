import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import StarIcon from '@material-ui/icons/Star';
import SportsHandballIcon from '@material-ui/icons/SportsHandball';
import LockIcon from '@material-ui/icons/Lock';
import FilterCenterFocusIcon from '@material-ui/icons/FilterCenterFocus';
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';
import { useSnackbar } from 'notistack';


const useStyles = makeStyles((theme) => ({
    chip: {
        fontSize: '1.3rem',
        padding: 12,
        margin: 2
    },
    hoverChip: {
        '&:hover': {
            background: "#000000",
            color: '"#ffffff"'
        },
    },
}));

export default function FavoritePlayersLimits({ formation, favoritePlayers, onPlayerLimitsChange }) {
    const classes = useStyles();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleDisplayErrorBar = (limit, variantToUse) => {
        if (limit.currentValue > limit.maxValue) {
            enqueueSnackbar(`${limit.invalidityMessage} ${limit.maxValue} ${limit.name}`,
                { variant: variantToUse, });
        }
    }

    useEffect(() => {
        onPlayerLimitsChange(limits.reduce((validity, limit) =>
            (validity && limit.currentValue <= limit.maxValue), true));
        // let invalidLimits = limits.filter(limit => (limit.currentValue > limit.maxValue));
        // onPlayerLimitsChange(invalidLimits.length === 0 ? '' : invalidLimits.map(limit => limit.invalidityMessage));
    }, limits);

    const limits = [
        {
            'name': 'Budget used',
            'currentValue': favoritePlayers.reduce((budgetUsed, player) => budgetUsed + player.price, 0),
            'maxValue': 100,
            'icon': <MonetizationOnIcon />,
            'invalidityMessage': 'Budget was exceeded!',
            'errorBarColor': 'default'
        },
        {
            'name': 'Favorite players',
            'currentValue': favoritePlayers.length,
            'maxValue': 8,
            'icon': <StarIcon />,
            'invalidityMessage': 'You can select up to',
            'errorBarColor': 'default'
        },
        {
            'name': 'Goalkeeper',
            'currentValue': favoritePlayers.filter(player => player.position === 'Goalkeeper').length,
            'maxValue': 1,
            'icon': <SportsHandballIcon />,
            'invalidityMessage': 'This formation consists of up to',
            'errorBarColor': 'success'
        },
        {
            'name': 'Defenders',
            'currentValue': favoritePlayers.filter(player => player.position === 'Defender').length,
            'maxValue': formation.split('-', 3)[0],
            'icon': <LockIcon />,
            'invalidityMessage': 'This formation consists of up to',
            'errorBarColor': 'error'
        },
        {
            'name': 'Midfielders',
            'currentValue': favoritePlayers.filter(player => player.position === 'Midfielder').length,
            'maxValue': formation.split('-', 3)[1],
            'icon': <FilterCenterFocusIcon />,
            'invalidityMessage': 'This formation consists of up to',
            'errorBarColor': 'warning'
        },
        {
            'name': 'Attackers',
            'currentValue': favoritePlayers.filter(player => player.position === 'Attacker').length,
            'maxValue': formation.split('-', 3)[2],
            'icon': <SportsSoccerIcon />,
            'invalidityMessage': 'This formation consists of up to',
            'errorBarColor': 'info'
        },
    ]

    const LimitChip = ({ limit }) => {
        return (
            limit.currentValue > limit.maxValue ?
                (<Chip
                    color="secondary"
                    variant="default"
                    label={`${limit.name}: ${limit.currentValue}/${limit.maxValue}`}
                    className={[classes.chip, classes.hoverChip]}
                    icon={limit.icon}
                    clickable
                    onClick={() => handleDisplayErrorBar(limit, limit.errorBarColor)}
                />)
                :
                (<Chip
                    color="primary"
                    variant="outlined"
                    label={`${limit.name}: ${limit.currentValue}/${limit.maxValue}`}
                    className={classes.chip}
                    icon={limit.icon}
                />)
        )
    }

    return (
        <>
            <div style={{ display: 'flex', flexFlow: 'column', alignItems: 'center', marginBottom: 10 }}>
                <div className="row justify-content-center" style={{ marginBottom: 3 }}>
                    {limits.slice(0, 2).map(limit => <LimitChip limit={limit} />)}
                    <Chip color="primary" variant="outlined" label={`Formation: ${formation}`}
                        className={classes.chip} icon={<SportsSoccerIcon />} />
                </div>
                <div className="row justify-content-center">
                    {limits.slice(2, 6).map(limit => <LimitChip limit={limit} />)}
                </div>
            </div>
        </>
    )
}
