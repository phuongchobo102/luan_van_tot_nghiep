const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 7000;

// Middleware để parse JSON
app.use(bodyParser.json());

// Endpoint nhận POST yêu cầu từ client
app.post('/pi_2w_query', (req, res) => {
    const { book, ibsn } = req.body;

    // In ra dữ liệu nhận được từ client
    console.log("Dữ liệu nhận được từ client:", book, ibsn);

    // Trả về dữ liệu books
    const books = [
        {"name": "sach 1", "author": "Nguyễn Văn A", "status": "yes"},
        {"name": "sach 2", "author": "Trần Văn B", "status": "no"},
        {"name": "phuong dep trai", "author": "Lê Thị C", "status": "no"}
    ];

    res.json(books); // Trả về JSON
});

// Bắt đầu server
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});