// All code here unless otherwise noted adapted from sample code found here:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data

// Get the objects we need to modify
let insertQuestionForm = document.getElementById('insert-question');

// Modify the objects we need
insertQuestionForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputQuestionText = document.getElementById("input-questionText");
    let inputTypeID = document.getElementById("input-typeID");

    // Get the values from the form fields
    let questionTextValue = inputQuestionText.value;
    let typeIDValue = inputTypeID.value;

    // Put our data we want to send in a javascript object
    let data = {
        questionText: questionTextValue,
        typeID: typeIDValue,
    }

    console.log(data)

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/insert-question", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        // console.log(xhttp.responseText);

        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputQuestionText.value = '';
            inputTypeID.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from
// Game_Rounds
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("questions-table");

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    console.log(parsedData)

    let newRow = parsedData[parsedData.length - 1]

    console.log(newRow)

    // Create a row and 4 cells
    let row = document.createElement("TR");
    row.setAttribute('row-id', newRow.questionID)

    let questionIDCell = document.createElement("TD");
    let questionTextCell = document.createElement("TD");
    let typeNameCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    questionIDCell.innerText = newRow.questionID;
    questionTextCell.innerText = newRow.questionText;
    typeNameCell.innerText = newRow.typeName;
    deleteCell.innerHTML = `<button onclick="deleteRound(${newRow.questionID})">Delete</button>`;

    // Add the cells to the row
    row.appendChild(questionIDCell);
    row.appendChild(questionTextCell);
    row.appendChild(typeNameCell);
    row.appendChild(deleteCell);

    // Add the row to the table
    currentTable.appendChild(row);
}