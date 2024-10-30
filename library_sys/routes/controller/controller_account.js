const mysql = require('../../data_base/data_base')


// function getCurrentDate() {
//     const today = new Date();
//     const year = today.getFullYear();
//     const month = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
//     const day = String(today.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
// }

function getAccountPage(req,res) {
    mysql.query('select * from Book' ,(err,row)=>{
        if(err){
          console.log('Error in query data')
          throw err
        }
        // store row
        // Lọc các row có giá trị user = 'test'
        const filteredRows = row.filter(row => row.borrow_user == req.session.username && row.issue == 1);

        const sampleData = {
            username : req.session.username,
            books : filteredRows
        }
        console.log(sampleData);
        res.render('account', sampleData);
    })
}

function returnBook(req,res) {
    const { item_id } = req.body;

    // Lệnh SQL để update giá trị cột user cho id = 2
    const sql = "UPDATE Book SET borrow_user = ?, issue = ? WHERE item_id = ?";
    const data = ['NULL', 0 , item_id]; // Dữ liệu truyền vào query

    // Xử lý việc mượn sách ở đây

    mysql.query(sql,data,(err,row)=>{
        if(err){
            console.log('Error in query data')
            throw err
        }
        console.log('Done borrow book for '+ req.session.username);
        res.redirect("/home/account");
    })
}


module.exports = {
    getAccountPage,
    returnBook
}