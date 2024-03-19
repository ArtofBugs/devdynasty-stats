// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data#create-add_personjs---client-side-js
// Scope: Whole file unless otherwise noted
// Originality: Adapted from the starter code to fit our project's entities and attributes
// Date: 3/16/2024

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
            // We added an alert for failures to update into duplicate Round_Questions
            window.alert("You can't insert a duplicate Round_Question.")
            return
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from Rounds_Questions
addRowToTable = (data) => {

    // Get a reference to the current table on the page
    let currentTable = document.getElementById("rounds_questions-table")

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data)
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
        let questionIDHeader = document.createElement("TH")
        questionIDHeader.innerText = "questionText"
        let deleteButtonHeader = document.createElement("TH")

        // Add new header elements to table
        newHeaderRow.appendChild(roundIDHeader)
        newHeaderRow.appendChild(questionIDHeader)
        newHeaderRow.appendChild(deleteButtonHeader)

        newHeader.appendChild(newHeaderRow)
        currentTable.appendChild(newHeader)
    }

    // Create a row and cells
    let row = document.createElement("TR")
    row.setAttribute('row-round-id', newRow.roundID)
    row.setAttribute('row-question-text', newRow.questionText)

    let roundIDCell = document.createElement("TD")
    let questionTextCell = document.createElement("TD")
    let deleteCell = document.createElement("TD")

    // Fill the cells with correct data
    roundIDCell.innerText = newRow.roundID;
    questionTextCell.innerText = newRow.questionText;
    // We added our own additional cell with a delete button.
    deleteCell.innerHTML = `<button onclick="deleteRoundsQuestion(${newRow.roundID}, '${newRow.questionText}')">Delete</button>`

    // Add the cells to the row
    row.appendChild(roundIDCell)
    row.appendChild(questionTextCell)
    row.appendChild(deleteCell)

    // Add the row to the table
    currentTable.appendChild(row)

    // Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data#create-a-new-javascript-file,
    // second code block, starting from the comment "Start of new Step 8 code for adding new data to the dropdown menu for updating people"
    // Scope: Just the lines below
    // Originality: We added the for loop and conditionals to check that the option doesn't already exist in the dropdown;
    // the content on the inside of the conditionals is adapted from the starter code to fit our project's entities and attributes, and for two dropdowns
    // Date: 3/16/2024

    // Find dropdown menu, create a new option, fill data in the option,
    // then append option to dropdown menu so newly created rows via ajax will be found in it without needing a refresh
    let selectRoundMenu = document.getElementById("input-roundID");

    let roundAlreadyExists = false;
    for (let i = 0; i < selectRoundMenu.options.length; i++) {
        if (selectRoundMenu.options[i].value === newRow.roundID) {
            roundAlreadyExists = true;
            break;
        }
    }
    if (roundAlreadyExists === false) {
        let roundOption = document.createElement("option");
        roundOption.text = newRow.roundID + " | " + newRow.username + " | " + newRow.score + " | " + newRow.time;
        roundOption.value = newRow.roundID;
        selectRoundMenu.add(roundOption);
    }

    // Find dropdown menu, create a new option, fill data in the option,
    // then append option to dropdown menu so newly created rows via ajax will be found in it without needing a refresh
    let selectQuestionMenu = document.getElementById("input-questionID");
    let questionAlreadyExists = false;
    for (let i = 0; i < selectQuestionMenu.options.length; i++) {
        if (selectQuestionMenu.options[i].value == newRow.questionID) {
            questionAlreadyExists = true;
            break;
        }
    }
    if (questionAlreadyExists === false) {
        let questionOption = document.createElement("option");
        questionOption.text = newRow.questionText;
        questionOption.value = newRow.questionID;
        selectQuestionMenu.add(questionOption);
    }
}
