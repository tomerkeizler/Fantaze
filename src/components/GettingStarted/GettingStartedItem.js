import React from "react";
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';
import Slide from '@material-ui/core/Slide';


const GettingStartedItem = ({ item, index }) => {
    return (
        <TimelineItem>
            {!item.sideContent ? '' : (
                <TimelineOppositeContent>
                    <Typography variant="h5">
                        {item.sideContent}
                    </Typography>
                </TimelineOppositeContent>)}

            <Zoom in={true} style={{ transitionDelay: `${500 * index}ms` }}><div style={{ display: 'flex' }}>
                <TimelineSeparator>
                    <TimelineDot color={item.iconColor} variant={item.iconVariant}>
                        {item.icon}
                    </TimelineDot>
                    {!item.connectorColor ? '' : <TimelineConnector className={item.connectorColor} />}
                </TimelineSeparator>
            </div></Zoom>

            <TimelineContent>
                <div>
                    <Slide direction={index % 2 === 0 ? 'left' : 'right'} in={true} style={{ transitionDelay: `${500 * index}ms` }}>
                        <Paper elevation={3} style={{ padding: '6px 16px' }}>
                            <Typography variant="h6" component="h1"><b>{item.title}</b></Typography>
                            <Typography>{item.content}</Typography>
                        </Paper>
                    </Slide>
                </div>
            </TimelineContent>
        </TimelineItem>
    )
}
export default GettingStartedItem;
