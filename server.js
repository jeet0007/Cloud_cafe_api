require("dotenv").config({ path: "config.env" });
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const BodyParser = require("body-parser");

const connectDb = require('./config/database');

const PORT = process.env.PORT || 5000

//Set up return json format
app.use(BodyParser.json()); // converts body into json
app.use(BodyParser.urlencoded({ extended: false })); // exclude extra details
app.use(cors());

app.get('/', (req, res) => {
    res.send("The database is working")
});
//Connect Database
connectDb();

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}/`);
});

process.on('SIGILL', error => {
    console.error(error);
});
