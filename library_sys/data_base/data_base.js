// import mysql server to parse data from database
const sql = require('mysql');
const { NULL } = require('mysql/lib/protocol/constants/types');

// connect to localhost mysql server
const mysql = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'phuongtt1',
    database: 'BK_library'
});


mysql.connect((err) => {
    if (err) throw err;
    console.log('Database mysql has been connected!');
});


module.exports = {
    mysql,
    // topics,
};

/***************************************************************************/