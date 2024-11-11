const express = require('express');
const book = require('./controller/controller_book')


const book_router = express.Router();

// book_router.post("/books", book.getBookPage);

book_router.get('/books', book.getBookPage);

// book_router.post("/books/fiction", book.postFiction);

book_router.get('/books/giao-trinh', book.getGiaoTrinh);

// book_router.post("/books/non-fiction", book.postNonFiction);

book_router.get('/books/tham-khao', book.getThamKhao);

// book_router.post("/books/textbooks", book.postTextbooks);

book_router.get('/books/tieu-thuyet', book.getTieuThuyet);

// book_router.post("/books/short-stories", book.postShortStories);

book_router.get('/books/truyen', book.getTruyen);

// book_router.post("/books/others", book.postOthers);

book_router.get('/books/khac', book.getKhac);

module.exports = book_router