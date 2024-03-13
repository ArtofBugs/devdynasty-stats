/*
    SETUP
*/
require('dotenv').config()

const express = require('express')
const exphbs = require('express-handlebars')
const app = express()

// enable express to handle JSON data and form data
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }))
app.set("view engine", "handlebars")
app.use(express.json())

PORT = process.env.PORT
const db = require('./database/db-connector')

/*
    ROUTES
*/
app.get('/', function(req, res) {
    res.status(200).render("home", {
        title: "Home"
    })
})

app.use(express.static(__dirname + "/public"))


// Pages  ---------------------------------------------------------------------
app.get('/questions', function(req, res) {
    const browse_query = `
        SELECT Questions.questionID, Questions.questionText, Question_Types.typeName FROM Questions
        INNER JOIN Question_Types ON Questions.typeID = Question_Types.typeID
        ORDER BY Questions.questionID;
    `

    let get_typeNames = `SELECT typeID, typeName from Question_Types ORDER BY typeID;`

    db.pool.query(browse_query, function(error, rows, fields) {
        if (error) {
            console.error(error)
        }

        // save Questions
        let questions = rows

        db.pool.query(get_typeNames, (error, rows, fields) => {
            // save the usernames
            let typeNames = rows

            return res.status(200).render("questions", {
                title: "Questions",
                data: questions,
                typeNames: typeNames
            })
        }) 
    })
})

// Code adapted from:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
app.post('/insert-question', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body

    let questionText = data.questionText
    let typeID = data.typeID

    // Create the query and run it on the database
    let insert_question = `INSERT INTO Questions (questionText, typeID) VALUES ( ? , ? )`
    db.pool.query(insert_question, [questionText, typeID], function(error, rows, fields){
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400)
        }
        else
        {
            // If there was no error, perform a SELECT * on Question_Types
            let show_questions = `
                SELECT Questions.questionID, Questions.questionText, Question_Types.typeName FROM Questions
                LEFT JOIN Question_Types ON Questions.typeID = Question_Types.typeID
                WHERE Questions.typeID = ${typeID}; 
            `
    
            db.pool.query(show_questions, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error)
                    res.sendStatus(400)
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows)
                }
            })
        }
    })
})

// Delete routes adapted from sample code here:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data#create-a-delete-route
app.delete('/delete-question/', function(req, res){
    const data = req.body
    const questionID = parseInt(data.id)
    console.log(data)
    const deleteQuery = `DELETE FROM Questions where questionID = ?`

    db.pool.query(deleteQuery, [questionID], function(error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400)
        }
        else {
            res.sendStatus(204)
        }
    })
})

// Code adapted from:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
app.get('/game_rounds', function(req, res) {
    const browse_query = `
        SELECT Game_Rounds.roundID, Users.username, Game_Rounds.score, Game_Rounds.time FROM Game_Rounds
        LEFT JOIN Users ON Game_Rounds.userID = Users.userID
        ORDER BY Game_Rounds.roundID;
    `

    let get_usernames = `SELECT userID, username from Users ORDER BY userID;`

    db.pool.query(browse_query, function(error, rows, fields) {
        if (error) {
            console.error(error)
        }

        // save Game Rounds
        let game_rounds = rows

        db.pool.query(get_usernames, (error, rows, fields) => {
            // save the usernames
            let usernames = rows

            if (error) {
                console.error(error)
            }

            return res.status(200).render("game_rounds", {
                title: "Game Rounds",
                data: game_rounds,
                usernames: usernames
            })
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
        const browse_answers = `
            SELECT Answers.answerID, Answers.answerText, Questions.questionText, Answers.correctness FROM Answers
            INNER JOIN Questions ON Answers.questionID = Questions.questionID
            ORDER BY Answers.answerID;
        `
        let get_questionTexts = `SELECT questionID, questionText FROM Questions ORDER BY questionID;`

        db.pool.query(browse_answers, function(error, rows, fields) {
            if (error) {
                console.error(error)
            }

            // save Answers
            let answers = rows

            db.pool.query(get_questionTexts, (error, rows, fields) => {
                let questionTexts = rows

                if (error) {
                    console.error(error)
                }

                res.status(200).render("answers", {
                    title: "Answers",
                    data: answers,
                    questionTexts: questionTexts
                })
            })
        })
    })

app.get('/question_types', function(req, res)
    {
        const browse_question_types = `
            SELECT typeID, typeName FROM Question_Types
            ORDER BY typeID;
        `
        db.pool.query(browse_question_types, function(error, rows, fields) {
            res.status(200).render("question_types", {
                title: "Question Types",
                data: rows
            })
        })
    })

// Code adapted from:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
app.post('/insert-question-type', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body

    let typeName = data.name

    // Create the query and run it on the database
    let insert_question_type = `INSERT INTO Question_Types (typeName) VALUES ( ? )`
    db.pool.query(insert_question_type, [typeName], function(error, rows, fields){
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400)
        }
        else
        {
            // If there was no error, perform a SELECT * on Question_Types
            let show_question_types = `
                SELECT Question_Types.typeID, Question_Types.typeName FROM Question_Types
                WHERE Question_Types.typeName = '${typeName}'; 
            `
    
            db.pool.query(show_question_types, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error)
                    res.sendStatus(400)
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows)
                }
            })
        }
    })
})

app.get('/rounds_questions', function(req, res)
    {
        const browse_rounds_questions = `
            SELECT Game_Rounds.roundID, Questions.questionText
            FROM Game_Rounds
                INNER JOIN Rounds_Questions ON Game_Rounds.roundID = Rounds_Questions.roundID
                INNER JOIN Questions ON Rounds_Questions.questionID = Questions.questionID
            ORDER BY Rounds_Questions.roundID, Questions.questionID
        ;`

        let get_questionTexts = `SELECT questionID, questionText FROM Questions ORDER BY questionID;` 
    
        db.pool.query(browse_rounds_questions, function(error, rows, fields){    // Execute the query
            if(error) {
                console.error(error)
            }

            // save Game_Rounds
            let rounds = rows
            let get_roundIDs = `SELECT roundID FROM Game_Rounds ORDER BY roundID;` 

            db.pool.query(get_questionTexts, function(error, rows, fields){
                let questionTexts = rows

                if(error) {
                    console.error(error)
                }

                db.pool.query(get_roundIDs, function(error, rows, fields){
                    let roundIDs = rows

                    if(error) {
                        console.error(error)
                    }

                    res.status(200).render("rounds_questions", {
                        title: "Rounds Questions",
                        data: rounds,
                        questionTexts: questionTexts,
                        roundIDs: roundIDs
                    })
                })
                
            })
        })
    })

app.post('/insert-round-question', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body

    let roundID = data.roundID
    let questionID = data.questionID
    
    let insert_round_question = `
        INSERT INTO Rounds_Questions (roundID, questionID)
        VALUES (?, ?)
    ;`

    db.pool.query(insert_round_question, [roundID, questionID], function(error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400)
        }
        else
        {
            // If there was no error, perform a SELECT * on Rounds_Questions
            let show_rounds_questions = `
            SELECT Rounds_Questions.roundID, Questions.questionText
            FROM Rounds_Questions 
                INNER JOIN Questions 
                ON Rounds_Questions.questionID = Questions.questionID
            WHERE Rounds_Questions.roundID = ${roundID} AND Questions.questionID = ${questionID};
            `
            db.pool.query(show_rounds_questions, function(error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error)
                    res.sendStatus(400)
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows)
                }
            })
        }
    })
})

// Code adapted from:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
app.post('/insert-game-round-form-ajax', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body

    // Capture NULL values
    let userID = parseInt(data.userID)
    if (isNaN(userID))
    {
        userID = null
    }

    let score = parseInt(data.score)
    if (isNaN(score))
    {
        score = null
    }

    let time = data.time
    if (time == '') {
        time = null
    }

    // Create the query and run it on the database
    let insert_game_rounds = `INSERT INTO Game_Rounds (userID, score, time) VALUES ( ? , ? , ? )`
    db.pool.query(insert_game_rounds, [userID, score, time], function(error, rows, fields){
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400)
        }
        else
        {
            // If there was no error, perform a SELECT * on Game_Rounds
            let show_game_rounds = `
                SELECT Game_Rounds.roundID, Users.username, Game_Rounds.score, Game_Rounds.time FROM Game_Rounds
                LEFT JOIN Users ON Game_Rounds.userID = Users.userID
                WHERE Game_Rounds.userID = ${userID};
            `
            if (userID === null) {
                show_game_rounds = `
                    SELECT Game_Rounds.roundID, Users.username, Game_Rounds.score, Game_Rounds.time FROM Game_Rounds
                    LEFT JOIN Users ON Game_Rounds.userID = Users.userID
                    WHERE Game_Rounds.userID IS NULL;
                `
            }
            db.pool.query(show_game_rounds, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error)
                    res.sendStatus(400)
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows)
                }
            })
        }
    })
})

app.post('/insert-user-form-ajax', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body

    let username = data.username
    let password = data.password

    // Create the query and run it on the database
    let insert_user = `INSERT INTO Users (username, password) VALUES (?, ?);`
    db.pool.query(insert_user, [username, password], function(error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400)
        }
        else
        {
            // If there was no error, perform a SELECT * on Users
            let show_users = `
                SELECT Users.userID, Users.username, Users.password FROM Users
                WHERE Users.username = '${username}';
            `
            db.pool.query(show_users, function(error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error)
                    res.sendStatus(400)
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows)
                }
            })
        }
    })
})

app.post('/insert-answer-form-ajax', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body

    let answerText = data.answerText
    let questionID = data.questionID
    let correctness = data.correctness

    // Create the query and run it on the database
    let insert_answer = `
        INSERT INTO Answers (answerText, questionID, correctness)
        VALUES (?, ?, ?)
    ;`

    db.pool.query(insert_answer, [answerText, questionID, correctness], function(error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400)
        }
        else
        {
            // If there was no error, perform a SELECT * on Answers
            let show_answers = `
                SELECT Answers.answerID, Answers.answerText, Questions.questionText, Answers.correctness
                FROM Answers
                    INNER JOIN Questions
                    ON Answers.questionID = Questions.questionID
                WHERE Answers.answerText = '${answerText}';
            `
            db.pool.query(show_answers, function(error, rows, fields) {

                // If there was an error on the second query, send a 400
                if (error) {
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error)
                    res.sendStatus(400)
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows)
                }
            })
        }
    })
})

// Delete ---------------------------------------------------------------------
// Delete routes adapted from sample code here:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data#create-a-delete-route
app.delete('/delete-round/', function(req, res){
    const data = req.body
    const roundID = parseInt(data.id)
    const deleteQuery = `DELETE FROM Game_Rounds where roundID = ?`

    db.pool.query(deleteQuery, [roundID], function(error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400)
        }
        else {
            res.sendStatus(204)
        }
    })})

app.delete('/delete-rounds-question/', function(req, res){
    const data = req.body
    const roundID = parseInt(data.roundID)
    const questionText = data.questionText
    const deleteQuery = `
        DELETE Rounds_Questions FROM Rounds_Questions
        JOIN Questions ON Rounds_Questions.questionID = Questions.questionID
        WHERE Rounds_Questions.roundID = ? AND Questions.questionText = ?
    ;`

    db.pool.query(deleteQuery, [roundID, questionText], function(error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400)
        }
        else {
            res.sendStatus(204)
        }
    })})

app.delete('/delete-user/', function(req, res){
    const data = req.body
    const userID = parseInt(data.id)
    const deleteQuery = `DELETE FROM Users where userID = ?`

    db.pool.query(deleteQuery, [userID], function(error, rows, fields) {
        if (error) {
            console.log(error)
            res.sendStatus(400)
        }
        else {
            res.sendStatus(204)
        }
    })})

// Update --------------------------------------------------------------------
// Update routes adapted from sample code here:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data#update-the-back-end-appjs
app.put('/put-round', function(req, res) {
    const data = req.body

    const id = parseInt(data.id)
    const username = data.username
    const score = data.score
    const time = data.time

    const updateQuery = `
        UPDATE Game_Rounds SET
            userID = ? ,
            score = ? ,
            time = ?
        WHERE roundID = ?
    ;`
    const selectQuery = `
        SELECT Game_Rounds.roundID, Users.username, Game_Rounds.score, Game_Rounds.time FROM Game_Rounds
        LEFT JOIN Users ON Game_Rounds.userID = Users.userID
        WHERE roundID = ?
    ;`

    // Run the 1st query
    db.pool.query(updateQuery, [username, score, time, id], function(error, rows, fields) {
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error)
        res.sendStatus(400)
        }
        // If there was no error, we run our second query and return that data so we can use it to update the
        // table on the front-end
        else {
            // Run the second query
                db.pool.query(selectQuery, [id], function(error, rows, fields) {

                    if (error) {
                        console.log(error)
                        res.sendStatus(400)
                    }
                    else {
                        console.log(rows)
                        res.send(rows)
                    }
                })
            }
  })})

/*
    LISTENER
*/
app.listen(PORT, function() {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
})
