// All code here unless otherwise noted adapted from sample code found here:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data

// Get the objects we need to modify
let insertUserForm = document.getElementById('insert-user-form-ajax');

// Modify the objects we need
insertUserForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault()

    // Get form fields we need to get data from
    let inputUsername = document.getElementById("user-name-input")
    let inputPassword = document.getElementById("user-password-input")

    // Get the values from the form fields
    let usernameValue = inputUsername.value
    let passwordValue = inputPassword.value
    // Put our data we want to send in a javascript object
    let data = {
        username: usernameValue,
        password: passwordValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/insert-user-form-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        // console.log(xhttp.responseText);

        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputUsername.value = '';
            inputPassword.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from
// Users
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("users-table");

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    console.log(parsedData)

    let newRow = parsedData[parsedData.length - 1]

    console.log(newRow)

    // Create a row and cells
    let row = document.createElement("TR")
    row.setAttribute('row-id', newRow.userID)

    let userIDCell = document.createElement("TD")
    let usernameCell = document.createElement("TD")
    let passwordCell = document.createElement("TD")
    let deleteCell = document.createElement("TD")

    // Fill the cells with correct data
    userIDCell.innerText = newRow.userID
    usernameCell.innerText = newRow.username
    passwordCell.innerText = newRow.password
    deleteCell.innerHTML = `<button onclick="deleteUser(${newRow.userID})">Delete</button>`;

    // Add the cells to the row
    row.appendChild(userIDCell)
    row.appendChild(usernameCell)
    row.appendChild(passwordCell)
    row.appendChild(deleteCell)

    // Add the row to the table
    currentTable.appendChild(row)
}
