const {mysql , topics} = require('../../data_base/data_base')
const { renderPage } = require('./render_page');
function getBookPage(req,res){
    mysql.query('select * from Book' ,(err,row)=>{
        if(err){
          console.log('Error in query data')
          throw err
        }
        // store row
        // Lọc các row có giá trị user = 'test'
        const user_name = req.session.username

        var books = row.filter(row => row.issue == 0);

        const ban = req.session.ban;
        const time_unlock = req.session.date_ban;
        const  admin = req.session.admin;

        books = books.slice(0, 100);
        var topics = global.topics
        renderPage(res,'book',{user_name,books,ban,time_unlock, admin ,topics});
    })
}

function getTopicPage(req,res){
    console.log("get topic page")
    mysql.query('select * from Book' ,(err,row)=>{
        if(err){
          console.log('Error in query data')
          throw err
        }
        // store row
        // Lọc các row có giá trị user = 'test'
        const user_name = req.session.username

        var books = row.filter(row => row.issue == 0);
        var filter_topic
        console.log(global.topics)
        global.topics.forEach(topic => {
            console.log(global.topics)
            if (topic.slug == req.path)
                filter_topic = topic.name
        });
        console.log(filter_topic)
        books = row.filter(row => row.topic == filter_topic);
        const ban = req.session.ban;
        const time_unlock = req.session.date_ban;
        const  admin = req.session.admin;

        books = books.slice(0, 100);
        var topics = global.topics
        console.log(books)

        renderPage(res,'book',{user_name,books,ban,time_unlock, admin ,topics});
    })
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
    getKhac,
    getTopicPage
}

