// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data#create-add_personjs---client-side-js
// Scope: Whole file except where otherwise noted
// Originality: Adapted from the starter code to fit our project's entities and attributes
// Date: 3/16/2024

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
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
            // We added an alert for failures to insert duplicate Questions
            window.alert("You can't insert a duplicate Question.")
            return
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from Questions
addRowToTable = (data) => {

    // Get a reference to the current table on the page
    let currentTable = document.getElementById("questions-table");

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
        let questionIDHeader = document.createElement("TH")
        questionIDHeader.innerText = "questionID"
        let questionTextHeader = document.createElement("TH")
        questionTextHeader.innerText = "questionText"
        let typeNameHeader = document.createElement("TH")
        typeNameHeader.innerText = "typeName"
        let deleteButtonHeader = document.createElement("TH")

        // Add new header elements to table
        newHeaderRow.appendChild(questionIDHeader)
        newHeaderRow.appendChild(questionTextHeader)
        newHeaderRow.appendChild(typeNameHeader)
        newHeaderRow.appendChild(deleteButtonHeader)

        newHeader.appendChild(newHeaderRow)
        currentTable.appendChild(newHeader)
    }

    // Create a row and cells
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
    // We added our own additional cell with a delete button.
    deleteCell.innerHTML = `<button onclick="deleteQuestion(${newRow.questionID})">Delete</button>`;

    // Add the cells to the row
    row.appendChild(questionIDCell);
    row.appendChild(questionTextCell);
    row.appendChild(typeNameCell);
    row.appendChild(deleteCell);

    // Add the row to the table
    currentTable.appendChild(row);
}
