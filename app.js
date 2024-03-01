/*
    SETUP
*/
require('dotenv').config()

const express = require('express');
const exphbs = require('express-handlebars')
const app = express();

// enable express to handle JSON data and form data
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))

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
    `;

    let get_usernames = `SELECT username, userID from Users ORDER BY userID;`; 

    db.pool.query(browse_query, function(error, rows, fields) {
        if (error) {
            console.error(error)
        }

        // save Game Rounds
        let game_rounds = rows;

        db.pool.query(get_usernames, (error, rows, fields) => {
            // save the usernames
            let usernames = rows;

            // construct an object for reference in the table
            // array.map is for doing something with each element of an array
            let usermap = {}
            usernames.map(user => {
                let id = parseInt(user.userID, 10);
                usermap[id] = user["username"];  
            })

            // overwrite the user ID with the username in the Game Round object
            game_rounds = game_rounds.map(game_round => {
                return Object.assign(game_round, {userID: usermap[game_round.userID]})
            })

            return res.status(200).render("game_rounds", {
                title: "Game Rounds",
                data: game_rounds,
                usernames: usernames
            });
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
        db.pool.query(browse_answers, function(error, rows, fields) {
            res.status(200).render("answers", {
                title: "Answers",
                data: rows
            });                
        })  
    });

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
            });                
        })  
    });
   
app.get('/rounds_questions', function(req, res)
    {
        const browse_rounds_questions = `
            SELECT Game_Rounds.roundID, Questions.questionText
            FROM Game_Rounds
                INNER JOIN Rounds_Questions ON Game_Rounds.roundID = Rounds_Questions.roundID
                INNER JOIN Questions ON Rounds_Questions.questionID = Questions.questionID
            ORDER BY Game_Rounds.roundID, Questions.questionID
            ;
        `
        db.pool.query(browse_rounds_questions, function(error, rows, fields){    // Execute the query
            res.status(200).render("rounds_questions", {
                title: "Rounds Questions",
                data: rows
            });                 
        })  
    });

app.post('/insert-game-round-form-ajax', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let userID = parseInt(data.userID);
    if (isNaN(userID))
    {
        userID = 'NULL'
    } 

    let score = parseInt(data.score);
    if (isNaN(score))
    {
        score = 'NULL'
    }

    let time = data.time;
    if (isNaN(time))
    {
        time = 'NULL'
    }

    // Create the query and run it on the database
    let insert_game_rounds = `INSERT INTO Game_Rounds (userID, score, time) VALUES ('${userID}', ${score}, '${time}')`;
    db.pool.query(insert_game_rounds, [userID, score, time], function(error, rows, fields){
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Game_Rounds
            let show_game_rounds = `SELECT * FROM Game_Rounds;`;
            db.pool.query(show_game_rounds, function(error, rows, fields){
                

                // If there was an error on the second query, send a 400
                if (error) {
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows); 
                }
            })
        }
    })
});

/*
    LISTENER
*/
app.listen(PORT, function() {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
