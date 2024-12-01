const {mysql , topics} = require('../../data_base/data_base')
const {calculateDaysSince,formatDate } = require('./render_page');

const VALID = 1
const INVALID = 2

const NOTTHING = 0;
const BOOK_INVALID = 1;
const BOOK_NOT_BORROW = 2;
const BOOK_ONTIME = 3;
const BOOK_LATE = 4 ;
const BORROW_SUCESS = 5;
const BORROW_FAIL = 6;

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
            admin : req.session.admin,
            user : req.session.user_data
        }
        // console.log(sampleData);
        res.render('account', sampleData);
    })
}

function formatNumber(number) {
    return number.toString().padStart(2, '0');
}

const date = new Date();
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

function returnBook(req,res) {
    // can not use red.session in here
    const { user, book_id } = req.body; // Lấy dữ liệu từ client
    console.log('Received from client:', req.body);
    var user_index = 0;
    // check USER exist on database ?
    mysql.query('select * from authen_user' ,(err,authen_user_row)=>{
        var yesOrNo = false;
        authen_user_row.forEach((user_table, index) => {
            if(user_table.user_name == user){
                user_index = index;
                console.log(`Processing return book request from ${user}`);
                yesOrNo = true;
            }
        });
        if(yesOrNo == true){
            // check book
            mysql.query('select * from Book' ,(err,book_row)=>{ 
                var is_book_exist = false;
                var book_index = 0;
                var my_book ;
                book_row.forEach((item,index) => {
                    if(item.item_id == book_id){
                        is_book_exist = true;
                        book_index = index;
                        my_book = item;
                    }
                });
                if(is_book_exist == true){
                    console.log(my_book)
                    // find specific book => processing return book here
                    if(my_book.borrow_user == user && my_book.issue == 1){
                        // this book was borrow by this user
                        var sql = "UPDATE Book SET borrow_user = ?, issue = ? WHERE item_id = ?";
                        var data = ['NULL', 0 , book_id]; // Dữ liệu truyền vào query
                        // return book to table
                        mysql.query(sql,data,(err)=>{
                            if(err){
                                console.log('Error in query data')
                                throw err
                            }
                            if(calculateDaysSince(formatDate(my_book.date_borrow)) > authen_user_row[user_index].max_loan){
                                var date = new Date();
                                var  currentDate = formatDate(date)
                                var sql = "UPDATE authen_user SET ban = ?, date_ban = ? WHERE user_name = ?";
                                var data = [2, currentDate , user]; // Dữ liệu truyền vào query
                                console.log(`user return book late current date ${currentDate}!!! set ban`)
                                mysql.query(sql,data,(err)=>{
                                    if(err){
                                        console.log('Error in query data')
                                        throw err;
                                    }
                                    const responseStruct = {
                                        user: VALID, // invalid
                                        processCode: BOOK_LATE // set code process to zero
                                    };
                                    res.json(responseStruct);
                                    return ; 
                                });
                            }else{
                                console.log("user return book ontime")
                                const responseStruct = {
                                    user: VALID, // invalid
                                    processCode: BOOK_ONTIME // set code process to zero
                                };
                                res.json(responseStruct);
                                return ; 
                            }
                        }); 
                    }
                    else if (my_book.issue == 1){
                        // this book does not borrow by this user
                        console.log(`this ${my_book.book} book does not borrow by this user in MySql database`);
                        // Reply struct
                        const responseStruct = {
                            user: VALID, // invalid
                            processCode: BORROW_FAIL // set code process to zero
                        };
                        res.json(responseStruct);
                        return ;
                    }
                    else if (my_book.issue == 0){
                        // user want to borrow book
                        console.log(`${user} want to borrow this book`);
                        const sql = "UPDATE Book SET borrow_user = ?, issue = ?, date_borrow = ?, times_borrow = times_borrow + 1  WHERE item_id = ?";
                        const data = [user,1 ,get_date(), book_id]; // Dữ liệu truyền vào query

                        // Xử lý việc mượn sách ở đây
                        mysql.query(sql,data,(err,row)=>{
                            if(err){
                                console.log('Error in query data')
                                throw err
                            }
                            console.log('Done borrow book for '+ user);
                            // Reply struct
                            const responseStruct = {
                                user: VALID, // invalid
                                processCode: BORROW_SUCESS // set code process to zero
                            };
                            res.json(responseStruct);
                            return ;
                        });
                    }
                }
                else{
                    // this book does not exist in our data base
                    console.log(`Can not find ${my_book.book} in MySql database`);
                    // Reply struct
                    const responseStruct = {
                        user: VALID, // invalid
                        processCode: BOOK_INVALID // set code process to zero
                    };
                    res.json(responseStruct);
                    return ; 
                }
            });
        }
        else{
            console.log(`${user} does not exist in data base !!!`)
            // Tạo struct phản hồi
            const responseStruct = {
                user: INVALID, // invalid
                processCode: NOTTHING // set code process to zero
            };
            res.json(responseStruct);
            return ; 
        }
    });
    // Gửi phản hồi lại cho client
    // res.json(responseStruct);
    // const { item_id , date_borrow } = req.body;

    // Lệnh SQL để update giá trị cột user cho id = 2
    // var sql = "UPDATE Book SET borrow_user = ?, issue = ? WHERE item_id = ?";
    // var data = ['NULL', 0 , item_id]; // Dữ liệu truyền vào query

    // // return book to table
    // mysql.query(sql,data,(err,row)=>{
    //     if(err){
    //         console.log('Error in query data')
    //         throw err
    //     }
        
    //     console.log(`returnBook date_borrow = ${date_borrow}`);
    //     if(calculateDaysSince(date_borrow) >= req.session.user_data.max_loan){
    //         var date = new Date();
    //         var  currentDate = formatDate(date)
    //         var sql = "UPDATE authen_user SET ban = ?, date_ban = ? WHERE user_name = ?";
    //         var data = [2, currentDate , req.session.username]; // Dữ liệu truyền vào query
    //         console.log(`user return book late current date ${currentDate}!!! set ban`)
    //         mysql.query(sql,data,(err,row)=>{
    //             if(err){
    //                 console.log('Error in query data')
    //                 throw err;
    //             }

    //             res.redirect("/home/account");
    //         });
    //     }else{
    //         console.log("user return book ontime")
    //         res.redirect("/home/account");
    //     }
    // });
}


module.exports = {
    getAccountPage,
    returnBook
}