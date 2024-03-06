// All code here unless otherwise noted adapted from sample code found here:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data#update-the-handlebars-template

function deleteUser(userID) {
    const link = 'delete-user'
    const data = {
        id: userID
    }

    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
            deleteRow(userID)
        }
    })
}

// This function is adapted from the starter code here:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data#see-below-for-code-to-dynamically-remove-people-from-the-drop-down-menu
function deleteRow(userID) {
    const table = document.getElementById("users-table")
    for (var i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("row-id") == userID) {
            table.deleteRow(i);
            break;
        }
    }
    if (table.rows.length < 2) {
        noDataMsg = document.createElement("thead");
        noDataMsg.innerHTML = `<tr><th>No data to display</th></tr>`
        table.removeChild(document.getElementsByTagName("thead")[0])
        table.removeChild(document.getElementsByTagName("tbody")[0])
        table.appendChild(noDataMsg)
    }
}
