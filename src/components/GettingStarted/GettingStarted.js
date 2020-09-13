import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Timeline from '@material-ui/lab/Timeline';
import GettingStartedItem from "./GettingStartedItem";

import EventNoteIcon from '@material-ui/icons/EventNote';
import ScheduleIcon from '@material-ui/icons/Schedule';
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';
import StarIcon from '@material-ui/icons/Star';
import PeopleIcon from '@material-ui/icons/People';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';


const useStyles = makeStyles((theme) => ({
  main: {
    maxWidth: '1000px',
  },
  greyTail: {
    backgroundColor: theme.palette.grey.main,
  },
  primaryTail: {
    backgroundColor: theme.palette.primary.main,
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const GettingStarted = () => {
  const classes = useStyles();

  const timeLineItems = [
    {
      'sideContent': 'Start here!',
      'icon': <EventNoteIcon />,
      'iconColor': `grey`,
      'iconVariant': `default`,
      'connectorColor': classes.greyTail,
      'title': 'Select current season',
      'content': ''
    },
    {
      'sideContent': '',
      'icon': <ScheduleIcon />,
      'iconColor': `grey`,
      'iconVariant': `default`,
      'connectorColor': classes.greyTail,
      'title': 'Select current fixture',
      'content': 'From fixture 1 all the way to the Finals'
    },
    {
      'sideContent': '',
      'icon': <SportsSoccerIcon />,
      'iconColor': `primary`,
      'iconVariant': `default`,
      'connectorColor': classes.primaryTail,
      'title': 'Pick a football formation',
      'content': 'Do you play Offensively or defensively?'
    },
    {
      'sideContent': '',
      'icon': <StarIcon />,
      'iconColor': `primary`,
      'iconVariant': `default`,
      'connectorColor': classes.primaryTail,
      'title': 'Choose your favorite players',
      'content': 'They will be included in your ultimate team'
    },
    {
      'sideContent': '',
      'icon': <PeopleIcon />,
      'iconColor': `secondary`,
      'iconVariant': `default`,
      'connectorColor': classes.secondaryTail,
      'title': 'Get your ultimate team!',
      'content': ''
    },
    {
      'sideContent': '',
      'icon': <EmojiPeopleIcon />,
      'iconColor': `secondary`,
      'iconVariant': `default`,
      'connectorColor': '',
      'title': 'Play in a Fantasy league',
      'content': 'Win top prizes with your ultimate team'
    },
  ]

  return (
    <div className="row justify-content-center">
      <Timeline align="alternate" className={classes.main}>
        {timeLineItems.map((item, index) =>
          <GettingStartedItem item={item} index={index} key={index} />)}
      </Timeline>
    </div>
  )

}
export default GettingStarted;
