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
const MOST_ASSISTS_PLACE = 1;

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
        minWidth: 650,
    },
    paper: {
        width: '100%',
        //marginBottom: theme.spacing(3),
        backgroundColor: '#72aece',
        borderRadius: '20px',
    },
    typographyStyle: {
        color: "blue",
        backgroundColor: "#a5bfec",
        borderRadius: "100px",
        letterSpacing: "4px",
        fontWeight: "600",
    },
}));

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: '#3f51b5',
        color: theme.palette.common.white,
        fontSize: 20,
        fontWeight: "fontWeightBold",
        border: "0.5px solid #0066CC",
    },
    body: {
        backgroundColor: '#3f8cb5',
        color: theme.palette.common.white,
        fontWeight: "fontWeightMedium",
        fontSize: 16,
        border: "0.5px solid #0066CC",
    },
}))(TableCell);


//const StyledTableRow = withStyles((theme) => ({
//    root: {
//        '&:nth-of-type(odd)': {
//            backgroundColor: theme.palette.action.hover,
//        },
//    },
//}))(TableRow);

const Most_Assists = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [teams, setTeams] = useState([]);
    const [allStats, setAllStats] = useState([]);
    const [mostAssists, setMostAssists] = useState([]);
    const [page, setPage] = React.useState(0);
    const [dense,] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const classes = useStyles();


    const setItems = (list) => {
        setAllStats(list)
        setTeams(list[TEAMS_NAMES])
        setMostAssists(list[MOST_ASSISTS_PLACE]);
        setIsLoading(false);

    }


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const emptyRows = rowsPerPage - Math.min(rowsPerPage, mostAssists.length - page * rowsPerPage);

    const handleStatsYearChange = (e) => {
        getItems(e.target.value)
            .then(list => {
                console.log(list)
                setItems(list)
            })
        setPage(0)
    }


    const setStatsForTeam = (playersList, team_id) => {
        var justTeamStats = [];
        for (var i = 0; i < playersList.length; i++) {
            if (playersList[i].team_id === team_id) {
                var newPlayer = {};
                newPlayer['name'] = playersList[i].name
                newPlayer['score'] = playersList[i].score
                newPlayer['team_id'] = playersList[i].team_id
                newPlayer['place'] = justTeamStats.length + 1
                justTeamStats.push(newPlayer)
            }
        }
        return justTeamStats
    }


    const handleTeamNameChange = (e) => {
        console.log(e.target.value)
        const teamName = e.target.value
        if (teamName === "All") {
            setItems(allStats)
        }
        else {
            var id = 0;
            teams.forEach(team => {
                if (team.team_name === teamName) {
                    id = team.team_id;
                }
            })
            setMostAssists(setStatsForTeam(allStats[MOST_ASSISTS_PLACE], id))
        }
        setPage(0)

    }


    const getItems = (season) => {
        setIsLoading(true);
        let promiseList = fetch(CONSTANTS.ENDPOINT.PLAYER_STATS.MOST_ASSISTS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                year: season,
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
        getItems("2019/20")
            .then(list => {
                setItems(list)

            })
    }, []);


    return (
        <div className="p-3" onLoad={() => getItems}>
            <Typography className={classes.typographyStyle}
                align="center"
                variant="h3"

            >
                Most Assists</Typography >
            <div className="text-center">
                <FormControl className={classes.formControl}>
                    <InputLabel id="demo-dialog-select-label">Season</InputLabel>
                    <Select
                        labelId="demo-dialog-select-label"
                        id="season"
                        name="season"
                        defaultValue="2019/20"
                        onChange={handleStatsYearChange}
                        input={<Input />}
                    >
                        <MenuItem value="2017/18">2017/18</MenuItem>
                        <MenuItem value="2018/19">2018/19</MenuItem>
                        <MenuItem value="2019/20">2019/20</MenuItem>
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
            </div>
            <div className="d-flex justify-content-center row">
                {isLoading ? (
                    <Grid container direction="column" justify="center" alignItems="center">
                        <CircularProgress size={150} thickness={3} />
                        <Typography gutterBottom variant="h4" color="textSecondary">
                            Loading most assists...
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
                                                    <StyledTableCell align="center">Assists</StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {mostAssists.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                                                                <StyledTableCell align="center">{player.score}</StyledTableCell>
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
                                        count={mostAssists.length}
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


export default Most_Assists; 