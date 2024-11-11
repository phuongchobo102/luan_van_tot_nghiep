const mysql = require('../../data_base/data_base')

function getBookPage(req,res){
    // console.log('render home page now ~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    console.log(`Get fiction\n`);

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
        res.render('book', {user_name,books,ban,time_unlock,admin});
    })
    
    // res.redirect("/login");
}

function getGiaoTrinh(req,res){
    // console.log('render home page now ~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    // console.log(`Get fiction\n`);

    mysql.query('select * from Book' ,(err,row)=>{
        if(err){
          console.log('Error in query data')
          throw err
        }
        // store row
        // Lọc các row có giá trị user = 'test'
        const user_name = req.session.username
        const books = row.filter(row => ((row.issue == 0) && (row.topic == 'Sách giáo trình')));
        const ban = req.session.ban;
        const time_unlock = req.session.date_ban;
        const  admin = req.session.admin;
        res.render('book', {user_name,books,ban,time_unlock,admin});
    })
    
}

function getThamKhao(req,res){
    // console.log('render home page now ~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    // console.log(`Get fiction\n`);

    mysql.query('select * from Book' ,(err,row)=>{
        if(err){
          console.log('Error in query data')
          throw err
        }
        // store row
        // Lọc các row có giá trị user = 'test'
        const user_name = req.session.username
        const books = row.filter(row => ((row.issue == 0) && (row.topic == 'Sách tham khảo')));
        const ban = req.session.ban;
        const time_unlock = req.session.date_ban;
        const  admin = req.session.admin;
        res.render('book', {user_name,books,ban,time_unlock,admin});
    })
    
}
function getTieuThuyet(req,res){
    // console.log('render home page now ~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    // console.log(`Get fiction\n`);

    mysql.query('select * from Book' ,(err,row)=>{
        if(err){
          console.log('Error in query data')
          throw err
        }
        // store row
        // Lọc các row có giá trị user = 'test'
        const user_name = req.session.username
        const books = row.filter(row => ((row.issue == 0) && (row.topic == 'Tiểu thuyết')));
        const ban = req.session.ban;
        const time_unlock = req.session.date_ban;
        const  admin = req.session.admin;
        res.render('book', {user_name,books,ban,time_unlock,admin});
    })
    
}
function getTruyen(req,res){
    // console.log('render home page now ~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    // console.log(`Get fiction\n`);

    mysql.query('select * from Book' ,(err,row)=>{
        if(err){
          console.log('Error in query data')
          throw err
        }
        // store row
        // Lọc các row có giá trị user = 'test'
        const user_name = req.session.username
        const books = row.filter(row => ((row.issue == 0) && (row.topic == 'Truyện')));
        const ban = req.session.ban;
        const time_unlock = req.session.date_ban;
        const  admin = req.session.admin;
        res.render('book', {user_name,books,ban,time_unlock,admin});
    })
    
}
function getKhac(req,res){
    // console.log('render home page now ~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    // console.log(`Get fiction\n`);

    mysql.query('select * from Book' ,(err,row)=>{
        if(err){
          console.log('Error in query data')
          throw err
        }
        // store row
        // Lọc các row có giá trị user = 'test'
        const user_name = req.session.username
        const books = row.filter(row => ((row.issue == 0) && (row.topic == 'Khác')));
        const ban = req.session.ban;
        const time_unlock = req.session.date_ban;
        const  admin = req.session.admin;
        res.render('book', {user_name,books,ban,time_unlock,admin});
    })
    
}

// MediaSourceHandle.export getLoginPage;
module.exports = {
    getBookPage,
    getGiaoTrinh,
    getThamKhao,
    getTieuThuyet,
    getTruyen,
    getKhac
}

