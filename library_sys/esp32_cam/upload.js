const express = require('express');
const mysql = require('../data_base/data_base')
const { exec } = require('child_process');// use for run python code
const multer = require('multer');
// const path = require('path');
const {calculateDaysSince,formatDate } = require('../routes/controller/render_page');

function parseNumber(str) {
    return parseInt(str, 10); // Chuyển chuỗi thành số nguyên
}

const upload_router = express.Router();

const storage = multer.diskStorage({
  destination: './esp32_cam/uploads',
  filename: function (req, file, cb) {

    cb(null, "barcode_image.jpg"); // set image name 
}
});

const upload = multer({ storage: storage });

// Endpoint d? nh?n ?nh
upload_router.post('/upload', upload.single('image'), (req, res) => {
    console.log("upload post router calling")
    try {
        // console.log('File received:', req.file);
        res.json({ message: 'File uploaded successfully', file: req.file });
        exec('python3 esp32_cam/scan_barcode.py', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python script: ${error.message}`);
                return res.status(500).json({ error: 'Error processing image with Python script' });
            }
            if (stderr) {
                console.error(`Python script error output: ${stderr}`);
                return res.status(500).json({ error: 'Python script encountered an error' });
            }
            // console.log(`Python s cript output: ${stdout}`);
            console.log(`data barcode scan ${parseNumber(stdout)}`);
            // console.log(stdout);
            const item_id = parseNumber(stdout);
            // res.json({ message: 'File uploaded and processed successfully!', result: stdout });
            // Lệnh SQL để update giá trị cột user cho id = 2
            console.log(item_id);

            if(!Number.isNaN(item_id)){
                // return book to table
                mysql.query('select * from Book' ,(err,row)=>{
                    if (err) {
                        console.error('Error executing query:', err.stack);
                        return;
                    }
                    // console.log(row[item_id]);
                    row.forEach((book,index) => {
                        if(book.item_id == item_id){
                            console.log(`${book.book} was borrow by ${book.borrow_user} issue ${book.issue}`);
                            if(book.issue == 1){
                                if(calculateDaysSince(book.date_borrow) >= req.session.user_data.max_loan){
                                    var date = new Date();
                                    var  currentDate = formatDate(date)
                                    var sql = "UPDATE authen_user SET ban = ?, date_ban = ? WHERE user_name = ?";
                                    var data = [2, currentDate , req.session.username]; // Dữ liệu truyền vào query
                                    console.log(`user return book late current date ${currentDate}!!! set ban`)
                                    mysql.query(sql,data,(err,row)=>{
                                        if(err){
                                            console.log('Error in query data')
                                            throw err;
                                        }
                        
                                        console.log("Ban sucess on upload route");
                                    });
                                }else{
                                    console.log("user return book ontime")
                                }
                                var sql = "UPDATE Book SET borrow_user = ?, issue = ? WHERE item_id = ?";
                                var data = ['NULL', 0 , item_id]; // Dữ liệu truyền vào query
                                mysql.query(sql,data,(err,row)=>{
                                    if(err){
                                        console.log('Error in query data')
                                        throw err
                                    }
                                    console.log(`Return book id ${item_id} sucess!!!`);
                                });
                            }
                            else if(book.issue == 0){
                                console.log("This book was not borrow by anyone !!! Do notthing")
                            }
                        }
                    });


                });
            }
            else{
                console.log(`Can not scan barcode data, please rescan again`);
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading file');
    }
});
// Định nghĩa route để nhận hình ảnh
// upload_router.post('/upload', (req, res) => {
//     console.log("upload post router calling")
//     upload(req, res, (err) => {
//         if (err) {
//             return res.status(500).json({ error: err.message });
//         }
//         res.json({ message: 'File uploaded successfully!' });

//         exec('python3 esp32_cam/scan_barcode.py', (error, stdout, stderr) => {
//             if (error) {
//                 console.error(`Error executing Python script: ${error.message}`);
//                 return res.status(500).json({ error: 'Error processing image with Python script' });
//             }
//             if (stderr) {
//                 console.error(`Python script error output: ${stderr}`);
//                 return res.status(500).json({ error: 'Python script encountered an error' });
//             }
            
//             console.log(`Python script output: ${stdout}`);
//             // res.json({ message: 'File uploaded and processed successfully!', result: stdout });
//         });
//     });
// });
// console.log("phuong dep trai")
// exec('python3 esp32_cam/scan_barcode.py', (error, stdout, stderr) => {
//     if (error) {
//         console.error(`Error executing Python script: ${error.message}`);
//         return res.status(500).json({ error: 'Error processing image with Python script' });
//     }
//     if (stderr) {
//         console.error(`Python script error output: ${stderr}`);
//         return res.status(500).json({ error: 'Python script encountered an error' });
//     }
    
//     console.log(`Python script output: ${stdout}`);
//     // res.json({ message: 'File uploaded and processed successfully!', result: stdout });
// });

module.exports = upload_router