import React from "react";
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';


const GettingStartedItem = ({ item }) => {
    return (
        <TimelineItem>

            {!item.sideContent ? '' : (
                <TimelineOppositeContent>
                    <Typography variant="h5">
                        {item.sideContent}
                    </Typography>
                </TimelineOppositeContent>)}

            <TimelineSeparator>
                <TimelineDot color={item.iconColor} variant={item.iconVariant}>
                    {item.icon}
                </TimelineDot>
                {!item.connectorColor ? '' : <TimelineConnector className={item.connectorColor} />}
            </TimelineSeparator>

            <TimelineContent>
                <Paper elevation={3} style={{padding: '6px 16px'}}>
                    <Typography variant="h6" component="h1"><b>{item.title}</b></Typography>
                    <Typography>{item.content}</Typography>
                </Paper>
            </TimelineContent>

        </TimelineItem>
    )

}
export default GettingStartedItem;
