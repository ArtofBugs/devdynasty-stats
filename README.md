# DevDynasty Stats

## Development Setup
1. Clone the repo
2. Run `npm install` to install needed node modules
3. Create a file called `.env` in the root of the repo
4. Paste these contents into the file and replace with your credentials and
   desired port number:
```
DB_PASSWORD='1234'
ONID='bennybeav'
PORT=12345
```
5. To start the site up, run `npm run dev`.

## Running the Site (Forever)
1. Get on the server you want to run on and do steps 1-4 for dev
2. To start the site up and leave it running forever, run `npm start`

## Citations
Most JS code is adapted from or based on the Node starter code for this class:

// https://github.com/osu-cs340-ecampus/nodejs-starter-app/


### `app.js`:

Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/app.js

Scope: Whole file

Originality: Structure of routes based on starter code; SQL queries are our own.

Date: 3/16/2024


### `insert` files in `public/js`:

Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data#create-add_personjs---client-side-js

Scope: Whole file unless otherwise noted; see code comments in each file for specific information

Originality: Adapted from starter code, with our own names and entities

Date: 3/16/2024

--

Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data#create-a-new-javascript-file,
second code block, starting from the comment "Start of new Step 8 code for adding new data to the dropdown menu for updating people"

Scope: The last few lines in `insert_game_round.js` for adding a new option to the round ID dropdown menu

Originality: Adapted from starter code, with our own names and entities

Date: 3/16/2024


### `update` files in `public/js`:
Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data#create-a-new-javascript-file

Scope: Whole file unless otherwise noted; see code comments in each file for specific information

Originality: Adapted from starter code, with our own names and entities

Date: 3/16/2024

--

Source: https://stackoverflow.com/a/5947

Scope: Single line for getting text of currently selected question from Rounds_Questions update dropdown

Originality: Adapted, with our own dropdown menu and variable names

Date: 3/16/2024


### `delete` files in `public/js`:
Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data#part-a-using-jquery-to-send-a-delete-request

Scope: `deleteEntity()` function for each file's entity

Originality: Adapted from starter code, with our own names and entities

Date: 3/16/2024

--

Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data#part-a-using-jquery-to-send-a-delete-request

Scope: The line to find the table and the for loop to find the row to delete, in the `deleteRow()` function for each file

Originality: Adapted from starter code, with our own names and entities

Date: 3/16/2024

--

Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data#see-below-for-code-to-dynamically-remove-people-from-the-drop-down-menu

Scope: `deleteDropdownItem()` function in `delete_round.js`

Originality: Adapted from starter code, with our own names and entities

Date: 3/16/2024


// TODO: add citations for handlebars stuff if necessary
// Handlebars templates are mostly our own work, though the structure of element ids and scripts is possibly based on the starter code as well?
