// import express framework
const express = require('express')
// import body parser
const bodyParser = require('body-parser');
// import express session module 
const expressSession = require('express-session')
/***************************************************************************/


// my module write by phuong dep trai
// const login = require('./routes/login');
// const home = require('./routes/home');
// const account = require('./routes/account');
// const book = require('./routes/book');
const upload = require('./esp32_cam/upload')
// const manage = require('./routes/manage')
// const  rfid  = require('./pi-rfid/rfid_task')
const app = express();


// Set static css style
// Serve static files (CSS, images)
app.use(express.static('public'));


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
 

app.set('view engine', 'ejs');
app.use('/', upload)


app.listen(7000, (req, res) => {
    console.log("App is running on port 7000")
    // rfid.lcd("  Welcome user",2);
    // rfid.rfid_task()
})