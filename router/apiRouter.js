var express = require('express')
var router = express.Router()

// 导入Home控制器
const HomeController = require('../controller/HomeController.js')

// 编辑文章接口
router.get('/article', HomeController.article)

// 分类 
router.get('/cate', HomeController.cate)

// 详情接口
router.get('/fetchOneArt', HomeController.fetchOneArt)

// 分类列表接口
router.get('/fetchCateArt', HomeController.fetchCateArt)

module.exports = router;