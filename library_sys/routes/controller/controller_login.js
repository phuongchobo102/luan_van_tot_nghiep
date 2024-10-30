const mysql = require('../../data_base/data_base')

const user = "admin";
const password = "admin";

function getLoginPage(req,res){
    // res.render("login", {var1 : "phuong"});
    res.redirect("/login");
}

var rows ;
mysql.query('select * from authen_user',(err,row)=>{
    if(err){
      console.log('Error in query data')
      throw err
    }
    console.log("Data receive from data base is :\n")
    // console.log(row[0])
    row.forEach((user,index)=>{
        console.log(user)
    })
    // store row
    rows = row ;
    // console.log(rows)
})

function authenUser(req,res){
    // console.log(rows)
    // console.log(`authenUser user= ${req.body.user} password = ${req.body.password}`)

    var user_pass = false;
    var idx =0;

    rows.forEach((user,index)=> {
        // console.log(`authenUser user= ${user.user_name} password = ${user.password}`)
        if(user.user_name == req.body.user && user.password == req.body.password)
        {
            // authen sucess... -> set authen check variable
            user_pass = true;
            idx = index;
        }
    });
    // user_pass = true;
    if(user_pass == true){
        req.session.loggedin = true;
        req.session.username = rows[idx].user_name;
        console.log(`authenUser checking pass account ${rows[idx]}`);
        return res.redirect("/home");
    }
    else{
        // false case 
        console.log("Invalid user name or password !!!")
        console.log(`authenUser user= ${user.user_name} password = ${user.password}`)
        return res.status(401).send('Invalid credentials')
    }
    // if(req.body.user == user && req.body.password == password){
    //     // save user name to user session
    //     // Authenticate the user
    //     req.session.loggedin = true;
    //     req.session.username = user;
    //     // pass authen
    //     console.log(`authenUser user.session.user = ${req.session.username}`)
    //     return res.redirect("/home");
    // }
    // else{
    //     // false authen case
    //     console.log("Invalid user name or password !!!")
    //     return res.status(401).send('Invalid credentials');
    // }
}

function redirect_loginpage(req,res){
    res.render("login", {var1 : "phuong"});
}

// MediaSourceHandle.export getLoginPage;
module.exports = {
    getLoginPage,
    authenUser,
    redirect_loginpage
}


