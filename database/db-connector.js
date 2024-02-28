require('dotenv').config()
var mysql = require('mysql')

var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_' + process.env.ONID,
    password        : process.env.DB_PASSWORD,
    database        : 'cs340_' + process.env.ONID
})

module.exports.pool = pool;
