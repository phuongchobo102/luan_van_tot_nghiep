const express = require('express');
const login = require('./controller/controller_login')


const login_router = express.Router();

function checkLogin(req, res, next){
    // return next();
    console.log(`checking path ${req.path} ${req.method}`)
    if ((req.method == 'GET' && req.path == "/") || (req.method == 'GET' && req.path == "/home") || (req.method == 'POST' && req.path == "/upload")){
        console.log("pass check login 1")
        return next();
    }
    console.log(`checkLogin session  user = ${req.session.username}`)

    if(req.path != "/" && req.path != "/login" && req.path != "/register"){
        // user want to acess route diff with root and login
        // check check check
        
        if ( req.session.username ) {
            console.log('pass check login 2')
            return next(); // Nếu đã đăng nhập, tiếp tục đến route tiếp theo
        } else {
            console.log('not pass -> redirect to /login')
            return res.redirect('/login'); // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
        }
    }
    // else{
        // safe route
        // pass user for all case
    return next();
    // }
}
// login_router.get('/', login.getLoginPage);

login_router.post("/login", login.authenUser);

login_router.get('/login', login.redirect_loginpage);

login_router.get('/register', login.redirect_registerPage);

login_router.post("/register", login.registerAccount);

module.exports = {
    login_router,
    checkLogin
}