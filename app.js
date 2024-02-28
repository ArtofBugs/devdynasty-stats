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
const db = require('./database/db-connector')

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

app.get('/answers', function(req, res)
    { 
        let browse_answers = `
        SELECT Answers.answerID, Answers.answerText, Questions.questionText, Answers.correctness FROM Answers 
        INNER JOIN Questions ON Answers.questionID = Questions.questionID 
        ORDER BY Answers.answerID;";
        `
        db.pool.query(browse_answers, function(error, rows, fields){    // Execute the query
            res.status(200).render("answers", {
                title: "Answers",
                data: rows
            });                
        })  
    });

app.get('/question_types', function(req, res)
    {
        let browse_question_types = `
        SELECT typeID, typeName FROM Question_Types 
        ORDER BY typeID;";
        `
        db.pool.query(browse_question_types, function(error, rows, fields){    // Execute the query
            res.status(200).render("question_types", {
                title: "Question Types",
                data: rows
            });                
        })  
    });
   
app.get('/rounds_questions', function(req, res)
    {
        let browse_rounds_questions = `
        SELECT Game_Rounds.roundID, Questions.questionText FROM Game_Rounds 
        INNER JOIN Rounds_Questions ON Game_Rounds.roundID = Rounds_Questions.roundID 
        INNER JOIN Questions ON Rounds_Questions.questionID = Questions.questionID ORDER BY Game_Rounds.roundID, Questions.questionID;";
        `
        db.pool.query(browse_rounds_questions, function(error, rows, fields){    // Execute the query
            res.status(200).render("rounds_questions", {
                title: "Rounds Questions",
                data: rows
            });                 
        })  
    });

/*
    LISTENER
*/
app.listen(PORT, function() {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
