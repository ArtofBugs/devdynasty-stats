// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data#create-a-new-javascript-file
// Scope: Whole file unless otherwise noted
// Originality: Adapted from the starter code to fit our project's entities and attributes
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

    // Get text of currently selected question from dropdown
    // Source: https://stackoverflow.com/a/5947
    // Scope: Single line
    // Originality: Adapted, with our own dropdown menu and variable names
    // Date: 3/16/2024
    const inputQuestionTextValue = inputQuestionText.options[inputQuestionText.selectedIndex].text

    const newRoundIDValue = parseInt(newRoundID.value)
    const newQuestionIDValue = parseInt(newQuestionText.value)

    // abort if no valid number is chosen for any one ID

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
    // We added an alert for when a user picks a pair of roundID and questionText where they individually exist
    // in Rounds_Questions but there is no row that has both of them
    if (parsedData.length === 0) {
        window.alert("That Rounds_Question doesn't exist!")
        return
    }
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

    // All lines below until the end of the function are original

    // Find rounds dropdown menu, create a new option, fill data in the option,
    // then append option to dropdown menu
    let selectRoundMenu = document.getElementById("input-roundID");

    // Remove the option for the old roundID
    for (let i = 0; i < selectRoundMenu.length; i++) {
        if (selectRoundMenu.options[i].value == inputRoundID) {
            selectRoundMenu.remove(i)
        }
    }
    // Check if an option already exists for the new roundID
    let roundAlreadyExists = false;
    for (let i = 0; i < selectRoundMenu.length; i++) {
        if (selectRoundMenu.options[i].value === parsedData[0]['roundID']) {
            roundAlreadyExists = true;
            break;
        }
    }
    // Add an option for the roundID if it's new
    if (roundAlreadyExists === false) {
        let roundOption = document.createElement("option");
        roundOption.text = parsedData[0]['roundID'] + " | " + parsedData[0]['username'] + " | " + parsedData[0]['score'] + " | " + parsedData[0]['time'];
        roundOption.value = parsedData[0]['roundID'];
        selectRoundMenu.add(roundOption);
    }

    // Find questionText dropdown menu, create a new option, fill data in the option,
    // then append option to dropdown menu
    let selectQuestionMenu = document.getElementById("input-questionID");
    let questionAlreadyExists = false;

    // Remove the option for the old questionID
    for (let i = 0; i < selectQuestionMenu.length; i++) {
        if (selectQuestionMenu.options[i].innerHTML === inputQuestionText) {
            selectQuestionMenu[i].remove()
        }
    }
    // Check if an option already exists for the new questionText
    for (let i = 0; i < selectQuestionMenu.length; i++) {
        if (selectQuestionMenu.options[i].value === parsedData[0]['questionID']) {
            questionAlreadyExists = true;
            break;
        }
    }
    // Add an option for the questionText if it's new
    if (questionAlreadyExists === false) {
        let questionOption = document.createElement("option");
        questionOption.text = parsedData[0]['questionText'];
        questionOption.value = parsedData[0]['questionID'];
        selectQuestionMenu.add(questionOption);
    }
}
