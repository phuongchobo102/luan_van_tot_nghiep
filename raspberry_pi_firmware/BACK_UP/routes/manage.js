const express = require('express');
const manage = require('./controller/controller_manage')


const manage_router = express.Router();


manage_router.get('/manage', manage.getmanagePage);

manage_router.post("/manage", manage.manageProcess);

manage_router.get("/manage/add-book", manage.addBookPage);

manage_router.get("/manage/delete-book", manage.deleteBookPage);

manage_router.get("/manage/thong-ke", manage.thongKePage);

manage_router.get("/manage/manage-user", manage.manageUserPage);

manage_router.post("/manage/add-book", manage.addBookProcess);

manage_router.post("/manage/delete-book", manage.deleteBookProcess);

manage_router.post("/manage/thong-ke", manage.thongKeProcess);

manage_router.post("/manage/manage-user", manage.manageUserProcess);

module.exports = manage_router