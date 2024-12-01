const {mysql , topics} = require('../../data_base/data_base')
const {calculateDaysSince,formatDate } = require('./render_page');

const NOT_BAN = 1;
const BAN = 2;
const TIME_LOCK_BAN = 30;

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
    // store row
    rows = row ;
    // console.log(rows)
});

function authenUser(req,res){
    // console.log(rows)
    // console.log(`authenUser user= ${req.body.user} password = ${req.body.password}`)

    var user_pass = false;
    var idx =0;
    // req.session.destroy((err) => {
    //     if (err) {
    //         console.error("Lỗi khi xóa session:", err);
    //         return res.status(500).send("Có lỗi xảy ra khi xóa session.");
    //     }
    //     // Xóa session thành công, chuyển hướng về trang đăng nhập hoặc trang chủ
    //     // res.redirect('/login');
    // });
    mysql.query('select * from authen_user',(err,row)=>{
        if(err){
          console.log('Error in query data')
          throw err
        }
        // store row
        rows = row ;
        // console.log(rows)
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
            req.session.user_data = rows[idx]
            // console.log(rows[idx])
            req.session.loggedin = true;
            req.session.username = rows[idx].user_name;
            req.session.ban = NOT_BAN;
            if(req.session.username == 'admin'){
                req.session.admin = 1;
            }
            else 
                req.session.admin = 0;
            var max = 0;
            // scan Book table to find book borrow by user
            mysql.query('select * from Book' ,(err,books)=>{
                if(err){
                  console.log('Error in query data')
                  throw err
                }
                books.forEach((book,index) => {
                    // tim sach muon chua tra bi qua han
                    if((book.borrow_user == req.session.username)){
                        // user have been borrow book
                        const date_borrow =  book.date_borrow;
                        const formattedDate = formatDate(date_borrow);
                        const time_diff = calculateDaysSince(formattedDate);
                        // console.log(time_diff)
                        if(time_diff > max) {
                            max = time_diff;
                            // console.log(max)
                        }
                    }
                });
                // console.log(max)
                // done find max day borrow
                if (max >= req.session.user_data.max_loan){
                    // console.log("muon khong tra => ban user")
                    // muon sach ko tra bi qua han
                    // direct ban
                    req.session.ban = BAN;
                    req.session.date_ban = 30;
                    return res.redirect("/home");
                }
                // check data authen_user table
                if(rows[idx].ban == BAN){
                    const date_ban =  rows[idx].date_ban;
                    // console.log(date_ban)
                    const formattedDate = formatDate(date_ban);
                    // console.log(formattedDate)
                    const time_diff = calculateDaysSince(formattedDate);
                    // console.log(time_diff);
                    if(time_diff >= TIME_LOCK_BAN){
                        // unlock ban user
                        const sql = "UPDATE authen_user SET ban = ? WHERE user_name = ?";
                        const data = [ 1 , req.session.username]; // Dữ liệu truyền vào query
                        req.session.ban = NOT_BAN;// unlock session
                        mysql.query(sql,data,(err,row)=>{
                            if(err){
                                console.log('Error in query data')
                                throw err
                            }
                            console.log("unban user")
                            console.log('Done UPDATE authen_user unlock for '+ req.session.username);
                            // not ban 
                            req.session.ban = NOT_BAN;
                            return res.redirect("/home");
                        });
                    }
                    else{
                        console.log("ontime ban user")
                        // ban
                        // not ban 
                        req.session.ban = BAN;
                        req.session.date_ban = TIME_LOCK_BAN - time_diff;
                        // console.log(time_diff)
                        // console.log(30 - time_diff)
                        return res.redirect("/home");
                    }
                }
                else{
                    console.log("check data user not ban")
                    // not ban 
                    req.session.ban = NOT_BAN;
                    // req.session.date_ban = 30;
                    return res.redirect("/home");
                }
            })
        }
        else{
            // false case 
            console.log("Invalid user name or password !!!")
            console.log(`authenUser user= ${req.body.user} password = ${req.body.password}`)
            res.render("login", {loginMessage : "Wrong account, please retry again !"});
        }
    })
    
    
}

function redirect_loginpage(req,res){
    res.render("login", {loginMessage : ""});
}

// login_router.get('/login', login.redirect_registerPage);

// login_router.post("/login", login.registerAccount);

function redirect_registerPage(req,res){
    res.render("register", {loginMessage : "Please fill in your new account."});
}

function registerAccount(req,res){
    // Kiểm tra xem username và password có được cung cấp không
    if (!req.body.password || !req.body.user) {
        return res.render("register", {loginMessage : "Please fill your user name and password"});
    }
    console.log(`Register request `);
    console.log(req.body)

    var max_loan = 0;
    switch (req.body.role) {
        case "học viên":
            max_loan = 7
            break;
        case "sinh viên":
            max_loan = 14
            break;
        case "giảng viên":
            max_loan = 30
            break;
        case "tiến sĩ":
            max_loan = 60
            break;
        case "giáo sư":
            max_loan = 90
            break;
        default:
            console.log("Unknown status code");
    }

    mysql.query('select * from authen_user' ,(err,user_list)=>{
        var duplicate_name = false
        var duplicate_id = false
        user_list.forEach((user, index) => {
            // console.log(`user name ${user} and ${req.body.user} `);
            if (user.user_name == req.body.user){
                // console.log("user name exist in data base !")
                duplicate_name = true
                // return res.render("register", {loginMessage : "Your username has been used"});           
            }
            if (user.id_code == req.body.id){
                // console.log("user name exist in data base !")
                duplicate_id = true
                // return res.render("register", {loginMessage : "Your username has been used"});           
            }
        });
        if(duplicate_name == true){
            console.log("user name exist in data base !")
            return res.render("register", {set_alert : "Your username has been used, please user another user name!"});           
        }
        else if(duplicate_id == true){
            console.log("id register duplicate !!!")
            return res.render("register", {set_alert : "Your id code has been use for this library system service!"});
        }
        else{
            // Truy vấn SQL để thêm người dùng mới vào bảng authen_user
            const query = 'INSERT INTO authen_user (user_name, password , permission , id_code, full_name, ban , max_loan) VALUES (?, ?, ?, ? , ? ,1, ?)';

            mysql.query(query, [req.body.user, req.body.password, req.body.role, req.body.id, req.body.full_name, max_loan], (error, results) => {
                if (error) {
                    console.error('Error inserting user: ', error);
                    return { success: false, message: 'Error while registering user.' };
                }
                return res.render("register", {set_alert : "Register account sucessfully!!!"});  
                // return res.redirect("/home");
                // return { success: true, message: 'User registered successfully.', userId: results.insertId };
            });
        }
    });
}
// MediaSourceHandle.export getLoginPage;
module.exports = {
    getLoginPage,
    authenUser,
    redirect_loginpage,
    redirect_registerPage,
    registerAccount
}


