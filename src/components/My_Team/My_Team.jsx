import React, { useState } from "react";
import WarningMessage from "../WarningMessage";
import CONSTANTS from "../../constants";
import PlayerTile from "./PlayerTile";
import { getTeamShirtByIdMap } from '../../images/Team_Shirts'
import CircleProgressBar from '../CircleProgressBar';


const My_Team = () => {
  const [items, setItems] = useState([]);
  const [yearRound, setYearRound] = useState({year: "2019/20", round: "Group Stage - 1"});
  const [isLoading, setIsLoading] = useState(true);
  const [teamShirtByIdMap, setTeamShirtByIdMap] = useState({ myMap: {} });
  const [warningMessage, setWarningMessage] = useState({ warningMessageOpen: false, warningMessageText: "" });


  const getItems = () => {
    const promiseItems = fetch(CONSTANTS.ENDPOINT.MY_TEAM, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        year: yearRound['year'],
        round: yearRound['round']
      })
    })
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
  
  
  const handleYearRoundChange = (e) => {
    setIsLoading(true);
    const newStateYearRound = yearRound;
    newStateYearRound[e.target.id] = e.target.value;
    setYearRound(newStateYearRound);
    updateTeam();
  }

  const updateTeam = (e) => {
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
  }

  React.useEffect(() => {
    setTeamShirtByIdMap(getTeamShirtByIdMap());
    updateTeam();
  }, []);

  return (
    <main id="mainContent">
      <div className="container">
        <div className="row justify-content-center mt-5 p-0">
          <h3>My Ultimate Team</h3>
        </div>

        <select name="year" id="year" defaultValue="2019/20" onChange={handleYearRoundChange}>
          <option value="2018/19">2018/19</option>
          <option value="2019/20">2019/20</option>
        </select>

        <select name="round" id="round" defaultValue="Group Stage - 1" onChange={handleYearRoundChange}>
          <optgroup label="Group Stage">
            <option value="Group Stage - 1">Fixture 1</option>
            <option value="Group Stage - 2">Fixture 2</option>
            <option value="Group Stage - 3">Fixture 3</option>
            <option value="Group Stage - 4">Fixture 4</option>
            <option value="Group Stage - 5">Fixture 5</option>
            <option value="Group Stage - 6">Fixture 6</option>
          </optgroup>
          <optgroup label="Knockout phase">
            <option value="8th Finals">8th Finals</option>
            <option value="Quarter-finals">Quarter finals</option>
            <option value="Semi-finals">Semi finals</option>
            <option value="Final">Final</option>
          </optgroup>
        </select>

        {isLoading ? (
          <center>
            <CircleProgressBar
              trailStrokeColor="gray"
              strokeColor="blue"
              percentage={100}
              innerText="Loading..."
            />
          </center>
        ) :
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