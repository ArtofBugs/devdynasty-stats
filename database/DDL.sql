-- Project Title: DevDynasty Question Stats
-- Made by Team DevDynasty / Group 160
-- Annette Tongsak and Oria Weng

-- This file contains our Data Definition Queries and sample data INSERT statements.
-- Uncomment the DESCRIBE and SELECT lines at the bottom to see the tables. 

-- Sample questions and answers taken from the Fall 2023 CS 290 DevDynasty project
-- (authored by Annette Tongsak, Oria Weng, Deepti Ravidath, Jon David-Jackson, and Amish Nautiyal);
-- some were written with the help of ChatGPT.
-- Retrieved from https://github.com/osu-cs290-f23/final-project-devdynasty-fullstack-ascent on Feb. 6th, 2024.

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- Create Users table to record details of registered users playing DevDynasty
CREATE OR REPLACE TABLE `Users` (
    `userID` INT AUTO_INCREMENT NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`userID`),
    UNIQUE (`username`)
);
-- Insert sample usernames and passwords
INSERT INTO `Users` (`username`, `password`) VALUES
("Rob_Hess","12345"),
("Annette_Tongsak","beefyblast"),
("Oria_Weng","TotallySecure!"),
("Deepti_Ravidath","resume.builder"),
("Jon","yum-bananas")
;

-- Create Game_Rounds to record details of DevDynasty rounds played by different Users (or 
-- non-registered players)
CREATE OR REPLACE TABLE `Game_Rounds` (
    `roundID` INT AUTO_INCREMENT NOT NULL,
    `userID` INT,
    `score` INT,
    `time` TIME(0),
    PRIMARY KEY (`roundID`),
    FOREIGN KEY (`userID`) REFERENCES `Users` (`userID`) ON DELETE CASCADE
);
-- Insert sample userID, score, and time values
INSERT INTO `Game_Rounds` (`userID`, `score`, `time`) VALUES
    (2,NULL,NULL),
    (NULL,100,"0:32:01"),
    (4,90,"1:03:19"),
    (3,80,"0:56:11"),
    (5,60,"0:23:21")
;

-- Create Questions table to record details of questions in the DevDynasty question bank
CREATE OR REPLACE TABLE `Questions` (
    `questionID` INT AUTO_INCREMENT NOT NULL,
    `questionText` VARCHAR(1000) NOT NULL,
    `typeID` INT NOT NULL,
    UNIQUE (`questionText`),
    PRIMARY KEY (`questionID`),
    FOREIGN KEY (`typeID`) REFERENCES `Question_Types` (`typeID`) ON DELETE CASCADE
);
-- Insert sample questionText and typeID values
INSERT INTO `Questions` (`questionText`, `typeID`) VALUES
    ("How have you dealt with a team member not pulling their weight in the past?",1),
    ("Describe a time when you faced a tight deadline or a high-pressure situation. How did you handle the stress, and what was the outcome?",1),
    ("Consider two sorting algorithms: Algorithm A with a time complexity of O(n log n) and Algorithm B with a time complexity of O(n^2). Under what conditions might you choose Algorithm B over Algorithm A?",2)
;

-- Create Question_Types category table to indicate whether a Question is behavioral or technical
CREATE OR REPLACE TABLE Question_Types (
    typeID int unique NOT NULL AUTO_INCREMENT,
    typeName varchar(255) unique NOT NULL,

    PRIMARY KEY(typeID)
);
-- Insert sample typeID and typeName values
INSERT INTO Question_Types (
    typeID,
    typeName
)
VALUES (
    1,
    "Behavioral"
),
(
    2,
    "Technical"
),
(
    3,
    "Survey"
);

-- Create Answers table to record details of answers for all questions, including the Question 
-- an Answer corresponds to 
-- Each Question corresponds to 4 Answers, where 3 are incorrect Answers and 1 is a correct Answer
CREATE OR REPLACE TABLE Answers (
    answerID int AUTO_INCREMENT NOT NULL,
    answerText varchar(500) NOT NULL,
    questionID int NOT NULL,
    correctness bool NOT NULL,

    PRIMARY KEY(answerID),
    FOREIGN KEY(questionID) REFERENCES Questions(questionID) ON DELETE CASCADE
);
-- Insert sample answerID, answerText, questionID, and correctness values
INSERT INTO Answers (
    answerID,
    answerText,
    questionID,
    correctness
)
VALUES (
    NULL,
    "If a teammate is slacking off, I would probably ignore it till the last minute or I might mention it to the project manager, but I wouldn't want to get too involved.",
    1,
    0
),
(
    NULL,
    "I'd probably pick up their slack and do their part myself. It's easier than dealing with confrontation, and I don't want the project to suffer because of someone else's laziness.",
    1,
    0
),
(
    NULL,
    "I probably wouldn't do anything. It's the manager's responsibility to make sure everyone is doing what they are supposed to be doing.",
    1,
    0
),
(
    NULL,
    "If I observe a teammate falling behind, my initial step would be to organize a team check-in meeting. This allows for an open discussion for everyone to talk about potential concerns about the workload, challenges, etc.",
    1,
    1
),
(
    NULL,
    "There was an additional feature that my team was supposed to implement for a big assignment, but we missed it until a few days before the deadline. We complained to the professor that they were asking for too much in the assignment. We had other classes that we needed to focus on.",
    2,
    0
),
(
    NULL,
    "There was an additional feature that my team was supposed to implement for a big assignment, but we missed it until a few days before the deadline. We ended up not adding it because we only had a few days and we'd spent so much time on it already.",
    2,   
    0
),
(
    NULL,
    "There was an additional feature that my team was supposed to implement for a big assignment, but we missed it until a few days before the deadline. I wasn't the team leader so I didn't bring it up, because it wasn't really my responsibility. In the project review I explained to the professor that it wasn't my fault.",
    2,
    0
),
(
    NULL,
    "There was an additional feature that my team was supposed to implement for a big assignment, but we missed it until a few days before the deadline. We communicated effectively about what we would need to change, re-evaluated the flow of our program, and allocated ourselves in such a way that we were able to complete the assignment in its entirety.",
    2,
    1
),
(
    NULL,
    "When the input size is unknown",
    3,
    0
),
(
    NULL,
    "When the input is nearly sorted",
    3,
    0
),
(
    NULL,
    "When additional memory usage is a critical factor",
    3,
    0
),
(
    NULL,
    "When the input size is small",
    3,
    1
);

-- Create Rounds_Questions intersection table to facilitate the M:N relationship between
-- Game_Rounds and Questions
CREATE OR REPLACE TABLE `Rounds_Questions` (
    `roundID` INT NOT NULL,
    `questionID` INT NOT NULL,
    FOREIGN KEY (`roundID`) REFERENCES `Game_Rounds` (`roundID`) ON DELETE CASCADE,
    FOREIGN KEY (`questionID`) REFERENCES `Questions` (`questionID`) ON DELETE CASCADE,
    PRIMARY KEY (`roundID`, `questionID`)
);
-- Insert sample roundID and questionID values
INSERT INTO Rounds_Questions (roundID, questionID) 
VALUES (
    (SELECT roundID FROM Game_Rounds WHERE roundID = 2),
    (SELECT questionID FROM Questions 
    WHERE questionText = 'How have you dealt with a team member not pulling their weight in the past?')
);

INSERT INTO Rounds_Questions (roundID, questionID) 
VALUES (
    (SELECT roundID FROM Game_Rounds WHERE roundID = 2),
    (SELECT questionID FROM Questions 
    WHERE questionText = 'Consider two sorting algorithms: Algorithm A with a time complexity of O(n log n) and Algorithm B with a time complexity of O(n^2). Under what conditions might you choose Algorithm B over Algorithm A?')
);

INSERT INTO Rounds_Questions (roundID, questionID) 
VALUES (
    (SELECT roundID FROM Game_Rounds WHERE roundID = 3),
    (SELECT questionID FROM Questions 
    WHERE questionText = 'How have you dealt with a team member not pulling their weight in the past?')
);

INSERT INTO Rounds_Questions (roundID, questionID) 
VALUES (
    (SELECT roundID FROM Game_Rounds WHERE roundID = 4),
    (SELECT questionID FROM Questions 
    WHERE questionText = 'Consider two sorting algorithms: Algorithm A with a time complexity of O(n log n) and Algorithm B with a time complexity of O(n^2). Under what conditions might you choose Algorithm B over Algorithm A?')
);

INSERT INTO Rounds_Questions (roundID, questionID) 
VALUES (
    (SELECT roundID FROM Game_Rounds WHERE roundID = 5),
    (SELECT questionID FROM Questions 
    WHERE questionText = 'Consider two sorting algorithms: Algorithm A with a time complexity of O(n log n) and Algorithm B with a time complexity of O(n^2). Under what conditions might you choose Algorithm B over Algorithm A?')
);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;