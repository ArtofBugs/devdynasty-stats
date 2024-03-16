// Sends a request to delete a Question from the database.

// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data#part-a-using-jquery-to-send-a-delete-request
// Scope: Function
// Originality: Adapted from starter code, with our own names and entities
// Date: 3/16/2024
function deleteQuestion(questionID) {
    const link = '/delete-question/'
    const data = {
        id: questionID
    }

    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
            deleteRow(questionID)
        }
    })
}
// After a row is deleted, this function removes the corresponding entry from the Browse UI.
// (Without this, a user would need to reload the page to see the changes.)
function deleteRow(questionID) {
    // Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data#part-a-using-jquery-to-send-a-delete-request
    // Scope: Just these few lines below, until the next comment
    // Originality: Adapted from starter code, with our own names and entities
    // Date: 3/16/2024
    const table = document.getElementById("questions-table")
    for (var i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("row-id") == questionID) {
            table.deleteRow(i);
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
