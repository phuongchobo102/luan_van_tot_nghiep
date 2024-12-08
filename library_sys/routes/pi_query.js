const express = require('express');
const bodyParser = require('body-parser');

const {mysql , topics} = require('../data_base/data_base')

const pi_2w_query_router = express.Router();

function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
// Endpoint nhận POST yêu cầu từ client
pi_2w_query_router.post('/pi_2w_query', (req, res) => {
    const { book, ibsn } = req.body;

    // In ra dữ liệu nhận được từ client
    console.log("Dữ liệu nhận được từ client:", book, ibsn);

    // return book to table
    mysql.query('select * from Book',(err,books)=>{
        const data = books.filter(uasser => 
            removeAccents(uasser.book).toLowerCase().includes(book.toLowerCase())
        );
        console.log(data.splice(3))
        data.forEach(book => {
            book.book = removeAccents(book.book);
            book.author = removeAccents(book.author);
        });
        res.json(data); // Trả về JSON
    });

    
});


module.exports = pi_2w_query_router