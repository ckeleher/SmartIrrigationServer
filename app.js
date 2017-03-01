const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

// Set up the express app
const app = express();
const port = process.env.PORT;

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Send the index.html file 
app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html');
});

app.use("/static", express.static(__dirname + '/static'));
// Require our routes into the application.
require('./server/routes')(app);
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness.',
}));

// send static files for webapp
app.use("/static", express.static(__dirname + '/static'));

app.listen(port);
console.log("Listening to port: " + port);
