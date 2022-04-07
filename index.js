const express = require('express')
const app = express()
const path = require('path')

// 导入路由模块
const router = require('./router/router.js')
// 引用
app.use(router)

// 设置托管静态资源
app.use('/assets', express.static(path.join(__dirname, 'assets')))

app.listen(3000, () => {
    console.log('running');
})