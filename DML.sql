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
