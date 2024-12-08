// import mysql server to parse data from database
const mysql = require('mysql')

// connect to localhost mysql server
const sql = mysql.createConnection({
    host: 'localhost',
    user: 'phuong',
    password: 'phuong',
    database: 'BK_library'
});


sql.connect((err) => {
    if (err) throw err;
    console.log('Database mysql has been connected!');
});

module.exports = sql ;

/***************************************************************************/