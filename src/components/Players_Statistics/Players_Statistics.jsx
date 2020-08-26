import React, { useState } from "react";
import CONSTANTS from "../../constants";

const TEAMS_NAMES = 0;
const TOP_SCORERS_PLACE = 1;
const MOST_ASSISTS_PLACE = 2;

const Players_Statistics = () => {
    const [yearStats, setYearStats] = useState({ year: "2019/20" });
    const [teams, setTeams] = useState([]);
    const [teamName, setTeamName] = useState({ teamName: "All" });
    const [allStats, setAllStats] = useState([]);
    const [topScorers, setTopScorers] = useState([]);
    const [mostAssists, setMostAssists] = useState([]);
    const [counter, setCounter] = useState(0);


    const setItems = (list) => {
        setAllStats(list)
        setTeams(list[TEAMS_NAMES])
        setTopScorers(list[TOP_SCORERS_PLACE].slice(0, 10));
        setMostAssists(list[MOST_ASSISTS_PLACE].slice(0, 10));
    }


    const handleStatsYearChange = (e) => {
        const newStatsYear = yearStats;
        newStatsYear[e.target.id] = e.target.value;
        setYearStats({ year: e.target.value });
        getItems()
            .then(list => {
                console.log(list)
                setItems(list)
            })
    }
    //.catch(error =>
    //setWarningMessage({
    //warningMessageOpen: true,
    //warningMessageText: `Request to get grid text failed: ${error}`
    //})
    // );
    //}


    const setStatsForTeam = (playersList, team_id) => {
        var justTeamStats = [];
        for (var i = 0; i < playersList.length; i++) {
            if (playersList[i].team_id == team_id) {
                var newPlayer = {};
                newPlayer['name'] = playersList[i].name
                newPlayer['score'] = playersList[i].score
                newPlayer['team_id'] = playersList[i].team_id
                newPlayer['place'] = justTeamStats.length + 1
                justTeamStats.push(newPlayer)
            }
        }
        return justTeamStats.slice(0, 10)
    }

    const handleTeamNameChange = (e) => {
        const newTeamName = teamName;
        newTeamName[e.target.id] = e.target.value;
        setTeamName({ teamName: e.target.value });
        if (teamName.teamName == "All") {
            setItems(allStats)
        }
        else {
            var id = 0;
            teams.forEach(team => {
                if (team.team_name == teamName.teamName) {
                    id = team.team_id;
                }
            })
            setTopScorers(setStatsForTeam(allStats[TOP_SCORERS_PLACE], id))
            setMostAssists(setStatsForTeam(allStats[MOST_ASSISTS_PLACE], id))
        }
    }


    const getItems = () => {
        let promiseList = fetch(CONSTANTS.ENDPOINT.PLAYER_STATS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                year: yearStats['year'],
            })
        })
            .then(response => {
                if (!response.ok) {
                    //throw Error(response.statusText);
                }
                return response.json();
            })
        return promiseList;
    }

    React.useEffect(() => {
        getItems()
            .then(list => {
                setItems(list)
            })
    }, []);

    return (
        <div onLoad={() => getItems}>
            <h1>Players Statistics</h1>
            <div className="d-inline-block m-2">
                <h2>Choose Year: </h2>
            </div>
            <div className="d-inline-block m-2">
                <select name="year" id="year" defaultValue="2019/20" onChange={handleStatsYearChange} className="selectpicker">
                    <option value="2018/19">2018/19</option>
                    <option value="2019/20">2019/20</option>
                </select>
            </div>
            <div className="d-inline-block m-2">
                <h2>Choose Team: </h2>
            </div>
            <div className="d-inline-block m-2">
                <select name="teamName" id="teamName" defaultValue="All" onChange={handleTeamNameChange} className="selectpicker">
                    <option value="All">All</option>
                    {
                        teams.map(team => (
                            <option>{team.team_name}</option>
                        ))
                    }
                </select>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <h3>Top goalscorers</h3>
                    <table className="table table-sm table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th >#</th>
                                <th >Player Name</th>
                                <th >Goals</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                topScorers.map(player => (
                                    <tr>
                                        <th>{player.place}</th>
                                        <td>{player.name}</td>
                                        <td>{player.score}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                <div className="col-md-4">
                    <h3>Most assists</h3>
                    <table className="table table-sm table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>#</th>
                                <th>Player Name</th>
                                <th>Assists</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                mostAssists.map(player => (
                                    <tr>

                                        <th>{player.place}</th>
                                        <td>{player.name}</td>
                                        <td>{player.score}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}


export default Players_Statistics;