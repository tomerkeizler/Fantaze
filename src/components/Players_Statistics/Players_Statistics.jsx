import React, { useState } from "react";
import CONSTANTS from "../../constants";
import './statsStyle.css';

const TEAMS_NAMES = 0;
const TOP_SCORERS_PLACE = 1;
const MOST_ASSISTS_PLACE = 2;
const BEST_GOALKEEPER_PLACE = 3;
const PLAYER_RECENT_GAMES_PREFORMANCES = 4;


const Players_Statistics = () => {
    const [yearStats, setYearStats] = useState({ year: "2019/20" });
    const [teams, setTeams] = useState([]);
    const [teamName, setTeamName] = useState({ teamName: "All" });
    const [allStats, setAllStats] = useState([]);
    const [topScorers, setTopScorers] = useState([]);
    const [mostAssists, setMostAssists] = useState([]);
    const [bestGoolkeepers, setBestGoolkeepers] = useState([]);
    const [bestRecentPlayers, setBestRecentPlayers] = useState([]);
    const [recentGamesNum, setRecentGamesNum] = useState(10);
    //const [recentGamesSortBy, setRecentGamesNum] = useState(10);




    const setItems = (list) => {
        setAllStats(list)
        setTeams(list[TEAMS_NAMES])
        setTopScorers(list[TOP_SCORERS_PLACE].slice(0, 10));
        setMostAssists(list[MOST_ASSISTS_PLACE].slice(0, 10));
        setBestGoolkeepers(list[BEST_GOALKEEPER_PLACE].slice(0, 10));
        var theSortedList = setRecetStats(list[PLAYER_RECENT_GAMES_PREFORMANCES], 10, 'average_performance')
        setBestRecentPlayers(theSortedList)
    }


    const handleRecentGamesNumChange = (e) => {
        console.log(e.target.value)
        setRecentGamesNum(e.target.value);
        var theSortedList = setRecetStats(allStats[PLAYER_RECENT_GAMES_PREFORMANCES],e.target.value, 'average_performance')
        setBestRecentPlayers(theSortedList)
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

    const setRecetStats = (playersRecetGamesList, recentGames, sortBy) => {
    console.log(recentGamesNum)
        var statsForLastGames = [];
        for (var i = 0; i < playersRecetGamesList.length; i++) {
            if(playersRecetGamesList[i].games_performances.length > 0){
                var newPlayer = {};
                var goals = 0;
                var assists = 0;
                var average_minutes_played_per_game = 0;
                var shots = 0;
                var shots_on_target = 0;
                var passes = 0;
                var key_passes = 0;
                var pass_accuracy = 0;
                var number_of_games = 0;
                var average_performance = 0;
                newPlayer['name'] = playersRecetGamesList[i].player_name
                newPlayer['place'] = statsForLastGames.length + 1
                playersRecetGamesList[i].games_performances.slice(0,recentGames).forEach(performance =>{
                    goals = goals + parseInt(performance.goals.total);
                    assists = assists + parseInt(performance.goals.assists);
                        average_minutes_played_per_game = average_minutes_played_per_game + parseInt(performance.minutes_played);
                    shots = shots + parseInt(performance.shots.total);
                    shots_on_target = shots_on_target + parseInt(performance.shots.on);
                    passes = passes + parseInt(performance.passes.total);
                    key_passes = key_passes + parseInt(performance.passes.key);
                    pass_accuracy = pass_accuracy + parseInt(performance.passes.accuracy);
                    number_of_games = number_of_games + 1;
                    average_performance = average_performance + parseInt(performance.performance);

                })
                newPlayer['goals'] = goals;
                newPlayer['assists'] = assists;
                newPlayer['average_minutes_played_per_game'] = Math.round(average_minutes_played_per_game / number_of_games);
                newPlayer['shots'] = shots;
                newPlayer['shots_on_target'] = shots_on_target;
                newPlayer['passes'] = passes;
                newPlayer['key_passes'] = key_passes;
                newPlayer['pass_accuracy'] = Math.round(pass_accuracy / number_of_games);
                newPlayer['number_of_games'] = number_of_games;
                newPlayer['average_performance'] = Math.round(average_performance / number_of_games);
                statsForLastGames.push(newPlayer)
            }
        }
        statsForLastGames.sort(
            function(a,b){
               return b[sortBy] - a.[sortBy]
            }
        )
        var newPlace = 1;
        statsForLastGames.forEach(player => {
        player.place = newPlace;
        newPlace++;
        })
        return statsForLastGames
    }

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

    const printNumOgGames = (numOgGames) => {
        if(numOgGames < recentGamesNum){
            return <td className="text-danger">{numOgGames}</td>
        }
        else{
            return <td className="text-success">{numOgGames}</td>
        }
    }

    const sortRecent = (sortBy) => {
       var theSortedList = setRecetStats(allStats[PLAYER_RECENT_GAMES_PREFORMANCES],recentGamesNum, sortBy)
       setBestRecentPlayers(theSortedList)
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
            setBestGoolkeepers(setStatsForTeam(allStats[BEST_GOALKEEPER_PLACE], id))
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
        <div className="p-3" onLoad={() => getItems}>
            <h1 className="text-center">Players Season Statistics</h1>
            <div className="text-center">
            <div className="text-center d-inline-block m-2">
                <h2>Choose Year: </h2>
            </div>
            <div className="d-inline-block m-2 mr-4">
                <select name="year" id="year" defaultValue="2019/20" onChange={handleStatsYearChange} className="selectpicker">
                    <option value="2018/19">2018/19</option>
                    <option value="2019/20">2019/20</option>
                </select>
            </div>
            <div className="d-inline-block m-2 ml-4">
                <h2>Choose Team: </h2>
            </div>
            <div className="d-inline-block m-2">
                <select name="teamName" id="teamName" defaultValue="All" onChange={handleTeamNameChange} className="">
                    <option value="All">All</option>
                    {
                        teams.map(team => (
                            <option>{team.team_name}</option>
                        ))
                    }
                </select>
            </div>
            </div>
            <div className="row">
                <div className="col-md-3">
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
                <div className="col-md-3">
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
                <div className="col-md-6">
                    <h3>Best Goolkeepers</h3>
                    <table className="table table-sm table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>#</th>
                                <th>Player Name</th>
                                <th>Goals Conceded</th>
                                <th>Games Played</th>
                                <th>Goals Conceded Per Game</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                bestGoolkeepers.map(player => (
                                    <tr>
                                        <th>{player.place}</th>
                                        <td>{player.name}</td>
                                        <td>{player.score.conceded_goals}</td>
                                        <td>{player.score.games_played}</td>
                                        <td>{player.score.goals_per_game}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <h1 className="text-center">Players Recent Statistics</h1>
            <div className="text-center">
            <div className="text-center d-inline-block m-2">
                <h2>Choose Number Of Recent Game To Show Statistics: </h2>
            </div>
            <div className="d-inline-block m-2 mr-4">
                <select name="recent_games" id="recent_games" defaultValue="10" onChange={handleRecentGamesNumChange} className="selectpicker">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                </select>
            </div>
            </div>
            <div className="row">
             <div className="col-md-12">
                    <table className="table table-sm table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>#</th>
                                <th>Player Name</th>
                                <th className="cursor-pointer" onClick={()=> sortRecent("goals")}>Goals</th>
                                <th className="cursor-pointer" onClick={()=> sortRecent("assists")}>Assists</th>
                                <th className="cursor-pointer" onClick={()=> sortRecent("average_minutes_played_per_game")}>Average Minutes Played Per Game</th>
                                <th className="cursor-pointer" onClick={()=> sortRecent("shots")}>Shots</th>
                                <th className="cursor-pointer" onClick={()=> sortRecent("shots_on_target")}>Shots On Target</th>
                                <th className="cursor-pointer" onClick={()=> sortRecent("passes")}>Passes</th>
                                <th className="cursor-pointer" onClick={()=> sortRecent("key_passes")}>Key Passes</th>
                                <th className="cursor-pointer" onClick={()=> sortRecent("pass_accuracy")}>Pass Accuracy</th>
                                <th className="cursor-pointer" onClick={()=> sortRecent("number_of_games")}>Number Of Games</th>
                                <th className="cursor-pointer" onClick={()=> sortRecent("average_performance")}>Average Performance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                bestRecentPlayers.map(player => (
                                    <tr>
                                        <th>{player.place}</th>
                                        <td>{player.name}</td>
                                        <td>{player.goals}</td>
                                        <td>{player.assists}</td>
                                        <td>{player.average_minutes_played_per_game}</td>
                                        <td>{player.shots}</td>
                                        <td>{player.shots_on_target}</td>
                                        <td>{player.passes}</td>
                                        <td>{player.key_passes}</td>
                                        <td>{player.pass_accuracy}%</td>
                                        {printNumOgGames(player.number_of_games)}
                                        <td>{player.average_performance}</td>
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