// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data#create-a-new-javascript-file
// Scope: Whole file unless otherwise noted
// Originality: Adapted from starter code, with our own names and entities
// Date: 3/16/2024

// Get the objects we need to modify
const updateRoundForm = document.getElementById('update-round-question')

// Modify the objects we need
updateRoundForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    const inputRoundID = document.getElementById("input-roundID")
    const inputQuestionText = document.getElementById("input-questionID")
    const newRoundID = document.getElementById("roundID-update")
    const newQuestionText = document.getElementById("questionID-update")

    // Get the values from the form fields
    // We added parseInt() calls for the IDs so that the request data would already be in number form
    const inputRoundIDValue = parseInt(inputRoundID.value)
    const inputQuestionIDValue = parseInt(inputQuestionText.value)
    // Get text of currently selected question from dropdown - https://stackoverflow.com/a/5947
    const inputQuestionTextValue = inputQuestionText.options[inputQuestionText.selectedIndex].text
    const newRoundIDValue = parseInt(newRoundID.value)
    const newQuestionIDValue = parseInt(newQuestionText.value)

    // abort if no valid number is chosen for any ID

    if (isNaN(inputRoundIDValue))
    {
        return
    }
    if (isNaN(inputQuestionIDValue))
    {
        return
    }
    if (isNaN(newRoundIDValue))
    {
        return
    }
    if (isNaN(newQuestionIDValue))
    {
        return
    }

    // Put our data we want to send in a javascript object
    const data = {
        inputRoundID: inputRoundIDValue,
        inputQuestionID: inputQuestionIDValue,
        newRoundID: newRoundIDValue,
        newQuestionID: newQuestionIDValue,
    }

    // Set up our AJAX request
    var xhttp = new XMLHttpRequest()
    xhttp.open("PUT", "/put-round-question", true)
    xhttp.setRequestHeader("Content-type", "application/json")

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, inputRoundIDValue, inputQuestionTextValue)
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
            // We added an alert for failures to insert duplicate Round_Questions
            window.alert("That Round_Question already exists!")
            return
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data))

})


function updateRow(data, inputRoundID, inputQuestionText){
    const parsedData = JSON.parse(data);

    const table = document.getElementById("rounds_questions-table")

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (
            row.getAttribute("row-round-id") == inputRoundID
            && row.getAttribute("row-question-text") == inputQuestionText
        ) {

            // Get the location of the row where we found the matching round ID and question text
            let updateRowIndex = table.getElementsByTagName("tr")[i]

            // Get td of round ID value
            let td = updateRowIndex.getElementsByTagName("td")[0]
            // Reassign round ID to our value we updated to
            td.innerHTML = parsedData[0]['roundID']
            td.setAttribute("row-round-id", parsedData[0]['roundID'])

            // Get td of question text value
            td = updateRowIndex.getElementsByTagName("td")[1]
            // Reassign question text to our value we updated to
            td.innerHTML = parsedData[0]['questionText']
            td.setAttribute("row-question-text", parsedData[0]['questionText'])
       }
    }
}
