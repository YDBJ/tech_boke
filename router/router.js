// 路由
var express = require('express');

// 导入控制器
const controller = require('../controller/controller.js');
var router = express.Router()

router.get('/', controller.index)

router.get('/login', controller.login)

// 暴露
module.exports = router;