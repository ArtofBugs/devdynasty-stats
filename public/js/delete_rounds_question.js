// All code here unless otherwise noted adapted from sample code found here:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data#update-the-handlebars-template

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


// This function is adapted from the starter code here:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data#see-below-for-code-to-dynamically-remove-people-from-the-drop-down-menu
function deleteRow(roundID, questionText) {
    const table = document.getElementById("rounds_questions-table")
    for (var i = 0, row; row = table.rows[i]; i++) {
        if (
            table.rows[i].getAttribute("row-round-id") == roundID
            && table.rows[i].getAttribute("row-question-text") == questionText
        ) {
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
