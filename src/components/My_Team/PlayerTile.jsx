import React from "react";
import PropTypes from "prop-types";

import DoneIcon from '@material-ui/icons/Done';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import AutorenewIcon from '@material-ui/icons/Autorenew';
import CachedIcon from '@material-ui/icons/Cached';
import LoopIcon from '@material-ui/icons/Loop';
import SyncAltIcon from '@material-ui/icons/SyncAlt';

import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';

import PlayForWorkIcon from '@material-ui/icons/PlayForWork';
import ForwardIcon from '@material-ui/icons/Forward';
import GetAppIcon from '@material-ui/icons/GetApp';
import InputIcon from '@material-ui/icons/Input';

import Crop169Icon from '@material-ui/icons/Crop169';

import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CloseIcon from '@material-ui/icons/Close';
import ExposureNeg1Icon from '@material-ui/icons/ExposureNeg1';

import AccessTimeIcon from '@material-ui/icons/AccessTime';

import ControlCameraIcon from '@material-ui/icons/ControlCamera';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';


const PlayerTile = ({ item, teamShirtImage}) => {
  return (
    <div>
      <img src={teamShirtImage} alt={item.team_name} className="mb-1" />
      <h3>{item.player_name}</h3>
      <p>
        <b>Role:</b> {item.position}
        <br/>
        <b>Team:</b> {item.team_name}
      </p>
    </div>
  );
}

PlayerTile.propTypes = {
  item: PropTypes.any
}

export default PlayerTile;