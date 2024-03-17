// Sends a request to delete a Rounds_Question from the database.

// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data#part-a-using-jquery-to-send-a-delete-request
// Scope: Function
// Originality: Adapted from starter code, with our own names and entities
// Date: 3/16/2024
function deleteRoundsQuestion(roundID, questionText) {
    const link = 'delete-rounds-question'
    const data = {
        roundID: roundID,
        questionText: questionText
    }

    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
            deleteRow(roundID, questionText)
        }
    })
}

// After a row is deleted, this function removes the corresponding entry from
// the Rounds and questionText dropdowns in the update form.
// (Without this, a user would need to reload the page to see the changes.)

// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data#see-below-for-code-to-dynamically-remove-people-from-the-drop-down-menu
// Scope: Function
// Originality: Adapted from starter code, with our own names and entities and a second for loop for the second dropdown
// Date: 3/16/2024
function deleteDropdownItem(roundID, questionText) {
    const roundDropdown = document.getElementById("input-roundID");
    for (let i = 0; i < roundDropdown.length; i++) {
        if (Number(roundDropdown.options[i].value) === Number(roundID)) {
            roundDropdown[i].remove();
            break;
        }

    }
    const questionTextDropdown = document.getElementById("input-questionID");
    for (let i = 0; i < questionTextDropdown.length; i++) {
        console.log(questionTextDropdown.options[i].innerHTML)
        console.log(questionText)
        if (questionTextDropdown.options[i].innerHTML === questionText) {
            questionTextDropdown[i].remove();
            break;
        }

    }
}

// After a row is deleted, this function removes the corresponding entry from the Browse UI.
// (Without this, a user would need to reload the page to see the changes.)
function deleteRow(roundID, questionText) {
    // Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data#part-a-using-jquery-to-send-a-delete-request
    // Scope: Just these few lines below, until the next comment
    // Originality: Adapted from starter code, with our own names and entities
    // Date: 3/16/2024
    const table = document.getElementById("rounds_questions-table")
    for (var i = 0, row; row = table.rows[i]; i++) {
        if (
            table.rows[i].getAttribute("row-round-id") == roundID
            && table.rows[i].getAttribute("row-question-text") == questionText
        ) {
            table.deleteRow(i);
            deleteDropdownItem(roundID, questionText);
            break;
        }
    }
    // This code is our own; it checks if we just deleted the last row in the table. If so, show a table with
    // just a message saying there is no data, instead of a bunch of table headers with no data under them.
    if (table.rows.length < 2) {
        noDataMsg = document.createElement("thead");
        noDataMsg.innerHTML = `<tr><th>No data to display</th></tr>`
        table.removeChild(document.getElementsByTagName("thead")[0])
        table.removeChild(document.getElementsByTagName("tbody")[0])
        table.appendChild(noDataMsg)
    }
}
