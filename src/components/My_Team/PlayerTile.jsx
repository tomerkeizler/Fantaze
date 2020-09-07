import React from "react";
import PropTypes from "prop-types";

const PlayerTile = ({ item, teamShirtImage}) => {
  return (
    <div className="col-md-4 col-sm-12 p-5">
      <img src={teamShirtImage} alt={item.team_name} className="mb-3" />
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