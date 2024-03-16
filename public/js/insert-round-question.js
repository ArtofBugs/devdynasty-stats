// All code here unless otherwise noted adapted from sample code found here:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data

// Get the objects we need to modify
let insertRoundQuestionForm = document.getElementById('insert-round-question');

// Modify the objects we need
insertRoundQuestionForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputRoundID = document.getElementById("insert-roundID");
    let inputQuestionID = document.getElementById("insert-questionID");

    // Get the values from the form fields
    let roundIDValue = inputRoundID.value;
    let questionIDValue = inputQuestionID.value;

    // Put our data we want to send in a javascript object
    let data = {
        roundID: roundIDValue,
        questionID: questionIDValue
    }
    console.log(data)

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/insert-round-question", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        console.log(xhttp.responseText);

        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
            window.alert("You can't insert a duplicate Round_Question.")
            return
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from
// Question_Types
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("rounds_questions-table")

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data)
    console.log(parsedData)

    let newRow = parsedData[parsedData.length - 1]

    console.log(newRow)

    // Create a row and 2 cells
    let row = document.createElement("TR")
    row.setAttribute('row-round-id', newRow.roundID)
    row.setAttribute('row-question-text', newRow.questionText)

    let roundIDCell = document.createElement("TD")
    let questionTextCell = document.createElement("TD")
    let deleteCell = document.createElement("TD")

    // Fill the cells with correct data
    roundIDCell.innerText = newRow.roundID;
    questionTextCell.innerText = newRow.questionText;
    deleteCell.innerHTML = `<button onclick="deleteRoundsQuestion(${newRow.roundID}, '${newRow.questionText}')">Delete</button>`

    // Add the cells to the row
    row.appendChild(roundIDCell)
    row.appendChild(questionTextCell)
    row.appendChild(deleteCell)

    // Add the row to the table
    currentTable.appendChild(row)
}
