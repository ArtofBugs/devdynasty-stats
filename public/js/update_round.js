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
    const inputRoundUsername = document.getElementById("round-username-select")
    const inputRoundScore = document.getElementById("round-score-input")
    let inputRoundHours = document.getElementById("round-input-hours")
    let inputRoundMins = document.getElementById("round-input-mins")
    let inputRoundSec = document.getElementById("round-input-sec")

    // Get the values from the form fields
    const roundIDValue = inputRoundID.value
    var roundUsernameValue = inputRoundUsername.value
    let roundScoreValue = parseInt(inputRoundScore.value)
    var roundTimeValue = inputRoundHours.value + ":" + inputRoundMins.value + ":" + inputRoundSec.value

    // abort if no valid number is chosen for round ID

    if (isNaN(roundIDValue))
    {
        return
    }

    if (roundUsernameValue == "None") {
        roundUsernameValue = null
    }
    if (isNaN(roundScoreValue)) {
        roundScoreValue = null
    }
    if (!inputRoundHours.value && !inputRoundMins.value && !inputRoundSec.value) {
        roundTimeValue = null
    }

    // Put our data we want to send in a javascript object
    const data = {
        id: roundIDValue,
        username: roundUsernameValue,
        score: roundScoreValue,
        time: roundTimeValue
    }

    // Set up our AJAX request
    var xhttp = new XMLHttpRequest()
    xhttp.open("PUT", "/put-round", true)
    xhttp.setRequestHeader("Content-type", "application/json")

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, roundIDValue)

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data))

})


function updateRow(data, roundID){
    const parsedData = JSON.parse(data);

    const table = document.getElementById("game-rounds-table")

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("row-id") == roundID) {

            // Get the location of the row where we found the matching round ID
            let updateRowIndex = table.getElementsByTagName("tr")[i]

            // Get td of username value
            let td = updateRowIndex.getElementsByTagName("td")[1]
            // Reassign username to our value we updated to
            td.innerHTML = parsedData[0]['username'] ? parsedData[0]['username'] : "NULL"

            // Get td of score value
            td = updateRowIndex.getElementsByTagName("td")[2]
            // Reassign score to our value we updated to
            td.innerHTML = (parsedData[0]['score'] === null) ? "NULL" : parsedData[0]['score']

            // Get td of time value
            td = updateRowIndex.getElementsByTagName("td")[3]
            // Reassign time to our value we updated to
            td.innerHTML = parsedData[0]['time'] ? parsedData[0]['time'] : "NULL"
       }
    }
}
