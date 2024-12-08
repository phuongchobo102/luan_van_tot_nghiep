const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Cấu hình multer để lưu trữ ảnh trong thư mục "uploads"
const storage = multer.diskStorage({
  destination: './uploads',
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file ảnh
  }
});

const upload = multer({ storage: storage });

// Endpoint để nhận ảnh
app.post('/upload', upload.single('image'), (req, res) => {
  try {
    console.log('File received:', req.file);
    res.json({ message: 'File uploaded successfully', file: req.file });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading file');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});




// // client.js
// const axios = require('axios');
// const fs = require('fs');
// const FormData = require('form-data');

// async function sendImage() {
//   try {
//     // Tạo form data và thêm file vào
//     const formData = new FormData();
//     formData.append('file', fs.createReadStream('./test_upload_file/barcode.jpg')); // Đường dẫn đến file ảnh

//     // Gửi yêu cầu POST đến server
//     const response = await axios.post('http://localhost:7000/upload', formData, {
//       headers: {
//         ...formData.getHeaders(), // Thiết lập headers cho form-data
//       },
//     });

//     console.log('Upload successful:', response.data);
//   } catch (error) {
//     console.error('Error uploading image:', error.response ? error.response.data : error.message);
//   }
// }
// function normalizeText(text) {
//     return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
// }

// function areStringsEquivalent(str1, str2) {
//     return normalizeText(str1) === normalizeText(str2);
// }

// // Example usage:
// const str1 = "giáo trình";
// const str2 = "giao trinh";

// if (areStringsEquivalent(str1, str2)) {
//     console.log("The strings are equivalent.");
// } else {
//     console.log("The strings are different.");
// }
// sendImage();