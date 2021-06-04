const config = require("../config.json");
var mysql = require('mysql2');

var pool  = mysql.createPool({
    connectionLimit : config.database.connectionLimit,
    host            : config.database.host,
    user            : config.database.username,
    password        : config.database.password,
    database		: config.database.database
});

module.exports = pool;