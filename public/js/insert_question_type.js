// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data#create-add_personjs---client-side-js
// Scope: Whole file unless otherwise noted
// Originality: Adapted from starter code, with our own names and entities
// Date: 3/16/2024

// Get the objects we need to modify
let insertQuestionTypeForm = document.getElementById('insert-question-type');

// Modify the objects we need
insertQuestionTypeForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("input-name");

    // Get the values from the form fields
    let typeNameValue = inputName.value;

    // Put our data we want to send in a javascript object
    let data = {
        name: typeNameValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/insert-question-type", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        console.log(xhttp.responseText);

        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputName.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
            // We added an alert for failures to insert duplicate Question_Types
            window.alert("You can't insert a duplicate Question_Type.")
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
    let currentTable = document.getElementById("question-types-table");

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    console.log(parsedData)

    let newRow = parsedData[parsedData.length - 1]

    console.log(newRow)

    // Create a row and 2 cells
    let row = document.createElement("TR");
    row.setAttribute('type-id', newRow.typeID)

    let typeIDCell = document.createElement("TD");
    let typeNameCell = document.createElement("TD");

    // Fill the cells with correct data
    typeIDCell.innerText = newRow.typeID;
    typeNameCell.innerText = newRow.typeName;

    // Add the cells to the row
    row.appendChild(typeIDCell);
    row.appendChild(typeNameCell);

    // Add the row to the table
    currentTable.appendChild(row);
}