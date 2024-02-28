/*
    SETUP
*/
require('dotenv').config()

const express = require('express');
const exphbs = require('express-handlebars')
const app = express();

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }))
app.set("view engine", "handlebars")
app.use(express.json())

PORT = 56789;
const db = require('./db-connector')

/*
    ROUTES
*/
app.get('/', function(req, res) {
    res.status(200).render("home", {
        title: "Home"
    })
});

app.use('/style.css', express.static("style.css"))

app.get('/questions', function(req, res) {
    const browse_query = `
        SELECT Questions.questionID, Questions.questionText, Question_Types.typeName FROM Questions
        INNER JOIN Question_Types ON Questions.typeID = Question_Types.typeID
        ORDER BY Questions.questionID;
    `
    db.pool.query(browse_query, function(error, rows, fields) {
        if (error) {
            console.error(error)
        }
        res.status(200).render("questions", {
            title: "Questions",
            data: rows
        })
    })
})

app.get('/game_rounds', function(req, res) {
    const browse_query = `
        SELECT Game_Rounds.roundID, Users.username, Game_Rounds.score, Game_Rounds.time FROM Game_Rounds
        LEFT JOIN Users ON Game_Rounds.userID = Users.userID
        ORDER BY Game_Rounds.roundID;
    `
    db.pool.query(browse_query, function(error, rows, fields) {
        if (error) {
            console.error(error)
        }
        res.status(200).render("game_rounds", {
            title: "Game Rounds",
            data: rows
        })
    })
})

app.get('/users', function(req, res) {
    const browse_query = `
        SELECT userID, username, password FROM Users
        ORDER BY userID;
    `
    db.pool.query(browse_query, function(error, rows, fields) {
        if (error) {
            console.error(error)
        }
        res.status(200).render("users", {
            title: "Users",
            data: rows
        })
    })
})

/*
    LISTENER
*/
app.listen(PORT, function() {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
