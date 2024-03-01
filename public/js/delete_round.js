// All code here unless otherwise noted adapted from sample code found here:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data#update-the-handlebars-template

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

function deleteDropdownItem(roundID) {
    const dropdown = document.getElementById("round-id-update-select");
    for (let i = 0; i < dropdown.length; i++) {
        if (Number(dropdown.options[i].value) === Number(roundID)) {
            dropdown[i].remove();
            break;
        }

    }
}

// This function is adapted from the starter code here:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data#see-below-for-code-to-dynamically-remove-people-from-the-drop-down-menu
function deleteRow(roundID) {
    const table = document.getElementById("game-rounds-table")
    for (var i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("row-id") == roundID) {
            table.deleteRow(i);
            deleteDropdownItem(roundID)
            break;
        }
    }
}
