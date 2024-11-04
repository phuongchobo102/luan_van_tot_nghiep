const express = require('express');
const { exec } = require('child_process');// use for run python code
const multer = require('multer');
const path = require('path');

const upload_router = express.Router();

// Cấu hình multer để lưu hình ảnh vào thư mục uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Thư mục lưu trữ file
      },
      filename: (req, file, cb) => {
        cb(null, file.originalname); // Giữ nguyên tên file
      },
});

const upload = multer({ storage: storage }).single('file'); // `file` is the field name expected from client

// Định nghĩa route để nhận hình ảnh
upload_router.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'File uploaded successfully!' });

        exec('python3 uploads/scan_barcode.py', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python script: ${error.message}`);
                return res.status(500).json({ error: 'Error processing image with Python script' });
            }
            if (stderr) {
                console.error(`Python script error output: ${stderr}`);
                return res.status(500).json({ error: 'Python script encountered an error' });
            }
            
            console.log(`Python script output: ${stdout}`);
            // res.json({ message: 'File uploaded and processed successfully!', result: stdout });
        });
    });
});

module.exports = upload_router