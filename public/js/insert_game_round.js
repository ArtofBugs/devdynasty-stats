// Get the objects we need to modify
let insertGameRoundForm = document.getElementById('insert-game-round-form-ajax');

// Modify the objects we need
insertGameRoundForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputUserID = document.getElementById("input-userID");
    let inputScore = document.getElementById("input-score");
    let inputTime = document.getElementById("input-time");

    // Get the values from the form fields
    let userIDValue = inputUserID.value;
    let scoreValue = inputScore.value;
    let timeValue = inputTime.value;

    // Put our data we want to send in a javascript object
    let data = {
        userID: userIDValue,
        score: scoreValue,
        time: timeValue,
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
            inputTime.value = '';
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
    let currentTable = document.getElementById("game-rounds-table");

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    
    let newRow = parsedData[parsedData.length - 1]

    console.log(newRow)

    // Create a row and 4 cells
    let row = document.createElement("TR");

    let roundIDCell = document.createElement("TD");
    let usernameCell = document.createElement("TD");
    let scoreCell = document.createElement("TD");
    let timeCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    roundIDCell.innerText = newRow.roundID;
    usernameCell.innerText = newRow.username;
    scoreCell.innerText = newRow.score;
    timeCell.innerText = newRow.time;
    deleteCell.innerHTML = `<button>Delete</button>`;

    // Add the cells to the row 
    row.appendChild(roundIDCell);
    row.appendChild(usernameCell);
    row.appendChild(scoreCell);
    row.appendChild(timeCell);
    row.appendChild(deleteCell);
    
    // Add the row to the table
    currentTable.appendChild(row);

    // Start of new Step 8 code for adding new data to the dropdown menu for updating people
    
    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("round-id-update-select");
    let option = document.createElement("option");
    option.text = newRow.roundID;
    option.value = newRow.roundID;
    selectMenu.add(option);
    // End of new step 8 code.
}