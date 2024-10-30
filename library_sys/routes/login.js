const express = require('express');
const login = require('./controller/controller_login')


const login_router = express.Router();

function checkLogin(req, res, next){
    // return next();
    // console.log(`checking path ${req.path}`)
    console.log(`checkLogin session  user = ${req.session.username}`)
    if(req.path != "/" && req.path != "/login" ){
        // user want to acess route diff with root and login
        // check check check
        
        if ( req.session.username ) {
            console.log('pass check login')
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


module.exports = {
    login_router,
    checkLogin
}