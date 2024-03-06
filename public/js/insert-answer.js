// All code here unless otherwise noted adapted from sample code found here:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data

// Get the objects we need to modify
let insertAnswerForm = document.getElementById('insert-answer-form-ajax');

// Modify the objects we need
insertAnswerForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputAnswerText = document.getElementById("input-answerText")
    let inputQuestionID = document.getElementById("input-questionID")
    let inputCorrectness = document.getElementById("input-correctness")

    // Get the values from the form fields
    let answerTextValue = inputAnswerText.value
    let questionIDValue = inputQuestionID.value
    let correctnessValue = parseInt(inputCorrectness.value)

    // Put our data we want to send in a javascript object
    let data = {
        answerText: answerTextValue,
        questionID: questionIDValue,
        correctness: correctnessValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/insert-answer-form-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        // console.log(xhttp.responseText);

        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputAnswerText.value = ''
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from
// Answers
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("answers-table");

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    console.log(parsedData)

    let newRow = parsedData[parsedData.length - 1]

    console.log(newRow)

    // Create a row and cells
    let row = document.createElement("TR");
    row.setAttribute('row-id', newRow.answerID)

    let answerIDCell = document.createElement("TD");
    let answerTextCell = document.createElement("TD");
    let questionTextCell = document.createElement("TD");
    let correctnessCell = document.createElement("TD");

    // Fill the cells with correct data
    answerIDCell.innerText = newRow.answerID;
    answerTextCell.innerText = newRow.answerText
    questionTextCell.innerText = newRow.questionText
    correctnessCell.innerText = newRow.correctness

    // Add the cells to the row
    row.appendChild(answerIDCell);
    row.appendChild(answerTextCell);
    row.appendChild(questionTextCell);
    row.appendChild(correctnessCell);

    // Add the row to the table
    currentTable.appendChild(row);
}
