// 路由
var express = require('express');
var router = express.Router()

// 添加
const multer = require('multer')
// 设置上传的目录
const upload = multer({
    dest: './uploads'
})

// 导入控制器
const controller = require('../controller/controller.js');
const request = require('../controller/request.js');


// 页面
// 首页
router.get('/', controller.index)
// 登录页面
router.get('/login', controller.login)
// 分类列表
router.get('/classify', controller.classify)
// 文章列表
router.get('/article', controller.article)
// 设置列表页面
router.get('/intercalate', controller.intercalate)
// 测试 （已应用）
router.get('/cs', controller.cs)
// 文章的添加
router.get('/addArticle', controller.addArticle)
// 文章的编辑
router.get('/editArticle', controller.editArticle)





// 逻辑
// 删除
router.get('/deluser', request.deluser)
// 编辑
router.post('/edit', request.edit)
// 添加
router.post('/addGoods', upload.single('pic'), request.addGoods)
// 公用头部的请求 公用标题
router.get('/title', request.title)
// 设置博客系统名
router.get('/inter', request.inter)
// 测试的路由
router.get('/css', request.css)
// 登录
router.post('/join', request.join)
// 退出登录
router.post('/quite', request.quite)
// 上传头像接口
router.post('/avatar', upload.single('file'), request.avatar)
// 保存信息
router.post('/keep', request.keep)
// 文章列表
router.get('/allarticle', request.allarticle)
// 修改密码
router.post('/revise', request.revise)
// 文章的删除
router.post('/dlteArticle', request.dlteArticle)
// 拿到所有的分类
router.get('/classifys', request.classifys)
// 文章提交
router.post('/addArtData', upload.single('pic'), request.addArtData)
// logo设置
router.post('/logoApi', upload.single('logopic'), request.logoApi)
// 获取文章单条数据的接口
router.get('/fetchOneArt',request.fetchOneArt)
// 更新文章编辑数据
router.post('/updArtData', upload.single('pic'), request.updArtData)




// 暴露
module.exports = router;