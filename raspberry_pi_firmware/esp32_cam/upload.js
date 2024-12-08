const express = require('express');
const { exec } = require('child_process');// use for run python code
const multer = require('multer');
const path = require('path');
const  rfid  = require('../pi-rfid/rfid_task')
const axios = require('axios');

const upload_router = express.Router();

const VALID = 1
const INVALID = 2

const NOTTHING = 0;
const BOOK_INVALID = 1;
const BOOK_NOT_BORROW = 2;
const BOOK_ONTIME = 3;
const BOOK_LATE = 4 ;
const BORROW_SUCESS = 5;
const BORROW_FAIL = 6;

function handle_lcd(data){

console.log(data.user)
console.log(data.processCode )
if(Number(data.user) == INVALID ){
	console.log("LCD invalid user")
	rfid.lcd("Invalid user!", 2);
	return ; 
}
if(data.processCode == BOOK_INVALID){
	console.log("LCD invalid Book")
	rfid.lcd("Invalid Book!", 2);
	return ;
}
else if(data.processCode == BOOK_ONTIME || data.processCode == BOOK_LATE ){
	console.log("LCD return sucess")
	rfid.lcd("Return sucess!", 2);
	return ;
}
else if(data.processCode == BORROW_SUCESS ){
	console.log("LCD return sucess")
	rfid.lcd("Borrow sucess!", 2);
	return ;
}
else if(data.processCode == BORROW_FAIL ){
	console.log("LCD return sucess")
	rfid.lcd("Borrow Fail!", 2);
	return ;
}


console.log("end handle_lcd")
}

const storage = multer.diskStorage({
  destination: './esp32_cam/uploads',
  filename: function (req, file, cb) {

    cb(null, "barcode_image.jpg"); // set image name 
}
});

function parseNumber(str) {
    return parseInt(str, 10); // Chuy?n chu?i th�nh s? nguy�n
}

const upload = multer({ storage: storage });

// Endpoint d? nh?n ?nh
upload_router.post('/upload', upload.single('image'), async (req, res) => {
    console.log("upload post router calling")
    // try {
    //     // console.log('File received:', req.file);
    //     res.json({ message: 'File uploaded successfully', file: req.file });
    //     exec('python3 esp32_cam/scan_barcode.py',async  (error, stdout, stderr) => {
    //         if (error) {
    //             console.error(`Error executing Python script: ${error.message}`);
    //             return res.status(500).json({ error: 'Error processing image with Python script' });
    //         }
    //         if (stderr) {
    //             console.error(`Python script error output: ${stderr}`);
    //             return res.status(500).json({ error: 'Python script encountered an error' });
    //         }
            
    //         console.log(`Python script output: ${stdout}`);
	//     const item_id = parseNumber(stdout);
	//     console.log(item_id);

	//     if(!Number.isNaN(item_id)){
    // 	    	rfid.structToSend.book_id = item_id ;
	//     	try {
    //         	  	const response = await axios.post('http://192.168.137.1:7000/home/account', rfid.structToSend);
    //     		console.log('Response from server:', response.data);
	// 		handle_lcd(response.data);
    // 	    	} 
	//     	catch (error) {
    //         	 	console.error('Error:', error.message);
    //         	}

    //         }
	//     else{
	// 	console.log("Can not scan barcode, please try again")
	// 	return;
    //         }

    //         // res.json({ message: 'File uploaded and processed successfully!', result: stdout });
	//     // rfid.structToSend.user = stdout.trim().replace(/\n$/, '');





    //     });
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).send('Error uploading file');
    // }
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