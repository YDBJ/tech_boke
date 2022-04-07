// 控制器
const path = require('path')
const controller = {};

// 导入MySQL模型
const query = require('../model/query.js')

controller.index = async (req, res) => {
    // const sql = 'select * from article'
    // const rows = await query(sql)
    // res.json(rows)
    res.sendFile(path.join(__dirname, '../views/index.html'))
}

controller.login = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'))
}

// 暴露
module.exports = controller;