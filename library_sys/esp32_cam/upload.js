const express = require('express');
const mysql = require('../data_base/data_base')
const { exec } = require('child_process');// use for run python code
const multer = require('multer');
const path = require('path');

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
            const item_id = parseNumber(stdout);
            // res.json({ message: 'File uploaded and processed successfully!', result: stdout });
            // Lệnh SQL để update giá trị cột user cho id = 2


            // return book to table
            mysql.query('select * from Book where item_id = ? ',[item_id],(err,book)=>{
                console.log(`Book was borrow by ${book.borrow_user}`);

                if(calculateDaysSince(book.date_borrow) >= 7){
                    var sql = "UPDATE authen_user SET ban = ?, date_ban = ? WHERE user_name = ?";
                    var data = [2, book.date_borrow , req.session.username]; // Dữ liệu truyền vào query
                    console.log("user return book late !!! set ban")
                    mysql.query(sql,data,(err,row)=>{
                        if(err){
                            console.log('Error in query data')
                            throw err;
                        }
        
                        res.redirect("Ban sucess on upload route");
                    });
                }else{
                    console.log("user return book ontime")
                    // res.redirect("/home/account");
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
            });
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