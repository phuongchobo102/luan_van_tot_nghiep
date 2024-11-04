const express = require('express');
const home = require('./controller/controller_home')


const home_router = express.Router();

home_router.get('/', home.redirectHomePage);

home_router.get('/home', home.getHomePage);

home_router.post("/home", home.borrow);

home_router.post("/home/search", home.search);

module.exports = home_router