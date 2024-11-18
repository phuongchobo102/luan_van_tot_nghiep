const mysql = require('../../data_base/data_base')
const date = new Date();
const { renderPage } = require('./render_page');


function getHomePage(req,res){
    console.log('render home page now ~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    mysql.query('select * from Book' ,(err,row)=>{
        if(err){
          console.log('Error in query data')
          throw err
        }
        // store row
        // Lọc các row có giá trị user = 'test'
        const user_name = req.session.username
        const books = row.filter(row => row.issue == 0);
        const ban = req.session.ban;
        const time_unlock = req.session.date_ban;
        const  admin = req.session.admin;
        // console.log( req.session.date_ban);
        // res.render('home', {user_name,books,ban,time_unlock, admin });
        // console.log(admin)
        renderPage(res,'home',{user_name,books,ban,time_unlock, admin });
    })
    
    // res.redirect("/login");
}

function formatNumber(number) {
    return number.toString().padStart(2, '0');
}

function get_date(){
    // Lấy ngày
    const day = date.getDate();
    // formatNumber(day)
    // Lấy tháng
    const month = date.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0, nên cần cộng thêm 1
    // Lấy năm
    const year = date.getFullYear();
    return `${year}-${formatNumber(month)}-${formatNumber(day)}`;
}

function borrow(req,res){
    const { book_id, book_name } = req.body;
    // Lệnh SQL để update giá trị cột user cho id = 2
    const sql = "UPDATE Book SET borrow_user = ?, issue = ?, date_borrow = ?, times_borrow = times_borrow + 1  WHERE item_id = ?";
    const data = [req.session.username,1 ,get_date(), book_id]; // Dữ liệu truyền vào query

    // Xử lý việc mượn sách ở đây
    console.log(`Borrowing book: ${book_name} with ID: ${book_id} date = ${get_date()}`);

    mysql.query(sql,data,(err,row)=>{
        if(err){
            console.log('Error in query data')
            throw err
        }
        console.log('Done borrow book for '+ req.session.username);
        res.redirect("/home");
    })

}

function redirectHomePage(req,res){
    res.redirect("/home");
}

function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


function search(req,res){
    // Lấy dữ liệu từ ô tìm kiếm
    const searchQuery = req.body.query;
    mysql.query('select * from Book' ,(err,row)=>{
        if(err){
          console.log('Error in query data')
          throw err
        }
        // store row
        // Lọc các row có giá trị user = 'test'
        const user_name = req.session.username
        const books = row.filter(user => 
            removeAccents(user.book).toLowerCase().includes(removeAccents(searchQuery).toLowerCase()) ||
            removeAccents(user.author).toLowerCase().includes(removeAccents(searchQuery).toLowerCase())
        );
        const ban = req.session.ban;
        const time_unlock = req.session.date_ban;
        // const ban = req.session.ban;
        // const time_unlock = req.session.date_ban;
        const  admin = req.session.admin;
        console.log(books)
        res.render('book', {user_name,books,ban,time_unlock,admin});
    })
    // Xử lý hoặc sử dụng searchQuery để tìm kiếm sách
    console.log("Search query:", searchQuery);
}
// MediaSourceHandle.export getLoginPage;
module.exports = {
    getHomePage,
    borrow,
    redirectHomePage,
    search
}


