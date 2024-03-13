// All code in this file adapted from starter code here:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data#create-a-new-javascript-file

// Get the objects we need to modify
const updateRoundForm = document.getElementById('update-round-form')

// Modify the objects we need
updateRoundForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    const inputRoundID = document.getElementById("round-id-update-select")
    const inputQuestionText = document.getElementById("question-text-update-select")

    // Get the values from the form fields
    const roundIDValue = inputRoundID.value
    const questionTextValue = inputQuestionText.value

    // abort if no valid number is chosen for round ID

    if (isNaN(roundIDValue))
    {
        return
    }
    if (isNaN(questionTextValue))
    {
        return
    }

    // Put our data we want to send in a javascript object
    const data = {
        roundID: roundIDValue,
        questionText: questionTextValue
    }

    // Set up our AJAX request
    var xhttp = new XMLHttpRequest()
    xhttp.open("PUT", "/put-round-question", true)
    xhttp.setRequestHeader("Content-type", "application/json")

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, roundIDValue, questionText)
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data))

})


function updateRow(data, roundID, questionText){
    const parsedData = JSON.parse(data);

    const table = document.getElementById("rounds_questions-table")

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (
            table.rows[i].getAttribute("row-round-id") == roundID
            && table.rows[i].getAttribute("row-question-text") == questionText
        ) {

            // Get the location of the row where we found the matching round ID and question text
            let updateRowIndex = table.getElementsByTagName("tr")[i]

            // Get td of round ID value
            let td = updateRowIndex.getElementsByTagName("td")[1]
            // Reassign round ID to our value we updated to
            td.innerHTML = parsedData[0]['roundID']
            td.setAttribute("row-round-id", parsedData[0]['roundID'])

            // Get td of question text value
            td = updateRowIndex.getElementsByTagName("td")[2]
            // Reassign question text to our value we updated to
            td.innerHTML = parsedData[0]['questionText']
            td.setAttribute("row-question-text", parsedData[0]['questionText'])
       }
    }
}
