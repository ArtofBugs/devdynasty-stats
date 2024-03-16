// Use the dotenv module to get secrets (e.g. db password) from a .env file
require('dotenv').config()
var mysql = require('mysql')

// Create pool of connections to the cs340_onid database
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_' + process.env.ONID,
    password        : process.env.DB_PASSWORD,
    database        : 'cs340_' + process.env.ONID
})

// Export the pool so other files can use it
module.exports.pool = pool;
