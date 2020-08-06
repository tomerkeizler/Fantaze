import React, { useState } from "react";
import WarningMessage from "../WarningMessage";
import CONSTANTS from "../../constants";
import PlayerTile from "./PlayerTile";
import { getTeamShirtByIdMap } from '../../images/Team_Shirts'


const My_Team = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [teamShirtByIdMap, setTeamShirtByIdMap] = useState({myMap:{}});
  const [warningMessage, setWarningMessage] = useState({warningMessageOpen: false, warningMessageText: ""});
  

  const getItems = () => {
    const promiseItems = fetch(CONSTANTS.ENDPOINT.MY_TEAM)
    .then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    });

    return promiseItems;
  }
  
  const closeWarningMessage = () => {
    setWarningMessage({
      warningMessageOpen: false,
      warningMessageText: ""
    });
  }

  React.useEffect(() => {
    setTeamShirtByIdMap(getTeamShirtByIdMap());
    getItems()
    .then(newItems => {
      setItems(newItems)
      setIsLoading(false);
    })
    .catch(error =>
      setWarningMessage({
        warningMessageOpen: true,
        warningMessageText: `Request to get grid text failed: ${error}`
      })
    );
  }, []);

  return (
    <main id="mainContent">
      <div className="container">
        <div className="row justify-content-center mt-5 p-0">
          <h3>My Ultimate Team</h3>
        </div>

        { isLoading ? (<h5>LOADING...</h5>) :        
        (<div className="row justify-content-around text-center pb-5">
          {items.map(item => (
            <PlayerTile
            key={item.player_id}
            item={item}
            teamShirtImage={teamShirtByIdMap.get(item.team_id)}
            />
          ))}
        </div>)}
        
      </div>
      <WarningMessage
        open={warningMessage.warningMessageOpen}
        text={warningMessage.warningMessageText}
        onWarningClose={closeWarningMessage}
      />
    </main>
  );
}

export default My_Team;