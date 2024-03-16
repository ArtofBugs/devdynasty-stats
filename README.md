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
`app.js` and all files in `public/js` are adapted from the CS 340 Node starter
code at https://github.com/osu-cs340-ecampus/nodejs-starter-app/
unless otherwise noted. See code comments in each file for specific information.
