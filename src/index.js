const sqlite3 = require('sqlite3');
const express = require("express");
const path = require('path');
const cors = require('cors')
const bodyParser = require('body-parser');

var app = express();

app.use(cors());
app.use(bodyParser.json());

// Root route of express app 
app.get("/", (req, res) => { 
    return res.sendFile(path.join(__dirname+'/home.html'));
    //return res.status(401).send({ error: 'No Data Provided!!.'});
});

const HTTP_PORT = 8000
app.listen(HTTP_PORT, () => {
    console.log("Server is listening on port " + HTTP_PORT);
});

// initiate db connection 
let db = new sqlite3.Database('./data/jodi_oil_B_Exports_15M.db', (err) => {
    if (err) {
        console.error(err.message);
    }
});

app.get("/api/countries/:country", (req, res, next) => {
    var params = [req.params.country]
    db.all("SELECT * from world_primary_15_38407562524788 WHERE country = ?", [req.params.country], (err, data) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.status(200).json({data });
    });
});

app.get("/api/countries_/all", (req, res, next) => {
    db.all("SELECT * from world_primary_15_38407562524788", [], (err, data) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.status(200).json({ data });
    });
});
app.get("/api/countries", (req, res, next) => {
    db.all("SELECT country, SUM(value) as value from world_primary_15_38407562524788 GROUP by country ORDER by value DESC", [], (err, data) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.status(200).json({ data });
    });
});

app.get("/api/countries_/top_10_countries", (req, res, next) => {
    db.all("select * from (SELECT country, SUM(value)  as value from world_primary_15_38407562524788 GROUP by country) ORDER by value DESC LIMIT 10", [], (err, data) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.status(200).json({ data });
    });
});

