-- Project Title: DevDynasty Question Stats
-- Made by Team DevDynasty / Group 160
-- Annette Tongsak and Oria Weng

-- This file contains our Data Manipulation Queries.

-- get all question types and their information for the select Question_Types page
SELECT typeID, typeName
    FROM Question_Types
    ORDER BY typeID
;

-- get all answers and their information for the select Answers page
SELECT Answers.answerID, Answers.answerText, Questions.questionText, Answers.correctness -- questionID is the FK from Questions
    FROM Answers
        INNER JOIN Questions
        ON Answers.questionID = Questions.questionID
;

-- get all rounds_questions information for the select Rounds_Questions page
SELECT Game_Rounds.roundID, Questions.questionText -- both are FKs
    FROM Game_Rounds
        INNER JOIN Rounds_Questions ON Game_Rounds.roundID = Rounds_Questions.roundID
        INNER JOIN Questions ON Rounds_Questions.questionID = Questions.questionID

    ORDER BY Game_Rounds.roundID, Questions.questionID
;

-- insert a new question type on the Question_Types page
INSERT INTO Question_Types (typeName)
    VALUES (:typeNameInput)
;

-- get all questions to populate the Question Text dropdown
-- on the Answers page and the Rounds_Questions page
SELECT questionText
    FROM Questions
    ORDER BY questionID
;

-- insert correctness for a new answer on the Answers page
INSERT INTO Answers (answerText, questionID, correctness)
    VALUES
    (
        :answerTextInput,
        :questionIDInput,
        :correctnessInput
    )
;

-- get all rounds for the Round ID dropdown on the Rounds_Questions page
SELECT roundID
    FROM Game_Rounds
    ORDER BY roundID
;

-- insert roundID and questionID for a new round_question on the Rounds_Questions page
INSERT INTO Rounds_Questions (roundID, questionID)
    VALUES
    (
        :roundIDInput,
        :questionIDInput
    )
;

-- select a round_question to update / delete on the Rounds_Questions page
SELECT roundID, questionID
    FROM Rounds_Questions
    WHERE roundID = :roundID_to_update AND questionID = :questionID_to_update
;

-- update a round_question based on selection of which round_question to update
UPDATE Rounds_Questions
    SET roundID = :updated_roundID, questionID = :updated_questionID
    WHERE roundID = :roundID_to_update AND questionID = :questionID_to_update
;

-- delete a round_question based on selection of which round_question to update
DELETE FROM Rounds_Questions
    WHERE roundID = :roundID_to_update AND questionID = :questionID_to_update
;

-- Get all Users and their usernames + passwords for display on the Users page
SELECT userID, username, password FROM Users
ORDER BY userID;

-- Get all Questions and their text and types for display on the Questions page
SELECT Questions.questionID, Questions.questionText, Question_Types.typeID FROM Questions
INNER JOIN Question_Types ON Questions.typeID = Question_Types.typeID
ORDER BY Questions.questionID;

-- Get all Game_Rounds and their scores, times, and associated users
SELECT Game_Rounds.roundID, Users.username, Game_Rounds.score, Game_Rounds.time FROM Game_Rounds
LEFT JOIN Users ON Game_Rounds.userID = Users.userID
ORDER BY Game_Rounds.roundID;

-- Add a User with the given username and password
INSERT INTO Users (username, password) VALUES (:usernameInput, :passwordInput);

-- Get all usernames to be displayed in the dropdown for adding new Game_Rounds
SELECT username from Users
ORDER BY userID;

-- Add a Game_Round with the given username and password
INSERT INTO Game_Rounds (userID, score, time) VALUES (:userIDInput, :scoreInput, :timeInput);

-- Get all Question_Types to be displayed in the dropdown for adding new Questions
SELECT typeName from Question_Types
ORDER BY typeID;

-- Add a Question with the given text and type name
INSERT INTO Questions (questionText, typeID) VALUES (:questionTextInput, :selectedTypeID);

-- Delete the User with the given ID (this deletion will be cascaded to Game_Rounds)
DELETE FROM Users where userID = :selectedUserID;

-- Delete the Game_Round with the given ID (this deletion will be cascaded to the Rounds_Questions intersection table)
DELETE FROM Game_Rounds where roundID = :selectedRoundID;

-- Delete the Question with the given ID (this deletion will be cascaded to Answers)
DELETE FROM Questions where questionID = :selectedQuestionID;

-- Display a Game_Round for the Game Round updating page
SELECT Game_Rounds.roundID, Users.username, Game_Rounds.score, Game_Rounds.time FROM Game_Rounds
LEFT JOIN Users ON Game_Rounds.userID = Users.userID
WHERE roundID = :selectedRoundID;

-- Update the selected Game_Round with the given information (it's possible to set userID to NULL)
UPDATE Game_Rounds SET
    userID = :selectedUserID,
    score = :scoreInput,
    time = timeInput
WHERE roundID = :selectedRoundID;
