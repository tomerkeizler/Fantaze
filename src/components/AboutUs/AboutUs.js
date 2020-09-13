import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme) => ({
  chip: {
    fontSize: '1.5rem',
    padding: 18,
    marginBottom: 20,
  }
}));


const AboutUs = () => {
  const classes = useStyles();

  return (
    <div className="container">

      <center>
        <Chip className={classes.chip} color="primary" label="Welcome to Fantaze!" />
      </center>

      <Typography variant="h6">
        The Fantasy sports industry is growing tremendously. As of 2020, Fantasy sports is a $8 billion industry with 60 million fantasy players worldwide.
        In this type of game, participants assemble imaginary teams of real players of a professional sport. These teams compete based on the statistical performance of those players in actual games.
      </Typography>
      <br />

      <Typography variant="h6">
        <b>
          In Fantaze, we expertise in the area of football. We support UEFA Champions League Fantasy players worldwide, allowing them to maximize their Fantasy performances based on our excellent football data analyzing skills.
        </b>
      </Typography>
      <br />

      <Typography variant="h6">
        We take into account a lot of football statistics, such as goals scored, assits given, shots taken, fouls commited and more. We combine these parameters and provide an Ultimate team of players, in order to give you an absolute advantage on your Fantazy opponent players and raising your chance to win top prizes.
      </Typography>
      <br />

      <Typography variant="h6">
        Additionally, we take your football preferences into account, allowing you to pick your desired football formation and choose your favorite players.
      </Typography>
      <br />

    </div>
  )
}
export default AboutUs;
