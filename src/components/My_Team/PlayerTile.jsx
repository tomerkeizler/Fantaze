import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';

import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CachedIcon from '@material-ui/icons/Cached';
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';
import GetAppIcon from '@material-ui/icons/GetApp';
import Crop169Icon from '@material-ui/icons/Crop169';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import ControlCameraIcon from '@material-ui/icons/ControlCamera';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';


const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(1)
  },
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(2),
    width: '500px',
  },
  chip: {
    fontSize: '1.3rem',
    padding: 5,
    margin: 5,
  },
}));


const PlayerTile = ({ item, teamShirtImage }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const displayStats = (from, to) => {
    return (
      <div className="row justify-content-center">
        {stats.slice(from, to).map(stat =>
          stat.value === undefined ? '' : (
            <Chip
              key={stat.name}
              label={`${stat.name}: ${stat.value}`}
              color={stat.chipColor}
              variant={stat.chipVariant}
              style={{ backgroundColor: stat.chipCustomColor }}
              className={classes.chip}
              icon={stat.icon} />)
        )}
      </div>
    )
  }

  const stats = [
    {
      icon: <CheckCircleOutlineIcon />,
      name: 'Starting lineup',
      value: item.startXI,
      chipVariant: `default`,
      chipColor: '',
      chipCustomColor: '#b4e4cc',
    },
    {
      icon: <CachedIcon />,
      name: 'Substitute',
      value: item.substitute,
      chipVariant: `default`,
      chipColor: '',
      chipCustomColor: '#b4e4cc',
    },
    {
      icon: <AccessTimeIcon />,
      name: 'Average minutes played',
      value: Math.round(item.minutes_played),
      chipVariant: `default`,
      chipColor: 'default',
      chipCustomColor: '',
    },
    {
      icon: <ControlCameraIcon />,
      name: 'Average Pass accuracy',
      value: Math.round(item.passes_accuracy) + '%',
      chipVariant: `default`,
      chipColor: 'default',
      chipCustomColor: '',
    },
    {
      icon: <SportsSoccerIcon />,
      name: 'Goals',
      value: item.goals,
      chipVariant: `default`,
      chipColor: 'primary',
      chipCustomColor: '',
    },
    {
      icon: <GetAppIcon />,
      name: 'Assists',
      value: item.assists,
      chipVariant: `default`,
      chipColor: 'primary',
      chipCustomColor: '',
    },
    {
      icon: <Crop169Icon />,
      name: 'Yellow cards',
      value: item.yellow,
      chipVariant: `default`,
      chipColor: '',
      chipCustomColor: '#ffff80',
    },
    {
      icon: <Crop169Icon />,
      name: 'Red cards',
      value: item.red,
      chipVariant: `default`,
      chipColor: 'secondary',
      chipCustomColor: '',
    },
    {
      icon: <CancelPresentationIcon />,
      name: 'Goals conceded',
      value: item.conceded,
      chipVariant: `outlined`,
      chipColor: 'secondary',
      chipCustomColor: '',
    },
  ];


  return (
    <div className={classes.container}>
      <Popover
        className={classes.popover}
        classes={{ paper: classes.paper, }}
        PaperProps={{ square: false, elevation: 3 }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}
        transformOrigin={{ vertical: 'top', horizontal: 'center', }}
        onClose={handlePopoverClose}
        disableRestoreFocus>

        <center style={{marginBottom: 12}}>
          <Typography variant="h4">
            <b>{item.player_name}</b>
          </Typography>
          <Typography variant="h5" color="textSecondary">
            {item.position}, {item.team_name}
          </Typography>
        </center>

        {displayStats(0, 2)}
        {displayStats(2, 3)}
        {displayStats(3, 4)}
        {displayStats(4, 6)}
        {displayStats(6, 8)}
        {displayStats(8, 9)}
      </Popover>

      <img src={teamShirtImage} alt={item.team_name} className="mb-1"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose} />

      <Typography variant="h5">
        <b>{item.player_name}</b>
      </Typography>
      <Typography variant="h6" color="textSecondary">
        {item.position}
      </Typography>
      <Typography variant="h6" color="textSecondary">
        {item.team_name}
      </Typography>
    </div>
  );
}

export default PlayerTile;
