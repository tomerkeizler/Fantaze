# Project Fantaze

 A fantasy sport is a type of game where participants assemble imaginary teams composed of real players of a professional sport, with which they accumulate points throughout the season based on the players' performances in actual games.

Fantaze supports football fantasy gamblers around the world in the field of UEFA Champions League. By analyzing the players' performances (such as goals, assists, steals and fouls) and making conclusions based on them, we provide you with the ultimate team that will produce the most points possible, thus allow you to gamble smartly.

In addition, we take into account your football preferences. You can choose a desired football lineup or pick some of your favorite players who would not necessarily have been selected by the algorithm.

Our football performances data was collected from API-Footabll (powered by rapid-API) and is stored using mongoDB database.
The application was developed using Python, React js and Java Script.
The client-server communication is done by a Flask based HTTP server.
 
## Screenshots

### Getting started page
![Getting started page](https://raw.githubusercontent.com/tomerkeizler/Fantasy/master/src/images/Fantaze_UI_1.png)

### Revealing the ultimate team lineup chosen by our algorithm
![Revealing the ultimate team lineup chosen by our algorithm](https://raw.githubusercontent.com/tomerkeizler/Fantasy/master/src/images/Fantaze_UI_2.png)

### Defining your football desires and preferences
![Defining your football desires and preferences](https://raw.githubusercontent.com/tomerkeizler/Fantasy/master/src/images/Fantaze_UI_3.png)

### Managing your preferences
![Managing your preferences](https://raw.githubusercontent.com/tomerkeizler/Fantasy/master/src/images/Fantaze_UI_4.png)

## Getting Started

1. Clone/Download the zip file from the Fantaze repository to your local computer
2. Install node modules `npm install`.
3. Install Python dependencies `npm install-requirements`
4. Start development server `npm start`.
5. Enter this URL - http://localhost:3000 to your web browser

## File Structure

The front-end is based on [create-react-app](https://github.com/facebook/create-react-app).

The back-end is based on [Flask](https://github.com/pallets/flask).

The front-end is served on http://localhost:3000/ and the back-end on http://localhost:3001/.

```
.
├── src/ - React front-end
│ ├── constants.js - Defines the constants for the endpoints and port
│ |── index.jsx - React root component
│ └── components/ - React components for each page
│   └── App/ - React routing specifications

├── server/ - Flask server that provides API routes and serves front-end
│ ├── constants.py - Defines the constants for the endpoints and port
│ ├── fantasyData.py - Contains all static football data, such as seasons and teams
│ |── server.py - Configures Port and HTTP Server and provides API routes
│ |── mongo.py - Creating a  MongoClient instance
│ └── More locic directories
└── README.md
```

## Built with

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [React Router](https://reacttraining.com/react-router/) - A standard routing library for React, with powerful features like lazy code loading and dynamic route matching
- [Python](https://www.python.org/) - Python is an interpreted, high-level, general-purpose programming language
- [Flask](http://flask.pocoo.org/) - Lightweight WSGI web application framework
- [MongoDB](https://www.mongodb.com/) - A document-based, distributed NoSQL database, built for modern application developers
- [Material-UI](https://material-ui.com/) - A popular React UI framework

  This project was created using [Microsoft Web Template Studio](https://github.com/Microsoft/WebTemplateStudio).
