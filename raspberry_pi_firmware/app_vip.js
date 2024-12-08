const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

var  index =0;
// C?u h�nh multer d? luu tr? ?nh trong thu m?c "uploads"
const storage = multer.diskStorage({
  destination: './uploads',
  filename: function (req, file, cb) {

    cb(null, index.toString() + Date.now() + path.extname(file.originalname)); // �?t t�n file ?nh
    index++;
}
});

const upload = multer({ storage: storage });

// Endpoint d? nh?n ?nh
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