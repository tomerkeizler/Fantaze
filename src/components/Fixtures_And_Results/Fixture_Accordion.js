import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Goal from "../../images/Fixtures_Event/ball.svg";
import RedCard from "../../images/Fixtures_Event/red_card.svg";
import YellowCard from "../../images/Fixtures_Event/yellow_card.svg";
import Subst from "../../images/Fixtures_Event/subst.png";
import PenaltyKick from "../../images/Fixtures_Event/Penalty-Kick.png";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';



const useStyles = makeStyles((theme) => ({
    root: {
        border: "1px black solid",
        width: '100%',
        padding: '3px',
        margin:'3px',
        borderRadius:'10px',
        //backgroundColor:'#46B3E6',
        backgroundColor: '#4D80E4',
    },
    heading: {
        fontSize: theme.typography.pxToRem(17),
        flexBasis: '5%',
        flexShrink: 0,
        marginTop: "6px",
        fontFamily: "Copperplate, Copperplate Gothic Light, fantasy",
        fontWeight: "bold",
        fontSize: "20px",
    },
    headingR: {
        fontSize: theme.typography.pxToRem(17),
        flexBasis: '45%',
        flexShrink: 0,
        textAlign: "left",
        fontFamily: "Cambria, Georgia, serif",
        fontWeight: "bold",
        fontSize:"20px",
    },
    headingL: {
        fontSize: theme.typography.pxToRem(17),
        flexBasis: '45%',
        flexShrink: 0,
        textAlign: "right",
        fontFamily: "Cambria, Georgia, serif",
        fontWeight: "bold",
        fontSize: "20px",
    },
    detailsL: {
        fontSize: theme.typography.pxToRem(17),
        flexBasis: '45%',
        flexShrink: 0,
        textAlign: "right",
        fontFamily: "Franklin Gothic Medium, Franklin Gothic, ITC Franklin Gothic, Arial, sans-serif",
        fontSize: "18px",
        paddingBottom: "2px",
    },
    detailsR: {
        fontSize: theme.typography.pxToRem(17),
        flexBasis: '45%',
        flexShrink: 0,
        textAlign: "left",
        fontFamily: "Franklin Gothic Medium, Franklin Gothic, ITC Franklin Gothic, Arial, sans-serif",
        fontSize: "18px",
        paddingBottom:"2px",
    },
    accordion: {
        textAlign: "center",
        backgroundColor: '#ACE5FF',
    },
    img: {
        display: "inline-block",
        marginRight: "5px",
        marginLeft: "5px",
        textAlign: "center",
    },
    subimg: {
        //display: "inline-block",
        marginRight: "5px",
        marginLeft: "5px",
        textAlign: "center",
        marginTop: "0px",
        position: "relative",
        top: "-10px",
    },
    myDivM: {
        flexBasis: '5%',
    },
    myDivL: {
        flexBasis: '45%',
        //textAlign: "right",

    },
    myDivR: {
        flexBasis: '45%',
    },
    subinL: {
        fontSize: theme.typography.pxToRem(17),
        flexBasis: '45%',
        flexShrink: 0,
        textAlign: "right",
        fontFamily: "Franklin Gothic Medium, Franklin Gothic, ITC Franklin Gothic, Arial, sans-serif",
        fontSize: "16px",
        color:"#00cc00",
    },
    suboutL: {
        fontSize: theme.typography.pxToRem(17),
        flexBasis: '45%',
        flexShrink: 0,
        textAlign: "right",
        fontFamily: "Franklin Gothic Medium, Franklin Gothic, ITC Franklin Gothic, Arial, sans-serif",
        fontSize: "16px",
        color: "#ff3300",
    },
    subinR: {
        fontSize: theme.typography.pxToRem(17),
        flexBasis: '45%',
        flexShrink: 0,
        textAlign: "left",
        fontFamily: "Franklin Gothic Medium, Franklin Gothic, ITC Franklin Gothic, Arial, sans-serif",
        fontSize: "16px",
        color: "#00cc00",
    },
    suboutR: {
        fontSize: theme.typography.pxToRem(17),
        flexBasis: '45%',
        flexShrink: 0,
        textAlign: "left",
        fontFamily: "Franklin Gothic Medium, Franklin Gothic, ITC Franklin Gothic, Arial, sans-serif",
        fontSize: "16px",
        color: "#ff3300",
    },
    subdetailsL: {
        fontSize: theme.typography.pxToRem(17),
        flexBasis: '45%',
        flexShrink: 0,
        textAlign: "right",
    },
    subdetailsR: {
        fontSize: theme.typography.pxToRem(17),
        flexBasis: '45%',
        flexShrink: 0,
        textAlign: "left",
    },
    substdiv: {
        display: "inline-block",
    },
    subminuteR: {
        display: "inline-block",
        fontSize: theme.typography.pxToRem(17),
        flexBasis: '45%',
        flexShrink: 0,
        textAlign: "left",
        fontFamily: "Franklin Gothic Medium, Franklin Gothic, ITC Franklin Gothic, Arial, sans-serif",
        fontSize: "18px",
        marginLeft: "3px",
        position: "relative",
        top: "-10px",
    },
    subminuteL: {
        display: "inline-block",
        fontSize: theme.typography.pxToRem(17),
        flexBasis: '45%',
        flexShrink: 0,
        textAlign: "right",
        fontFamily: "Franklin Gothic Medium, Franklin Gothic, ITC Franklin Gothic, Arial, sans-serif",
        fontSize: "18px",
        marginLeft: "3px",
        position: "relative",
        top: "-10px",
    },
    eventcheckbox: {
        fontFamily: "Franklin Gothic Medium, Franklin Gothic, ITC Franklin Gothic, Arial, sans-serif",
        color: "#2979ff",
    },
}));



export default function Fixture_Accordion(props) {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);
    const [homeTeamEvents, setHomeTeamEvents] = useState([]);
    const [awayTeamEvents, setAwayTeamEvents] = useState([]);
    const [checked, setChecked] = useState(false);



    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const setEvents = () => {
        var homeEvents = [];
        var awayEvents = [];
        if (props.game.events!=null && props.game.events.length > 0) {
            props.game.events.forEach(event => {

                //console.log(event.teamName)
                //console.log(props.game.homeTeam.team_name)
                if (event.teamName === props.game.homeTeam.team_name) {
                    homeEvents.push(event);
                }
                else {
                    awayEvents.push(event);
                }
            })
        }
        setHomeTeamEvents(homeEvents);
        setAwayTeamEvents(awayEvents);
    }

    const printEvent = (event, homeTeam) => {
        var oneKey = event.elapsed + props.game.fixture_id;
        if (homeTeam) {
            oneKey = oneKey+ homeTeamEvents.indexOf(event)
        }
        else {
            oneKey = oneKey + awayTeamEvents.indexOf(event)
        }
        if (event.type === "Goal") {
            var goalImg  = <img className={classes.img} src={Goal} width="35" height="35" />;
            if (event.detail === "Penalty") {
                goalImg = <img className={classes.img} src={PenaltyKick} width="35" height="35" />;
            }
            if (homeTeam) {
                return (
                    <Typography key={oneKey} className={classes.detailsL}>
                        {event.player} ({event.elapsed})
                        {goalImg}
                </Typography>
                )
            }
            else {
                return (
                    <Typography key={oneKey} className={classes.detailsR}>
                        {goalImg}
                        {event.player} ({event.elapsed})
                </Typography>
                )
            }
        }
        else if (event.type === "Card" && event.detail === "Red Card") {
            if (homeTeam) {
                return (
                    <Typography key={oneKey} className={classes.detailsL}>
                        {event.player} ({event.elapsed})
                        <img className={classes.img} src={RedCard} width="35" height="35" />
                </Typography>
                )
            }
            else {
                return (
                    <Typography key={oneKey} className={classes.detailsR}>
                        <img className={classes.img} src={RedCard} width="35" height="35" />
                        {event.player} ({event.elapsed})
                </Typography>
                )
            }
        }
        else if (event.type === "Card" && event.detail === "Yellow Card" && checked) {
            if (homeTeam) {
                return (
                    <Typography key={oneKey} className={classes.detailsL}>
                        {event.player} ({event.elapsed})
                        <img className={classes.img} src={YellowCard} width="35" height="35" />
                    </Typography>
                )
            }
            else {
                return (
                    <Typography key={oneKey} className={classes.detailsR}>
                        <img className={classes.img} src={YellowCard} width="35" height="35" />
                        {event.player} ({event.elapsed})
                </Typography>
                )
            }
        }
        else if (event.type === "subst" && checked) {
            if (homeTeam) {
                return (
                    <div key={oneKey} className={classes.subdetailsL}>
                        <div className={classes.substdiv}>
                         <Typography className={classes.subinL}>{event.detail}</Typography>
                        <Typography className={classes.suboutL}>{event.player}</Typography>
                        </div>
                        <Typography className={classes.subminuteL}>({event.elapsed})</Typography>
                        <img className={classes.subimg} src={Subst} width="35" height="35" />
                    </div>
                )
            }
            else{
                return (
                    <div key={oneKey} className={classes.subdetailsR}>
                        <img className={classes.subimg} src={Subst} width="35" height="35" />
                        <div className={classes.substdiv}>
                            <Typography className={classes.subinR}>{event.detail}</Typography>
                            <Typography className={classes.suboutR}>{event.player}</Typography>
                        </div>
                        <Typography className={classes.subminuteR}>({event.elapsed})</Typography>
                    </div>
                )
            }
        }
        else {
            //console.log("NOGoal")

            return (<div key={oneKey}></div>)
        }
    }

    const handleCheckedChange = (event) => {
        setChecked(event.target.checked);
    };

    React.useEffect(() => {
        setEvents()
    }, []);

    return (
        <div className={classes.root}>
            <Accordion expanded={expanded === props.game.fixture_id} onChange={handleChange(props.game.fixture_id)} className={classes.accordion}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography className={classes.headingL}><img className={classes.img} src={props.game.homeTeam.logo} alt="Italian Trulli" width="40" height="40" />{props.game.homeTeam.team_name}</Typography>
                    <Typography className={classes.heading}>{props.game.goalsHomeTeam} - {props.game.goalsAwayTeam}</Typography>
                    <Typography className={classes.headingR}>{props.game.awayTeam.team_name}<img className={classes.img} src={props.game.awayTeam.logo} alt="Italian Trulli" width="40" height="40" /></Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={classes.myDivL}>
                        {homeTeamEvents.map(event => printEvent(event, true))}
                    </div>
                    <div className={classes.myDivM}>

                    </div>
                    <div className={classes.myDivR}>
                        {awayTeamEvents.map(event => printEvent(event, false))}
                    </div>
                    <FormControlLabel 
                        control={<Checkbox className={classes.eventcheckbox} inputProps={{ 'aria-label': 'Checkbox A' }}
                            checked={checked} onChange={handleCheckedChange} name="checkedA" size="medium"/>}
                        label="Show All Events"
                        label={<Typography variant="h6" className={classes.eventcheckbox}>Show All Events</Typography>}
                    />
                </AccordionDetails>
                </Accordion>
        </div>
    );
}
