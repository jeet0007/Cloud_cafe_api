require("dotenv").config({ path: "config.env" });
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const libraryRoutes = require("./routes/libraryRoutes");
const gamesRoutes = require("./routes/gamesRoutes");
const userRoutes = require("./routes/userRoutes");


const connectDb = require('./config/database');

const PORT = process.env.PORT || 5000

//Set up return json format
app.use(express.json()); // converts body into json
app.use(express.urlencoded({ extended: false })); // exclude extra details

app.use(cors())

app.get('/', (req, res) => {
    res.send("The database is working")
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://cloud-cafe-webapp.herokuapp.com"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http:localhost:3000/"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//Connect Database
connectDb();


app.use('/api/v1/library', libraryRoutes);
app.use('/api/v1/game', gamesRoutes);
app.use('/api/v1/user', userRoutes);

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}/`);
});

process.on('SIGILL', error => {
    console.error(error);
});
