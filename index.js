const express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var cors = require('cors');
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));

const port = process.env.PORT || 8000; 
const mongoDB = process.env.DATABASE_URL || require('./config.json').DB_URL;
const expiration = process.env.TOKEN_EXPIRATION_TIME || require('./config.json').EXP_TIME;


// Functions
const endpoints = require('./functions/endpoints');


// Mongo connection
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:' ));



app.use(express.json());    // Make express read application/json
app.use(cors());            // Add CORS to express

// Root directory
app.get('/', (req, res) => {
    res.send("API Working");
});

// login directory
app.get('/api/login', async (req, res) => {
    // retrieve user and password
    var usuari = req.query.username;
    var contrasenya = req.query.password;

    res.json(await endpoints.login(usuari, contrasenya, expiration));
});

// Logout
app.get('/api/logout', async (req, res) => {
    // retrieve user token
    var tkn = req.query.session_token;

    res.json(await endpoints.logout(tkn));

});

// Get courses
app.get('/api/get_courses', async (req, res) => {
    // retrieve user token
    var tkn = req.query.session_token;

    res.json(await endpoints.get_courses(tkn));

});

// Get course by ID
app.get('/api/get_course_details', async (req, res) => {
    // retrieve user token
    var tkn = req.query.session_token;
    var ID = req.query.courseID;

    res.json(await endpoints.courseDetails(tkn, ID));

});

// Export Courses DB Data
app.get('/api/export_database', async (req, res) => {
    // retrieve user and password
    var usuari = req.query.username;
    var contrasenya = req.query.password;

    res.json(await endpoints.export(usuari, contrasenya));

});

// PIN ENDPOINTS
// Pin request
app.get('/api/pin_request', async (req, res) => {
    // retrieve user token and taskID
    var tkn = req.query.session_token;
    var ID = req.query.taskID;

    res.json(await endpoints.pinRequest(tkn, ID));

});

// Start vr exercise
app.get('/api/start_vr_exercise', async (req, res) => {
    // retrieve user token and taskID
    var pin = req.query.PIN;

    res.json(await endpoints.startvr(pin, expiration));

});

// Finish vr exercise
app.post('/api/finish_vr_exercise', async (req, res) => {
    var pin = req.body.PIN;
    var autograde = req.body.autograde;
    var VRexerciseID = req.body.VRexerciseID;
    var exerciseVersion = req.body.exerciseVersion;
    var metadata = req.body.metadata;

    res.json(await endpoints.endVR(pin, autograde, VRexerciseID, exerciseVersion, metadata, expiration));

});


// Crear un servidor web con express el el puerto asignado en la varible port.
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});