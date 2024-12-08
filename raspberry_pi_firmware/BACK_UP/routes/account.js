const express = require('express');
const account = require('./controller/controller_account')


const account_router = express.Router();

// account_router.get('/', account.redirectaccountPage);

account_router.get('/home/account', account.getAccountPage);

account_router.post("/home/account", account.returnBook);

module.exports = account_router