const express = require('express');
const book = require('./controller/controller_book')
const {mysql} = require('../data_base/data_base')

const book_router = express.Router();
global.topics = []
const query = 'SELECT DISTINCT topic FROM Book'; // Lấy các chủ đề khác nhau từ bảng Book
function removeAccents(str) {
    if (!str) {
        // Nếu str là null, undefined, hoặc rỗng, trả về chuỗi rỗng
        return "";
    }
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
mysql.query(query, (err, results) => {
    if (err) {
        console.error(err);
    }
    // Lưu kết quả vào biến topics
    // topics = results.map(row => ({
    //     name: row.topic,  // Giả sử cột 'topic' lưu tên chủ đề
    //     slug: removeAccents(row.topic.toLowerCase()).replace(/\s+/g, '-') // Tạo slug từ tên topic
    // }));
    results.forEach(row => {
        global.topics.push({ name: row.topic, slug: `/books/${removeAccents(row.topic.toLowerCase()).replace(/\s+/g, '-')}` });
    });

    // module.exports = topics
    

    book_router.get("/books", book.getBookPage);
    global.topics.forEach(topic => {
        // console.log(topic.slug)
        book_router.get(topic.slug, book.getTopicPage);
    });
    
// book_router.get('/books', book.getBookPage);

// book_router.post("/books/fiction", book.postFiction);

// book_router.get('/books/giao-trinh', book.getGiaoTrinh);

// book_router.post("/books/non-fiction", book.postNonFiction);

// book_router.get('/books/tham-khao', book.getThamKhao);

// book_router.post("/books/textbooks", book.postTextbooks);

// book_router.get('/books/tieu-thuyet', book.getTieuThuyet);

// book_router.post("/books/short-stories", book.postShortStories);

// book_router.get('/books/truyen', book.getTruyen);

// book_router.post("/books/others", book.postOthers);

// book_router.get('/books/khac', book.getKhac);
});





module.exports = book_router