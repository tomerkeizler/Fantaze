import React, { useState } from "react";
import CONSTANTS from "../../constants";
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TablePagination from '@material-ui/core/TablePagination';
import './statsStyle.css';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';



const TEAMS_NAMES = 0;
const RECENT_GAMES_STATS = 1;

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        maxHeight: 600,
    },
    formControl: {
        margin: theme.spacing(2),
        minWidth: 120,
    },
    table: {
        minWidth: 1000,
    },
    paper: {
        width: '100%',
        //marginBottom: theme.spacing(3),
        backgroundColor: '#72aece',
        borderRadius: '20px',
    },
    typographyStyle: {
        color: "blue",
        backgroundColor: "#FFEDDF",
        borderRadius: "100px",
        letterSpacing: "4px",
        fontWeight: "600",
    },
}));

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: '#3f51b5',
        color: theme.palette.common.white,
        fontSize: 18,
        fontWeight: "fontWeightBold",
        border: "0.5px solid #0066CC",
    },
    body: {
        backgroundColor: '#3f8cb5',
        color: theme.palette.common.white,
        fontWeight: "fontWeightMedium",
        fontSize: 15,
        border: "0.5px solid #0066CC",
    },
}))(TableCell);



const Recent_Games_Stats = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [teams, setTeams] = useState([]);
    const [allStats, setAllStats] = useState([]);
    const [recentGamesNum, setRecentGamesNum] = useState(10);
    const [teamName, setTeamName] = useState('All');
    const [position, setPosition] = useState('All');
    const [recentGamesStats, setRecentGamesStats] = useState([]);
    const [page, setPage] = React.useState(0);
    const [dense,] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const classes = useStyles();


    const setRecetStats = (playersRecetGamesList, recentGames, sortBy) => {
    //console.log(recentGamesNum)
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
                var price = 0;
                newPlayer['name'] = playersRecetGamesList[i].player_name
                newPlayer['team_name'] = playersRecetGamesList[i].team_name
                newPlayer['position'] = playersRecetGamesList[i].position
                newPlayer['place'] = statsForLastGames.length + 1
                price = playersRecetGamesList[i].price
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
                newPlayer['performance_to_price'] = Math.round(average_performance / price);
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
        setPage(0);
        return statsForLastGames
    }


    const setItems = (list) => {
        setAllStats(list)
        setTeams(list[TEAMS_NAMES])
        //setRecentGamesStats(list[RECENT_GAMES_STATS]);
        var theSortedList = setRecetStats(list[RECENT_GAMES_STATS], 10, 'average_performance')
        setRecentGamesStats(theSortedList)
        setIsLoading(false);
    }

    const printNumOgGames = (numOfGames) => {
        if(numOfGames < recentGamesNum){
            return <StyledTableCell className="text-danger" align="center">{numOfGames}</StyledTableCell>
        }
        else{
           return <StyledTableCell align="center">{numOfGames}</StyledTableCell>
        }
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRecentGamesNumChange = (e) => {
        //console.log(e.target.value)
        setRecentGamesNum(e.target.value);
        //var theSortedList = setRecetStats(allStats[RECENT_GAMES_STATS], e.target.value, 'average_performance')
        var theSortedList = setStatsForPosition(setStatsForTeam(setRecetStats(allStats[RECENT_GAMES_STATS], e.target.value, 'average_performance'), teamName), position)
        setRecentGamesStats(theSortedList)
    }

    const handlePositionChange = (e) => {
        const position = e.target.value
        setPosition(e.target.value)
        //if (position === "All") {
           // setItems(allStats)
        //}
        //else {
            //setRecentGamesStats(setStatsForTeam(allStats[RECENT_GAMES_STATS], teamName))
        //setRecentGamesStats(setRecetStats(setStatsForTeam(allStats[RECENT_GAMES_STATS], teamName)), recentGamesNum, 'average_performance')
        var theSortedList = setStatsForPosition(setStatsForTeam(setRecetStats(allStats[RECENT_GAMES_STATS], recentGamesNum, 'average_performance'), teamName), e.target.value)
            setRecentGamesStats(theSortedList)
       // }
    }

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, recentGamesStats.length - page * rowsPerPage);


    const setStatsForPosition = (playersList, position) => {
        if (position === "All") {
            return playersList;
        }
        var justTeamStats = [];
        for (var i = 0; i < playersList.length; i++) {
            if (playersList[i].position === position) {
                justTeamStats.push(playersList[i])
            }
        }
        var newPlace = 1;
        justTeamStats.forEach(player => {
            player.place = newPlace;
            newPlace++;
        })
        return justTeamStats
    }

    const setStatsForTeam = (playersList, team_name) => {
        //console.log("setStatsForTeam")
        //console.log(team_name)
        if (team_name === "All") {
            return playersList;
        }
        var justTeamStats = [];
        for (var i = 0; i < playersList.length; i++) {
            if (playersList[i].team_name === team_name) {
                justTeamStats.push(playersList[i])
            }
        }
        var newPlace = 1;
        justTeamStats.forEach(player => {
            player.place = newPlace;
            newPlace++;
        })
        return justTeamStats
    }


   const handleTeamNameChange = (e) => {
       //console.log(e.target.value)
       const teamName = e.target.value
       setTeamName(e.target.value)
      // if (teamName === "All") {
          // setItems(allStats)
      // }
       //else {
           //setRecentGamesStats(setStatsForTeam(allStats[RECENT_GAMES_STATS], teamName))
       //setRecentGamesStats(setRecetStats(setStatsForTeam(allStats[RECENT_GAMES_STATS], teamName)), recentGamesNum, 'average_performance')
       var theSortedList = setStatsForPosition(setStatsForTeam(setRecetStats(allStats[RECENT_GAMES_STATS], recentGamesNum, 'average_performance'), e.target.value), position)
           setRecentGamesStats(theSortedList)
      // }
   }

   const sortRecent = (sortBy) => {
       //var theSortedList = setRecetStats(allStats[RECENT_GAMES_STATS], recentGamesNum, sortBy)
       console.log(recentGamesNum)
       console.log(sortBy)
       console.log(teamName)
       var theSortedList = setStatsForPosition(setStatsForTeam(setRecetStats(allStats[RECENT_GAMES_STATS], recentGamesNum, sortBy), teamName), position)
       setRecentGamesStats(theSortedList)
    }


    const getItems = () => {
        setIsLoading(true);
        let promiseList = fetch(CONSTANTS.ENDPOINT.PLAYER_STATS.RECENT_GAMES_STATS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
    },[]);


    return (
        <div className="p-3" onLoad={() => getItems}>
            <Typography className={classes.typographyStyle}
                align="center"
                variant="h3"

            >
                Recet Games Stats</Typography >
            <div className="text-center">
            <FormControl className={classes.formControl}>
                    <InputLabel id="demo-dialog-select-label">Last Games</InputLabel>
                    <Select
                        labelId="demo-dialog-select-label"
                        id="recent_games"
                        name="recent_games"
                        defaultValue="10"
                        onChange={handleRecentGamesNumChange}
                        input={<Input />}
                    >
                       <MenuItem value="1">1</MenuItem>
                       <MenuItem value="2">2</MenuItem>
                       <MenuItem value="3">3</MenuItem>
                       <MenuItem value="5">5</MenuItem>
                       <MenuItem value="10">10</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel id="demo-dialog-select-label">Team</InputLabel>
                    <Select
                        labelId="demo-dialog-select-label"
                        id="teamName"
                        name="teamName"
                        defaultValue="All"
                        onChange={handleTeamNameChange}
                        input={<Input />}
                    >
                        <MenuItem value="All">All</MenuItem>
                        {
                            teams.map(team => (
                                <MenuItem key={team.team_name} value={team.team_name}>{team.team_name}</MenuItem>
                            ))}
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel id="demo-dialog-select-label">Position</InputLabel>
                    <Select
                        labelId="demo-dialog-select-label"
                        id="recent_games"
                        name="recent_games"
                        defaultValue="All"
                        onChange={handlePositionChange}
                        input={<Input />}
                    >
                        <MenuItem value="Goalkeeper">Goalkeeper</MenuItem>
                        <MenuItem value="Defender">Defender</MenuItem>
                        <MenuItem value="Midfielder">Midfielder</MenuItem>
                        <MenuItem value="Attacker">Attacker</MenuItem>
                        <MenuItem value="All">All</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className="d-flex justify-content-center row">
                {isLoading ? (
                    <Grid container direction="column" justify="center" alignItems="center">
                        <CircularProgress size={150} thickness={3} />
                        <Typography gutterBottom variant="h4" color="textSecondary">
                            Loading recent games stats...
					</Typography>
                    </Grid>
                ) : (
                        <div className="col-md-12 text-center">
                            <div className={classes.root}>
                                <Paper elevation={20} className={classes.paper}>
                                    <TableContainer className={classes.container}>
                                        <Table stickyHeader
                                            className={classes.table}
                                            aria-labelledby="tableTitle"
                                            size={dense ? 'small' : 'medium'}
                                            aria-label="enhanced table"
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    <StyledTableCell align="center">#</StyledTableCell>
                                                    <StyledTableCell align="center">Player Name</StyledTableCell>
                                                    <StyledTableCell className="cursor-pointer" onClick={()=> sortRecent("goals")} align="center">Goals</StyledTableCell>
                                                    <StyledTableCell className="cursor-pointer" onClick={()=> sortRecent("assists")} align="center">Assists</StyledTableCell>
                                                    <StyledTableCell className="cursor-pointer" onClick={()=> sortRecent("average_minutes_played_per_game")} align="center">Average Minutes Played</StyledTableCell>
                                                    <StyledTableCell className="cursor-pointer" onClick={()=> sortRecent("shots")} align="center">Shots</StyledTableCell>
                                                    <StyledTableCell className="cursor-pointer" onClick={()=> sortRecent("shots_on_target")} align="center">Shots On Target</StyledTableCell>
                                                    <StyledTableCell className="cursor-pointer" onClick={()=> sortRecent("passes")} align="center">Passes</StyledTableCell>
                                                    <StyledTableCell className="cursor-pointer" onClick={()=> sortRecent("key_passes")} align="center">Key Passes</StyledTableCell>
                                                    <StyledTableCell className="cursor-pointer" onClick={()=> sortRecent("pass_accuracy")} align="center">Pass Accuracy</StyledTableCell>
                                                    <StyledTableCell className="cursor-pointer" onClick={()=> sortRecent("number_of_games")} align="center">Number Of Games</StyledTableCell>
                                                    <StyledTableCell className="cursor-pointer" onClick={() => sortRecent("average_performance")} align="center">Average Performance</StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {recentGamesStats.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    .map((player, index) => {
                                                        const labelId = `enhanced-table-checkbox-${index}`;
                                                        return (
                                                            <TableRow
                                                                hover
                                                                role="checkbox"
                                                                tabIndex={-1}
                                                                key={player.name}
                                                            >
                                                                <StyledTableCell align="center" component="th" id={labelId} scope="row" padding="none">
                                                                    {player.place}
                                                                </StyledTableCell>
                                                                <StyledTableCell align="center">{player.name}</StyledTableCell>
                                                                <StyledTableCell align="center">{player.goals}</StyledTableCell>
                                                                <StyledTableCell align="center">{player.assists}</StyledTableCell>
                                                                <StyledTableCell align="center">{player.average_minutes_played_per_game}</StyledTableCell>
                                                                <StyledTableCell align="center">{player.shots}</StyledTableCell>
                                                                <StyledTableCell align="center">{player.shots_on_target}</StyledTableCell>
                                                                <StyledTableCell align="center">{player.passes}</StyledTableCell>
                                                                <StyledTableCell align="center">{player.key_passes}</StyledTableCell>
                                                                <StyledTableCell align="center">{player.pass_accuracy}%</StyledTableCell>
                                                                 {printNumOgGames(player.number_of_games)}
                                                                <StyledTableCell align="center">{player.average_performance}</StyledTableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                {emptyRows > 0 && (
                                                    <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                                        <TableCell colSpan={6} />
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={recentGamesStats.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onChangePage={handleChangePage}
                                        onChangeRowsPerPage={handleChangeRowsPerPage}
                                    />
                                </Paper>
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
}


export default Recent_Games_Stats;