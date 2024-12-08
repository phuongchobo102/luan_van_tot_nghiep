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
            books : filteredRows,
            admin : req.session.admin
        }
        console.log(sampleData);
        res.render('account', sampleData);
    })
}

function calculateDaysSince(dateString) {
    // Chuyển đổi chuỗi ngày từ định dạng YYYY-MM-DD sang đối tượng Date
    const startDate = new Date(dateString + 'T00:00:00'); // Đảm bảo giờ là 00:00:00
    const currentDate = new Date(); // Ngày hiện tại

    // Đặt giờ của currentDate về 00:00:00 để chỉ so sánh ngày
    currentDate.setHours(0, 0, 0, 0);

    // Tính số ngày giữa hai ngày
    const timeDifference = currentDate - startDate; // Đơn vị là milliseconds
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Chuyển đổi milliseconds sang days

    return daysDifference; // Trả về số ngày
}

function returnBook(req,res) {
    const { item_id , date_borrow } = req.body;

    // Lệnh SQL để update giá trị cột user cho id = 2
    var sql = "UPDATE Book SET borrow_user = ?, issue = ? WHERE item_id = ?";
    var data = ['NULL', 0 , item_id]; // Dữ liệu truyền vào query

    // return book to table
    mysql.query(sql,data,(err,row)=>{
        if(err){
            console.log('Error in query data')
            throw err
        }
        
        // console.log('Done borrow book for '+ req.session.username);
        if(calculateDaysSince(date_borrow) >= 7){
            var sql = "UPDATE authen_user SET ban = ?, date_ban = ? WHERE user_name = ?";
            var data = [2, date_borrow , req.session.username]; // Dữ liệu truyền vào query
            console.log("user return book late !!! set ban")
            mysql.query(sql,data,(err,row)=>{
                if(err){
                    console.log('Error in query data')
                    throw err;
                }

                res.redirect("/home/account");
            });
        }else{
            console.log("user return book ontime")
            res.redirect("/home/account");
        }
    });
}


module.exports = {
    getAccountPage,
    returnBook
}