const {mysql , topics} = require('../../data_base/data_base')

function getmanagePage(req,res){
    const user_name = req.session.username
    const  admin = req.session.admin;
    const action = "no";
    // console.log( req.session.date_ban);
    res.render('manage', {user_name, admin, action });
}


function manageProcess(req,res){
    
}

function addBookProcess(req,res){
    // console.log("Admin add book request : ");
    console.log(req.body)
    // Truy vấn SQL để thêm người dùng mới vào bảng Book
    // insert into Book (item_id, book, create_on_date) values (1, 'harry porter', '2024-10-12');
    const query = 'INSERT INTO Book (book, create_on_date, author, topic) VALUES (?, ? , ?, ?)';
    const publicationDate = new Date(req.body.publicationDate);
    mysql.query(query, [req.body.title, publicationDate, req.body.author, req.body.topic], (error, results) => {
        if (error) {
            console.error('Error inserting Book: ', error);
            return { success: false, message: 'Error while registering user.' };
        }
        console.log("Done add book by admin");
        const user_name = req.session.username
        const  admin = req.session.admin;
        const action = "add";
        const add_sucess = true;
        // console.log( req.session.date_ban);
        res.render('manage', {user_name, admin, action,add_sucess });
    });
}

function addBookPage(req,res){
    const user_name = req.session.username
    const  admin = req.session.admin;
    const action = "add";
    // console.log( req.session.date_ban);
    res.render('manage', {user_name, admin, action });
}

function deleteBookPage(req,res,alert){
    const user_name = req.session.username
    const  admin = req.session.admin;
    const action = "delete";
    mysql.query('select * from Book' ,(err,row)=>{
        if(err){
          console.log('Error in query data')
          throw err
        }
        const books = row;
        // console.log( req.session.date_ban);
        if(alert == true){
            const alertt=true;
            console.log("set alert")
            res.render('manage', {user_name,admin, books, action,alertt });
        }
        else{
            console.log("not set alert")
            res.render('manage', {user_name,admin, books,action });
        }
    })
    // console.log( req.session.date_ban);
    // res.render('manage', {user_name, admin, action });
}
function thongKePage(req,res){
    const user_name = req.session.username
    const  admin = req.session.admin;
    const action = "thong-ke";
    // console.log( req.session.date_ban);
    mysql.query('select * from Book' ,(err,row)=>{
        if(err){
          console.log('Error in query data')
          throw err
        }
        const books = row;
        res.render('manage', {user_name,admin, books,action });
    })
}
function manageUserPage(req,res){
    const user_name = req.session.username
    const  admin = req.session.admin;
    const action = "manage-user";
    // console.log( req.session.date_ban);
    mysql.query('select * from authen_user' ,(err,user_list)=>{
        if(err){
          console.log('Error in query data')
          throw err
        }
        // const books = row;
        res.render('manage', {user_name, admin, action ,user_list});
    })
    // res.render('manage', {user_name, admin, action });
}

function deleteBookProcess(req,res){
    console.log(req.body)
    // Truy vấn SQL để thêm người dùng mới vào bảng Book
    const query = 'DELETE FROM Book WHERE book = ?;';
    mysql.query(query, [req.body.book], (error, results) => {
        if (error) {
            console.error('Error inserting Book: ', error);
            return { success: false, message: 'Error while registering user.' };
        }
        console.log("Done delete book by admin");
        // const user_name = req.session.username
        // const  admin = req.session.admin;
        // const action = "delete";
        // res.render('manage', {user_name, admin, action});
        deleteBookPage(req,res,true);
    });
}

function thongKeProcess(req,res){

}

function manageUserProcess(req,res){

}

module.exports = {
    getmanagePage,
    manageProcess,
    addBookProcess,
    deleteBookPage,
    thongKePage,
    manageUserPage,
    addBookPage,
    deleteBookProcess,
    thongKeProcess,
    manageUserProcess
}
