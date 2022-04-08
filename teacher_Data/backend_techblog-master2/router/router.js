var express = require('express')
var router = express.Router()

// 导入控制器模块
const IndexController = require('../controller/IndexController.js')
const CateController = require('../controller/CateController.js')
const ArtController = require('../controller/ArtController.js')

// 后台首页
router.get('/', IndexController.index)
// 展示分类列表页面
router.get('/catelist', CateController.index)
router.get('/artlist', ArtController.index)
// 后台登录页
router.get('/login', IndexController.login)
router.get('/test', IndexController.test)
router.get('/apiData', IndexController.apiData)

// 分类列表数据接口
router.get('/cateData', CateController.cateData)

// 编辑分类的接口  
router.post('/updCateData', CateController.updCateData)
module.exports = router;