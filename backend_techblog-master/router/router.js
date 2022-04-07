var express = require('express')
var router = express.Router()

// 导入控制器模块
const IndexController = require('../controller/IndexController.js')

// 后台首页
router.get('/', IndexController.index)
// 后台登录页
router.get('/login', IndexController.login)

module.exports = router;