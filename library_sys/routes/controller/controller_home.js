const mysql = require('../../data_base/data_base')
// Sample data (fake data for demonstration)
// const books = [
//     { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', image: '/images/gatsby.jpg' },
//     { id: 2, title: '1984', author: 'George Orwell', image: '/images/1984.jpg' },
//     { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', image: '/images/mockingbird.jpg' },
//   ];

function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// var books ;
// mysql.query('select * from Book',(err,row)=>{
//     if(err){
//       console.log('Error in query data')
//       throw err
//     }
//     // store row
//     books = row ;
//     console.log(books);
// })

  
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
        res.render('home', {user_name,books});
    })
    
    // res.redirect("/login");
}

function borrow(req,res){
    // res.render("login", {var1 : "phuong"});
    const { book_id, book_name } = req.body;
    // Lệnh SQL để update giá trị cột user cho id = 2
    const sql = "UPDATE Book SET borrow_user = ?, issue = ? WHERE item_id = ?";
    const data = [req.session.username,1 , book_id]; // Dữ liệu truyền vào query

   
    // Xử lý việc mượn sách ở đây
    console.log(`Borrowing book: ${book_name} with ID: ${book_id}`);

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
        const books  = row.filter(user => user.book.includes(searchQuery) || user.author.includes(searchQuery));
        res.render('home', {books } );
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


