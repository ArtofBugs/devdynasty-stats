// Sends a request to delete a Round from the database.

// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data#part-a-using-jquery-to-send-a-delete-request
// Scope: Function
// Originality: Adapted from the starter code to fit our project's entities and attributes
// Date: 3/16/2024
function deleteRound(roundID) {
    const link = 'delete-round'
    const data = {
        id: roundID
    }

    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
            deleteRow(roundID)
        }
    })
}

// After a row is deleted, this function removes the corresponding entry from
// the Rounds dropdown in the update form.
// (Without this, a user would need to reload the page to see the changes.)

// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data#see-below-for-code-to-dynamically-remove-people-from-the-drop-down-menu
// Scope: Function
// Originality: Adapted from the starter code to fit our project's entities and attributes
// Date: 3/16/2024
function deleteDropdownItem(roundID) {
    const dropdown = document.getElementById("round-id-update-select");
    for (let i = 0; i < dropdown.length; i++) {
        if (Number(dropdown.options[i].value) === Number(roundID)) {
            dropdown[i].remove();
            break;
        }

    }
}

// After a row is deleted, this function removes the corresponding entry from the Browse UI.
// (Without this, a user would need to reload the page to see the changes.)
function deleteRow(roundID) {
    // Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data#part-a-using-jquery-to-send-a-delete-request
    // Scope: Just these few lines below, until the next comment
    // Originality: Adapted from the starter code to fit our project's entities and attributes
    // Date: 3/16/2024
    const table = document.getElementById("game-rounds-table")
    for (var i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("row-id") == roundID) {
            table.deleteRow(i);
            deleteDropdownItem(roundID)
            break;
        }
    }
    // This code is our own; it checks if we just deleted the last row in the table. If so, show a table with
    // just a message saying there is no data, instead of a bunch of table headers with no data under them.
    if (table.rows.length == 1) {
        noDataMsg = document.createElement("thead");
        noDataMsg.innerHTML = `<tr><th>No data to display</th></tr>`
        table.removeTHead()
        table.appendChild(noDataMsg)
    }
}
