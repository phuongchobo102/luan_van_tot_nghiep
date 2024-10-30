// import express framework
const express = require('express')
// import body parser
const bodyParser = require('body-parser');
// import express session module 
const expressSession = require('express-session')

/***************************************************************************/


// my module write by phuong dep trai
const login = require('./routes/login');
const home = require('./routes/home');
const account = require('./routes/account');
// import sql for database handle
const mysql = require('./data_base/data_base')
const app = express();


// Set static css style
// Serve static files (CSS, images)
app.use(express.static('public'));
// Middleware cho xử lý dữ liệu form
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({
    secret: 'asfsdgasdrgdsfg',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Use HTTPS
        httpOnly: true, // Prevent XSS attacks
        sameSite: 'strict', // Prevent CSRF attacks
        maxAge: 24 * 60 * 60 * 1000 // Set session expiration (e.g., 24 hours)
    }
}));
 
// Sử dụng EJS làm template engine
app.set('view engine', 'ejs');

// check that user is login before go every route ?
app.get('*',login.checkLogin);

// add route to login page
app.use('/', login.login_router);
// add route to home page;
app.use('/', home)
// add route to account page;
app.use('/', account)


app.listen(7000, (req, res) => {
    console.log("App is running on port 7000")
})