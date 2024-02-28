// All code here adapted from sample code found here:
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

function deleteRow(roundID) {
    const table = document.getElementById("game-rounds-table")
    for (var i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("row-id") == roundID) {
            table.deleteRow(i);
            break;
        }
    }
}
