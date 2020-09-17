import React, { useState } from "react";
import CONSTANTS from "../../constants";
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fixture_Accordion from './Fixture_Accordion.js';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';



const GROUP_STAGE_1_PLACE = 0;
const GROUP_STAGE_2_PLACE = 1;
const GROUP_STAGE_3_PLACE = 2;
const GROUP_STAGE_4_PLACE = 3;
const GROUP_STAGE_5_PLACE = 4;
const GROUP_STAGE_6_PLACE = 5;
const FINALS8_PLACE = 6;
const QUARTER_FINALS_PLACE = 7;
const SEMI_FINALS_PLACE = 8;
const FINAL_PLACE = 9;

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "#46B3E6",
        width: '100%',
        padding: '3px',
        marginTop: "10px",
        borderRadius: "20px",
        minHeight:"1000px",
    },
    typographyStyle: {
        color: "#FFFFFF",
        backgroundColor: "#2E279D",
        borderRadius: "100px",
        letterSpacing: "3px",
        fontWeight: "600",
        marginTop: "10px",
        fontSize: "35px",

    },
    headtypographyStyle: {
        //color: "blue",
        color: "#FFFFFF",
        //backgroundColor: "#FFEDDF",
        backgroundColor: "#2E279D",
        borderRadius: "100px",
        letterSpacing: "4px",
        fontWeight: "600",
        marginTop: "10px",
        fontSize: "50px",
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        borderRadius: "5px",
        backgroundColor: "#ACE5FF",
        padding: '5px',
    },
}));

const Fixtures_And_Results = () => {
    const classes = useStyles();
    const [fixtures, setFixtures] = useState([]);
    const [expanded, setExpanded] = React.useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [fixturesRoundes, setFixturesRoundes] = useState([]);
    const [teams, setTeams] = useState([]);
    const [teamId, setTeamId] = useState(0);
    const [season, setSeason] = useState("530");


    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

const getItems = () => {
        setIsLoading(true);
        let promiseList = fetch(CONSTANTS.ENDPOINT.ALL_FIXTURES, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        })
            .then(response => {
                if (!response.ok) {
                }
                return response.json();
            })
        return promiseList;
    }

    const setEvents = (fixturesList, team_id, season) => {
        setFixtures(fixturesList)
        var fixtures_to_round = []
        var groupStage1 = []
        var groupStage2 = []
        var groupStage3 = []
        var groupStage4 = []
        var groupStage5 = []
        var groupStage6 = []
        var finals8 = []
        var quarterFinals = []
        var semiFinals = []
        var final = []

        fixturesList.forEach(fixture => {
            if ((team_id === 0 || team_id === fixture.homeTeam.team_id || team_id === fixture.awayTeam.team_id) && fixture.league_id === parseInt(season)) {
                if (fixture.round === "Group Stage - 1") {
                    groupStage1.push(fixture);
                }
                if (fixture.round === "Group Stage - 2") {
                    groupStage2.push(fixture);
                }
                if (fixture.round === "Group Stage - 3") {
                    groupStage3.push(fixture);
                }
                if (fixture.round === "Group Stage - 4") {
                    groupStage4.push(fixture);
                }
                if (fixture.round === "Group Stage - 5") {
                    groupStage5.push(fixture);
                }
                if (fixture.round === "Group Stage - 6") {
                    groupStage6.push(fixture);
                }
                if (fixture.round === "8th Finals") {
                    finals8.push(fixture);
                }
                if (fixture.round === "Quarter-finals") {
                    quarterFinals.push(fixture);
                }
                if (fixture.round === "Semi-finals") {
                    semiFinals.push(fixture);
                }
                if (fixture.round === "Final") {
                    final.push(fixture);
                }
            }
        })
        fixtures_to_round.push(groupStage1);
        fixtures_to_round.push(groupStage2);
        fixtures_to_round.push(groupStage3);
        fixtures_to_round.push(groupStage4);
        fixtures_to_round.push(groupStage5);
        fixtures_to_round.push(groupStage6);
        fixtures_to_round.push(finals8);
        fixtures_to_round.push(quarterFinals);
        fixtures_to_round.push(semiFinals);
        fixtures_to_round.push(final);
        setFixturesRoundes(fixtures_to_round);
    }

    React.useEffect(() => {
        getItems()
            .then(list => {
                //console.log(list);
                setFixtures(list[1]);
                setTeams(list[0]);
                setEvents(list[1], 0, season);
                setIsLoading(false);
            })
    }, []);

    const handleTeamNameChange = (e) => {
        const teamName = e.target.value
        if (teamName === "All") {
            setTeamId(0);
            setEvents(fixtures, 0, season);
        }
        else {
            var id = 0;
            teams.forEach(team => {
                if (team.team_name === teamName) {
                    id = team.team_id;
                }
            })
            setTeamId(id);
            setEvents(fixtures, id, season);
        }
    }

    const handleStatsYearChange = (e) => {
        setSeason(e.target.value);
        setEvents(fixtures, teamId, e.target.value);
    }

    return (
        <div className={classes.root}>
            <Typography className={classes.headtypographyStyle}
                align="center"
                variant="h3"

            >
                Games Results</Typography >
            {isLoading ? (
                <Grid container direction="column" justify="center" alignItems="center">
                    <CircularProgress size={150} thickness={3} />
                    <Typography gutterBottom variant="h4" color="textSecondary">
                        Loading fixtures...
					</Typography>
                </Grid>
            ) : (
                    <div className="p-3">
                        <div className="text-center">
                        <FormControl className={classes.formControl}>
                            <InputLabel id="demo-dialog-select-label">Season</InputLabel>
                            <Select
                                labelId="demo-dialog-select-label"
                                id="season"
                                name="season"
                                defaultValue="530"
                                onChange={handleStatsYearChange}
                                input={<Input />}
                                >
                                <MenuItem value="52">2016/17</MenuItem>
                                <MenuItem value="31">2017/18</MenuItem>
                                <MenuItem value="132">2018/19</MenuItem>
                                <MenuItem value="530">2019/20</MenuItem>
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
                        {(fixturesRoundes[GROUP_STAGE_1_PLACE].length > 0) ? (
                        <div>
                            <Typography className={classes.typographyStyle}
                                align="center"
                                variant="h3"

                            >
                                Group Stage - 1</Typography >
                        {
                        fixturesRoundes[GROUP_STAGE_1_PLACE].map(fixture => {
                            return (<Fixture_Accordion key={fixture.fixture_id} game={fixture} />);
                        })
                        }
                         </div>
                        ) : (<div></div>)
                        }
                        {(fixturesRoundes[GROUP_STAGE_2_PLACE].length > 0) ? (
                        <div>
                            <Typography className={classes.typographyStyle}
                                align="center"
                                variant="h3"

                            >
                                Group Stage - 2</Typography >
                            {
                                fixturesRoundes[GROUP_STAGE_2_PLACE].map(fixture => {
                                    return (<Fixture_Accordion key={fixture.fixture_id} game={fixture} />);
                                })
                            }
                            </div>
                        ) : (<div></div>)
                        }
                        {(fixturesRoundes[GROUP_STAGE_3_PLACE].length > 0) ? (
                        <div>
                            <Typography className={classes.typographyStyle}
                                align="center"
                                variant="h3"

                            >
                                Group Stage - 3</Typography >
                            {
                                fixturesRoundes[GROUP_STAGE_3_PLACE].map(fixture => {
                                    return (<Fixture_Accordion key={fixture.fixture_id} game={fixture} />);
                                })
                            }
                            </div>
                        ) : (<div></div>)
                        }
                        {(fixturesRoundes[GROUP_STAGE_4_PLACE].length > 0) ? (
                        <div>
                            <Typography className={classes.typographyStyle}
                                align="center"
                                variant="h3"

                            >
                                Group Stage - 4</Typography >
                            {
                                fixturesRoundes[GROUP_STAGE_4_PLACE].map(fixture => {
                                    return (<Fixture_Accordion key={fixture.fixture_id} game={fixture} />);
                                })
                            }
                            </div>
                        ) : (<div></div>)
                        }
                        {(fixturesRoundes[GROUP_STAGE_5_PLACE].length > 0) ? (
                        <div>
                            <Typography className={classes.typographyStyle}
                                align="center"
                                variant="h3"

                            >
                                Group Stage - 5</Typography >
                            {
                                fixturesRoundes[GROUP_STAGE_5_PLACE].map(fixture => {
                                    return (<Fixture_Accordion key={fixture.fixture_id} game={fixture} />);
                                })
                            }
                            </div>
                        ) : (<div></div>)
                        }
                        {(fixturesRoundes[GROUP_STAGE_6_PLACE].length > 0) ? (
                        <div>
                            <Typography className={classes.typographyStyle}
                                align="center"
                                variant="h3"

                            >
                                Group Stage - 6</Typography >
                            {
                                fixturesRoundes[GROUP_STAGE_6_PLACE].map(fixture => {
                                    return (<Fixture_Accordion key={fixture.fixture_id} game={fixture} />);
                                })
                            }
                            </div>
                        ) : (<div></div>)
                        }
                        {(fixturesRoundes[FINALS8_PLACE].length > 0) ? (
                        <div>
                            <Typography className={classes.typographyStyle}
                                align="center"
                                variant="h3"

                            >
                                8th Finals</Typography >
                            {
                                fixturesRoundes[FINALS8_PLACE].map(fixture => {
                                    return (<Fixture_Accordion key={fixture.fixture_id} game={fixture} />);
                                })
                            }
                            </div>
                        ) : (<div></div>)
                        }
                        {(fixturesRoundes[QUARTER_FINALS_PLACE].length > 0) ? (
                        <div>
                            <Typography className={classes.typographyStyle}
                                align="center"
                                variant="h3"

                            >
                                Quarter Finals</Typography >
                            {
                                fixturesRoundes[QUARTER_FINALS_PLACE].map(fixture => {
                                    return (<Fixture_Accordion key={fixture.fixture_id} game={fixture} />);
                                })
                            }
                            </div>
                        ) : (<div></div>)
                        }
                        {(fixturesRoundes[SEMI_FINALS_PLACE].length > 0) ? (
                        <div>
                            <Typography className={classes.typographyStyle}
                                align="center"
                                variant="h3"

                            >
                                Semi Finals</Typography >
                            {
                                fixturesRoundes[SEMI_FINALS_PLACE].map(fixture => {
                                    return (<Fixture_Accordion key={fixture.fixture_id} game={fixture} />);
                                })
                            }
                            </div>
                        ) : (<div></div>)
                        }
                        {(fixturesRoundes[FINAL_PLACE].length>0)?(
                        <div>
                                <Typography className={classes.typographyStyle}
                                    align="center"
                                    variant="h3"

                                >
                                    Final</Typography >
                            {
                                fixturesRoundes[FINAL_PLACE].map(fixture => {
                                    return (<Fixture_Accordion key={fixture.fixture_id} game={fixture} />);
                                })
                            }
                            )
                        </div>
                            ):(<div></div>)
                        }
                   </div>
                )}
        </div>
    );
}


export default Fixtures_And_Results;