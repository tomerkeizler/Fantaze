import React from "react";
import ImgGreyBox from "../../images/GreyBox.svg"
import PropTypes from "prop-types";

const PlayerTile = ({ item }) => {
  return (
    <div className="col-md-4 col-sm-12 p-5">
      <img src="https://www.sport5.co.il/files/7/122457.png" alt="Default Grey Box" className="mb-3" />
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