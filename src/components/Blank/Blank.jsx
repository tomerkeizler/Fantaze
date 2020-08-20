import React from "react";
import PlayerSelection from './PlayerSelection'

const Blank = () => {
  return <main id="mainContent">
    <div className="container">
      <div className="row justify-content-center mt-5 p-0">
        <h3>Welcome to your fantasy league!</h3>
      </div>
      <PlayerSelection />
    </div>
  </main>;
}
export default Blank;
