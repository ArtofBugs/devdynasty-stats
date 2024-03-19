// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data#create-add_personjs---client-side-js
// Scope: Whole file except where otherwise noted
// Originality: Adapted from the starter code to fit our project's entities and attributes
// Date: 3/16/2024

// Get the objects we need to modify
let insertGameRoundForm = document.getElementById('insert-game-round-form-ajax');

// Modify the objects we need
insertGameRoundForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputUserID = document.getElementById("input-userID");
    let inputScore = document.getElementById("input-score");
    let inputHours = document.getElementById("input-hours")
    let inputMins = document.getElementById("input-mins")
    let inputSec = document.getElementById("input-sec")

    // Get the values from the form fields
    let userIDValue = inputUserID.value;
    let scoreValue = inputScore.value;

    // We wrote the code below (until the dashed line) for getting the time value from the time input boxes
    // and distinguishing between a null input and a 00:00:00 time ----------------------------------------
    let timeValue = ''

    if (!inputHours.value && !inputMins.value && !inputSec.value) {
        // If all empty, input is null
        timeValue = null
    }
    else {
        if (inputHours.value) {
            timeValue += inputHours.value
        }
        else {
            // Fill with zero if this box was empty but not all boxes were empty
            timeValue += '0'
        }
        timeValue += ":"
        if (inputMins.value) {
            timeValue += inputMins.value
        }
        else {
            // Fill with zero if this box was empty but not all boxes were empty
            timeValue += '0'
        }
        timeValue += ":"
        if (inputSec) {
            timeValue += inputSec.value
        }
        else {
            // Fill with zero if this box was empty but not all boxes were empty
            timeValue += '0'
        }
    }
    // End our code for getting time value ----------------------------------------------------------------

    // Put our data we want to send in a javascript object
    let data = {
        userID: userIDValue,
        score: scoreValue,
        time: timeValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/insert-game-round-form-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        // console.log(xhttp.responseText);

        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputUserID.value = '';
            inputScore.value = '';
            inputHours.value = '';
            inputMins.value = '';
            inputSec.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from Game_Rounds
addRowToTable = (data) => {

    // Get a reference to the current table on the page
    let currentTable = document.getElementById("game-rounds-table");

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    console.log(parsedData)

    let newRow = parsedData[parsedData.length - 1]

    console.log(newRow)

    // The if statement below is all our work.
    // We added this code to add back the header rows after displaying the
    // "No data to display" message.
    if (currentTable.rows.length === 1) {
        // Remove the message row
        currentTable.deleteTHead()
        // Add a new header
        let newHeader = document.createElement("THEAD")
        let newHeaderRow = document.createElement("TR")

        // Add header cells for the data columns
        let roundIDHeader = document.createElement("TH")
        roundIDHeader.innerText = "roundID"
        let usernameHeader = document.createElement("TH")
        usernameHeader.innerText = "username"
        let scoreHeader = document.createElement("TH")
        scoreHeader.innerText = "score"
        let timeHeader = document.createElement("TH")
        timeHeader.innerText = "time"
        let deleteButtonHeader = document.createElement("TH")

        // Add new header elements to table
        newHeaderRow.appendChild(roundIDHeader)
        newHeaderRow.appendChild(usernameHeader)
        newHeaderRow.appendChild(scoreHeader)
        newHeaderRow.appendChild(timeHeader)
        newHeaderRow.appendChild(deleteButtonHeader)

        newHeader.appendChild(newHeaderRow)
        currentTable.appendChild(newHeader)
    }

    // Create a row and 4 cells
    let row = document.createElement("TR");
    row.setAttribute('row-id', newRow.roundID)

    let roundIDCell = document.createElement("TD");
    let usernameCell = document.createElement("TD");
    let scoreCell = document.createElement("TD");
    let timeCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    // We added checks for null values so that null cells display the word "NULL"
    // instead of being empty
    roundIDCell.innerText = newRow.roundID;
    usernameCell.innerText = newRow.username === null ? "NULL" : newRow.username;
    scoreCell.innerText = newRow.score === null ? "NULL" : newRow.score
    timeCell.innerText = newRow.time === null ? "NULL" : newRow.time
    // We added our own additional cell with a delete button.
    deleteCell.innerHTML = `<button onclick="deleteRound(${newRow.roundID})">Delete</button>`;

    // Add the cells to the row
    row.appendChild(roundIDCell);
    row.appendChild(usernameCell);
    row.appendChild(scoreCell);
    row.appendChild(timeCell);
    row.appendChild(deleteCell);

    // Add the row to the table
    currentTable.appendChild(row);

    // Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data#create-a-new-javascript-file,
    // second code block, starting from the comment "Start of new Step 8 code for adding new data to the dropdown menu for updating people"
    // Scope: Just the lines below
    // Originality: Adapted from the starter code to fit our project's entities and attributes
    // Date: 3/16/2024

    // Find roundID dropdown menu, create a new option, fill data in the option,
    // then append option to dropdown menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("round-id-update-select");
    let option = document.createElement("option");
    option.text = newRow.roundID;
    option.value = newRow.roundID;
    selectMenu.add(option);
}
