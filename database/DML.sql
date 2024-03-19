-- Project Title: DevDynasty Question Stats
-- Made by Team DevDynasty / Group 160
-- Annette Tongsak and Oria Weng

-- This file contains our Data Manipulation Queries.

-- Users ------------------------------------------------------------------------------------------------------------------

-- Create functionality --

-- Add a User with the given username and password
INSERT INTO Users (username, password) 
    VALUES (
        :usernameInput, 
        :passwordInput
    )
;

-- Get the newly inserted User
SELECT userID, username, password 
    FROM Users
    WHERE username = :usernameInput
;

-- Read functionality --

-- Get all Users to display on the Users page
SELECT userID, username, password 
    FROM Users
    ORDER BY userID
;

-- Delete functionality --

-- Delete the User with the given ID (this deletion will be cascaded to Game_Rounds)
DELETE 
    FROM Users 
    WHERE userID = :selectedUserID
;

-- Questions  -------------------------------------------------------------------------------------------------------------

-- Create functionality --

-- Add a Question with the given text and type ID
INSERT INTO Questions (questionText, typeID) 
    VALUES (
        :questionTextInput, 
        :selectedTypeID
    )
;

-- Get the newly inserted Question
SELECT Questions.questionID, Questions.questionText, Question_Types.typeName 
    FROM Questions
        LEFT JOIN Question_Types 
        ON Questions.typeID = Question_Types.typeID
    WHERE Questions.typeID = :selectedTypeID
;

-- Read functionality --

-- Get all Questions to display on the Questions page
SELECT Questions.questionID, Questions.questionText, Question_Types.typeName 
    FROM Questions
        INNER JOIN Question_Types 
        ON Questions.typeID = Question_Types.typeID
    ORDER BY Questions.questionID
;

-- Get all Question_Types and their type name to display in the question type dropdown
SELECT typeID, typeName 
    FROM Question_Types 
    ORDER BY typeID
;

-- Delete functionality --

-- Delete the Question with the given ID (this deletion will be cascaded to Answers)
DELETE 
    FROM Questions 
    WHERE questionID = :selectedQuestionID
;

-- Answers ----------------------------------------------------------------------------------------------------------------

-- Create functionality --

-- Add an Answer with the given text, question ID, and correctness 
INSERT INTO Answers (answerText, questionID, correctness)
    VALUES
    (
        :answerTextInput,
        :questionIDInput,
        :correctnessInput
    )
;

-- Get the newly inserted Answer
SELECT Answers.answerID, Answers.answerText, Questions.questionText, Answers.correctness
    FROM Answers
        INNER JOIN Questions
        ON Answers.questionID = Questions.questionID
    WHERE Answers.answerText = :answerTextInput
;

-- Read functionality --

-- Get all Answers to display on the Answers page
SELECT Answers.answerID, Answers.answerText, Questions.questionText, Answers.correctness
    FROM Answers
        INNER JOIN Questions
        ON Answers.questionID = Questions.questionID
    ORDER BY Answers.answerID
;

-- Get all Questions and their text to display in the question text dropdown
SELECT questionID, questionText 
    FROM Questions  
    ORDER BY questionID
;    
    
-- Question_Types ---------------------------------------------------------------------------------------------------------

-- Create functionality --

-- Add a Question_Type with the given type name
INSERT INTO Question_Types (typeName)
    VALUES (
        :typeNameInput
    )
;

-- Get the newly inserted Question_Type
SELECT typeID, typeName 
    FROM Question_Types
    WHERE typeName = :typeNameInput
;

-- Read functionality --

-- Get all Question_Types to display on the Question_Types page
SELECT typeID, typeName
    FROM Question_Types
    ORDER BY typeID
;

-- Game_Rounds ------------------------------------------------------------------------------------------------------------

-- Create functionality --

-- Add a Game_Round with the given user ID, score, and time
INSERT INTO Game_Rounds (userID, score, time) 
    VALUES (
        :userIDInput, 
        :scoreInput, 
        :timeInput
    )
;

-- Get the newly inserted Game_Round
SELECT Game_Rounds.roundID, Users.username, Game_Rounds.score, Game_Rounds.time 
    FROM Game_Rounds
        LEFT JOIN Users 
        ON Game_Rounds.userID = Users.userID
    WHERE Game_Rounds.userID = :userIDInput
;

-- Get the newly inserted Game_Round in the case where the user ID is NULL
SELECT Game_Rounds.roundID, Users.username, Game_Rounds.score, Game_Rounds.time 
    FROM Game_Rounds
        LEFT JOIN Users 
        ON Game_Rounds.userID = Users.userID
    WHERE Game_Rounds.userID IS NULL
;

-- Read functionality --

-- Get all Game_Rounds to display on the Game_Rounds page
SELECT Game_Rounds.roundID, Users.username, Game_Rounds.score, Game_Rounds.time 
    FROM Game_Rounds
        LEFT JOIN Users 
        ON Game_Rounds.userID = Users.userID
    ORDER BY Game_Rounds.roundID
;

-- Get all Users and their username to display in the username dropdown
SELECT userID, username 
    FROM Users 
    ORDER BY userID
;

-- Update functionality --

-- Update a Game_Round with the given round ID, user ID, score, and time
UPDATE Game_Rounds 
    SET 
        userID = :selectedUserID,
        score = :selectedScore,
        time = :selectedTime
    WHERE roundID = :selectedRoundID
;

-- Get the newly updated Game_Round 
SELECT Game_Rounds.roundID, Users.username, Game_Rounds.score, Game_Rounds.time 
    FROM Game_Rounds
        LEFT JOIN Users 
        ON Game_Rounds.userID = Users.userID
    WHERE Game_Rounds.roundID = :selectedRoundID 
;

-- Delete functionality --

-- Delete the Game_Round with the given ID (this deletion will be cascaded to the Rounds_Questions intersection table)
DELETE 
    FROM Game_Rounds 
    WHERE roundID = :selectedRoundID
;

-- Rounds_Questions -------------------------------------------------------------------------------------------------------

-- Create functionality --

-- Add a Round_Question with the given round ID and question ID
INSERT INTO Rounds_Questions (roundID, questionID)
    VALUES
    (
        :roundIDInput,
        :questionIDInput
    )
;

-- Get the newly inserted Round_Question
SELECT Rounds_Questions.roundID, Questions.questionText
    FROM Rounds_Questions
        INNER JOIN Questions
        ON Rounds_Questions.questionID = Questions.questionID
    WHERE Rounds_Questions.roundID = :roundIDInput AND Questions.questionID = :questionIDInput
;

-- Read functionality --

-- Get all Rounds_Questions to display on the Rounds_Questions page
SELECT Game_Rounds.roundID, Questions.questionText
    FROM Game_Rounds
        INNER JOIN Rounds_Questions ON Game_Rounds.roundID = Rounds_Questions.roundID
        INNER JOIN Questions ON Rounds_Questions.questionID = Questions.questionID
    ORDER BY Rounds_Questions.roundID, Questions.questionID
;

-- Get all Game_Rounds and their clarifying information to display in the round ID dropdown
SELECT Game_Rounds.roundID, Users.username, Game_Rounds.score, Game_Rounds.time
    FROM Game_Rounds
        LEFT JOIN Users ON Game_Rounds.userID = Users.userID
    ORDER BY Game_Rounds.roundID
;

-- Get all Questions and their text to display in the question text dropdown
SELECT questionID, questionText 
    FROM Questions 
    ORDER BY questionID
;

-- Update functionality -- 

-- Update a Round_Question with the given old and new round ID and question ID 
UPDATE Rounds_Questions
    SET roundID = :updated_roundID, questionID = :updated_questionID
    WHERE roundID = :roundID_to_update AND questionID = :questionID_to_update
;

-- Get the newly updated Round_Question
SELECT Rounds_Questions.roundID, Questions.questionText
    FROM Rounds_Questions
        JOIN Questions 
        ON Rounds_Questions.questionID = Questions.questionID
    WHERE Rounds_Questions.roundID = :updated_roundID AND Rounds_Questions.questionID = :updated_questionID
;

-- Delete functionality --

-- Delete the Round_Question with the given question ID and question text
DELETE Rounds_Questions FROM Rounds_Questions
    JOIN Questions 
    ON Rounds_Questions.questionID = Questions.questionID
    WHERE Rounds_Questions.roundID = :roundIDInput AND Questions.questionText = :questionTextInput
;
